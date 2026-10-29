#!/usr/bin/env node
// Turns a HyperFrames transcript into the word list the cutters read:
//   { "words": [ { "text", "start", "end" } ], "audio_duration_secs" }
// Speech engines often stretch the last word before a pause across the pause,
// which hides it from cut-silences. So each word is checked against the
// recording's real silences (ffmpeg silencedetect) and trimmed back to the audio.
//
// Usage: node words.mjs <transcript.json> --video <recording> [--out <file>]
//                       [--noise -35] [--min-silence 0.35]

import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, extname, join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const input = args[0];
const video = opt('video');
if (!input || input.startsWith('--') || !video) {
  console.error('Usage: node words.mjs <transcript.json> --video <recording> [--out <file>] [--noise -35] [--min-silence 0.35]');
  process.exit(1);
}
const noise = Number(opt('noise', -35));
const minSilence = Number(opt('min-silence', 0.35));
const out = opt('out', join(dirname(input), `${basename(video, extname(video))}.words.json`));
const MIN_SOUND = 0.06; // a word keeps at least this much of its own audio

const raw = JSON.parse(readFileSync(input, 'utf8'));
const words = (Array.isArray(raw) ? raw : raw.words || [])
  .filter((w) => w && typeof w.text === 'string' && Number.isFinite(w.start) && Number.isFinite(w.end))
  .map(({ text, start, end }) => ({ text: text.trim(), start, end }))
  .filter((w) => w.text);
if (!words.length) {
  console.error(`No words found in ${input}. Was anything said in the recording?`);
  process.exit(1);
}

const run = (cmd, cmdArgs) => {
  const r = spawnSync(cmd, cmdArgs, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.error) {
    console.error(`Could not run ${cmd}: ${r.error.message}. Is FFmpeg installed?`);
    process.exit(1);
  }
  return r;
};

const duration = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video]).stdout.trim());
const detect = run('ffmpeg', ['-hide_banner', '-nostats', '-i', video, '-vn', '-af', `silencedetect=noise=${noise}dB:d=${minSilence}`, '-f', 'null', '-']).stderr;

const silences = [];
for (const line of detect.split('\n')) {
  const s = line.match(/silence_start: (-?[\d.]+)/);
  const e = line.match(/silence_end: ([\d.]+)/);
  if (s) silences.push({ start: Math.max(0, Number(s[1])), end: duration || Infinity });
  if (e && silences.length) silences[silences.length - 1].end = Number(e[1]);
}

let adjusted = 0;
for (const sil of silences) {
  for (const w of words) {
    if (w.end <= sil.start || w.start >= sil.end) continue;
    if (sil.start - w.start >= MIN_SOUND && sil.start < w.end) {
      w.end = sil.start;
      adjusted++;
    } else if (w.end - sil.end >= MIN_SOUND && sil.end > w.start) {
      w.start = sil.end;
      adjusted++;
    }
  }
}
for (const w of words) {
  w.start = Math.round(w.start * 1000) / 1000;
  w.end = Math.round(Math.max(w.end, w.start + 0.04) * 1000) / 1000;
}

writeFileSync(out, JSON.stringify({ words, audio_duration_secs: duration || words.at(-1).end }, null, 2));
console.log(JSON.stringify({
  output: out,
  words: words.length,
  durationSecs: duration,
  silencesFound: silences.length,
  wordsTrimmedToAudio: adjusted,
  opening: words.slice(0, 20).map((w) => w.text).join(' '),
}, null, 2));
