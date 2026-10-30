---
name: kie
description: Every Kie.ai request in this folder runs through this skill. Kie's own kie-models skill says which model to use, what to send and what it costs, with ready-made curl commands; run those commands through this skill's `run`, which loads the Kie key from .env without it ever being shown. Also opens the key file for the person to paste their key. Never read .env or the key yourself.
---

# Kie

A shim, so the key is never shown. `.env` is off limits to the assistant's own tools, and this script is the only thing that touches it.

```bash
node .claude/skills/kie/scripts/kie.mjs key    # opens .env in TextEdit / Notepad
node .claude/skills/kie/scripts/kie.mjs run <<'EOF'
<a command from kie-models, word for word>
EOF
```

## Saving the key

1. Ask them to sign in at kie.ai/api-key and copy their key with its copy button.
2. Run `key`. TextEdit (Mac) or Notepad (Windows) opens, showing `KIE_API_KEY=`.
3. Tell them: paste the key straight after the `=`, save (⌘S on a Mac, Ctrl+S on Windows), then close the window and say "done".
4. Check it with the free balance call:
   ```bash
   node .claude/skills/kie/scripts/kie.mjs run <<'EOF'
   curl -s -H "Authorization: Bearer $KIE_API_KEY" https://api.kie.ai/api/v1/chat/credit
   EOF
   ```
   A `"code":200` reply shows their credits. A 401 means the key is wrong, so run `key` again for them to fix it.

## Running Kie's commands

- **Look-ups, uploads, generation and polling** all go through `run`: every command `kie-models` shows, copied word for word between the `EOF` lines. Keep the quoted `<<'EOF'`, so `$KIE_API_KEY` reaches the command unexpanded and the key is filled in only inside it.
- **One `run` is one bash script.** Several lines are fine, and variables last until its `EOF`.
- **Anything printed** has the key replaced with `[key]`. Never try to print it.
- **`jq`:** Kie's examples use it. If it's missing, leave that part off and read the JSON yourself.
- **Before every generation,** tell the person the model and the credit cost, and wait for a yes.
- **Save each result** into the media library by type: images to `media-library/ai-photos/`, video clips to `ai-clips/`, music to `music/`. Result links need no key, so a plain `curl -o` is fine. Keep the task id.
