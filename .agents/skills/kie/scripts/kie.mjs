#!/usr/bin/env node
// A shim, like the Tella one in Kumar's own workspace: the only thing in this folder
// that touches .env. The assistant's own tools are blocked from it (.claude/settings.json
// in Claude Code), so Kie's commands run through here with the key loaded into their
// environment. Anything they print has the key blanked out.
//
//   node .claude/skills/kie/scripts/kie.mjs key      open .env in TextEdit / Notepad to paste the key
//   node .claude/skills/kie/scripts/kie.mjs run <<'EOF'
//   curl -s -H "Authorization: Bearer $KIE_API_KEY" https://api.kie.ai/api/v1/chat/credit
//   EOF

import { existsSync, readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const ENV = resolve(ROOT, '.env');
const KEY_LINE = /^\s*KIE_API_KEY\s*=/;

function readKey() {
  if (!existsSync(ENV)) return '';
  const line = readFileSync(ENV, 'utf8').split(/\r?\n/).find((l) => KEY_LINE.test(l)) || '';
  return line.replace(KEY_LINE, '').replace(/["'“”‘’\s]/g, '');
}

const [cmd, ...rest] = process.argv.slice(2);

if (cmd === 'key') {
  if (!existsSync(ENV)) {
    writeFileSync(ENV, 'KIE_API_KEY=\n');
    try { chmodSync(ENV, 0o600); } catch {}
  }
  const [app, args] = process.platform === 'darwin' ? ['open', ['-e', ENV]] : ['notepad', [ENV]];
  spawn(app, args, { stdio: 'ignore', detached: true }).unref();
  console.log('Opened the key file. Paste the key straight after KIE_API_KEY=, then save and close it.');
} else if (cmd === 'run') {
  const key = readKey();
  if (!key) {
    console.error('No Kie key saved yet. Run key, paste it after KIE_API_KEY=, then save and close.');
    process.exit(1);
  }
  const script = rest.length ? rest.join(' ') : readFileSync(0, 'utf8');
  // On Windows, use Git's bash, not WSL's (C:\Windows\System32\bash.exe), which doesn't
  // receive the key.
  const e = process.env;
  const bash = process.platform !== 'win32' ? 'bash'
    : [e.CLAUDE_CODE_GIT_BASH_PATH, `${e.ProgramFiles}\\Git\\bin\\bash.exe`,
       `${e['ProgramFiles(x86)']}\\Git\\bin\\bash.exe`, `${e.LOCALAPPDATA}\\Programs\\Git\\bin\\bash.exe`]
        .find((p) => p && existsSync(p)) || 'bash';
  const r = spawnSync(bash, ['-c', script], {
    cwd: process.cwd(),
    env: { ...process.env, KIE_API_KEY: key },
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  const blank = (text) => (text || '').split(key).join('[key]');
  process.stdout.write(blank(r.stdout));
  process.stderr.write(blank(r.stderr));
  if (r.error) console.error(`Couldn't run the command: ${r.error.message}`);
  process.exit(r.status ?? 1);
} else {
  console.error("Usage: kie.mjs key | run <<'EOF' … EOF");
  process.exit(1);
}
