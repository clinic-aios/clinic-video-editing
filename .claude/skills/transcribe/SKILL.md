---
name: transcribe
description: Makes a word-by-word transcript of a recording on this computer, ready for cut-silences and cut-mistakes. Use as the first step of every edit, or whenever a recording needs a transcript. Keeps stutters, restarts and "um"s so mistakes can be found. The recording is never uploaded.
---

# Transcribe

Step 1 of every edit. Produces `<recording-name>.words.json`, the shape the cutters read: `{ "words": [ { "text", "start", "end" } ], "audio_duration_secs" }`, in seconds on the recording's own timeline.

```bash
npx --yes hyperframes transcribe "<recording>" --dir "<project>/assets" --json
node .claude/skills/transcribe/scripts/words.mjs "<project>/assets/transcript.json" --video "<recording>"
```

1. **HyperFrames transcribes** with its local speech engine and writes `transcript.json` into `--dir`. The JSON it prints names the engine. It must say `parakeet`. If it says `whisper`, stop: Whisper tidies away stutters and restarts, so `cut-mistakes` would find nothing. Install Parakeet with `npx --yes hyperframes models install parakeet`, then transcribe again. A long recording takes a few minutes.
2. **`words.mjs` lines the words up with the audio.** Speech engines often stretch the word before a pause right across it, which hides the pause from `cut-silences`. The script checks every word against the recording's real silences, trims it back, and writes `<recording-name>.words.json` next to the transcript. It prints the word count, how many words it trimmed and the opening words.
3. **Check with the person.** Show them the opening words and ask if that's what they said. Misspelt names are fixed later, in the captions, not here.

Hand `<recording-name>.words.json` and the recording to `cut-silences`. Ignore the ElevenLabs transcriber that `cut-silences` mentions: this starter transcribes on the computer.

## If something looks wrong

- **No pauses were cut later, though there were long ones:** the room was noisy. Run `words.mjs` again with `--noise -30`. Never go above `-25`, or quiet speech starts counting as silence.
- **"No words found":** check the recording has sound (`ffprobe "<recording>"` should list an audio stream).
- **Very slow:** Parakeet runs on the computer's processor. Ten minutes of speech can take a few minutes on an older laptop. Let it finish.
