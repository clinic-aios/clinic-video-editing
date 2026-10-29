#!/usr/bin/env node
// The only thing in this folder that touches .env. Claude's own tools are blocked from
// it (.claude/settings.json), so every Kie.ai request goes through here. The key is
// read here, sent only to api.kie.ai, and never printed.
//
//   node .claude/skills/kie/scripts/kie.mjs set-key     save the key from the clipboard
//   node .claude/skills/kie/scripts/kie.mjs edit-key    fallback: open .env to paste it by hand
//   node .claude/skills/kie/scripts/kie.mjs balance     free credit check
//   node .claude/skills/kie/scripts/kie.mjs call <GET|POST> <path> [json | @file.json]
//     e.g. call POST /api/v1/jobs/createTask @video-projects/x/assets/kie-task.json
//          call GET "/api/v1/jobs/recordInfo?taskId=<id>"

import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const ENV = resolve(ROOT, '.env');
const API = 'https://api.kie.ai';
const KEY_LINE = /^\s*KIE_API_KEY\s*=/;

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

function readKey() {
  if (!existsSync(ENV)) return '';
  const line = readFileSync(ENV, 'utf8').split(/\r?\n/).find((l) => KEY_LINE.test(l)) || '';
  return line.replace(KEY_LINE, '').replace(/["'\s]/g, '');
}

function saveKey(key) {
  const others = existsSync(ENV)
    ? readFileSync(ENV, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !KEY_LINE.test(l))
    : [];
  writeFileSync(ENV, [...others, `KIE_API_KEY=${key}`, ''].join('\n'));
  try { chmodSync(ENV, 0o600); } catch {}
}

function clipboard() {
  const [cmd, args] = process.platform === 'darwin' ? ['pbpaste', []]
    : process.platform === 'win32' ? ['powershell', ['-NoProfile', '-Command', 'Get-Clipboard']]
    : ['xclip', ['-o', '-selection', 'clipboard']];
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  if (r.error || r.status !== 0) fail(`Couldn't read the clipboard. Use edit-key instead.`);
  return r.stdout.replace(/\s/g, '');
}

const redact = (text, key) => (key ? text.split(key).join('[key]') : text);

async function request(method, path, body) {
  const key = readKey();
  if (!key) fail('No Kie key saved yet. Copy it on kie.ai/api-key, then run set-key.');
  if (!/^\/api\//.test(path)) fail('The path must start with /api/ (requests only ever go to api.kie.ai).');
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: method === 'GET' ? undefined : body,
  });
  const text = redact(await res.text(), key);
  let code = res.status;
  try { code = JSON.parse(text).code ?? code; } catch {} // Kie puts its own status in the body
  if (code === 401) fail('Kie says the key is wrong (401). Copy it again on kie.ai/api-key, then run set-key.');
  if (code === 402) fail('Not enough Kie credits (402). Top up at kie.ai.');
  if (!res.ok || code >= 400) fail(`Kie replied ${code}: ${text}`);
  console.log(text);
}

const [cmd, ...rest] = process.argv.slice(2);

if (cmd === 'set-key') {
  const key = clipboard();
  if (key.length < 20 || !/^[A-Za-z0-9_\-.]+$/.test(key)) {
    fail(`The clipboard doesn't look like a Kie key (${key.length} characters). Copy the key on kie.ai/api-key and try again.`);
  }
  saveKey(key);
  console.log(`Saved the Kie key (${key.length} characters). Run balance to check it works.`);
} else if (cmd === 'edit-key') {
  if (!readKey() && !existsSync(ENV)) saveKey('');
  const [open, args] = process.platform === 'darwin' ? ['open', ['-e', ENV]] : ['notepad', [ENV]];
  spawnSync(open, args, { stdio: 'ignore', detached: process.platform !== 'darwin' });
  console.log('Opened the key file. Paste the key straight after KIE_API_KEY=, then save and close it.');
} else if (cmd === 'balance') {
  await request('GET', '/api/v1/chat/credit');
} else if (cmd === 'call') {
  const [method = '', path = '', body] = rest;
  if (!['GET', 'POST'].includes(method.toUpperCase())) fail('Usage: call <GET|POST> <path> [json | @file.json]');
  const payload = body?.startsWith('@') ? readFileSync(resolve(body.slice(1)), 'utf8') : body;
  await request(method.toUpperCase(), path, payload);
} else {
  fail('Usage: kie.mjs set-key | edit-key | balance | call <GET|POST> <path> [json | @file.json]');
}
