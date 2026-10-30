---
name: kie
description: Every Kie.ai request in this folder goes through this skill. It opens the key file for the person to paste their Kie key, checks their credit balance, and sends generation requests without the key ever being shown. Use it with Kie's own kie-models skill, which says which model to use, what to send and what it costs. Never call Kie with curl or read the key yourself.
---

# Kie

`.env` is off limits to the assistant's own tools. This script is the only thing that touches it. It reads the key, sends it only to `api.kie.ai`, and never prints it.

```bash
node .claude/skills/kie/scripts/kie.mjs key         # opens .env in TextEdit / Notepad
node .claude/skills/kie/scripts/kie.mjs balance     # free credit check
node .claude/skills/kie/scripts/kie.mjs call POST /api/v1/jobs/createTask @<project>/assets/kie-task.json
node .claude/skills/kie/scripts/kie.mjs call GET "/api/v1/jobs/recordInfo?taskId=<id>"
```

## Saving the key

1. Ask them to sign in at kie.ai/api-key and copy their key with its copy button.
2. Run `key`. TextEdit (Mac) or Notepad (Windows) opens, showing `KIE_API_KEY=`.
3. Tell them: paste the key straight after the `=`, save (⌘S on a Mac, Ctrl+S on Windows), then close the window and say "done".
4. Run `balance`. If it says the key is wrong, run `key` again so they can fix it.

## Making something

1. **Choose.** Use `kie-models` to choose the model and build the request: its endpoint, its JSON body and its price.
2. **Ask first.** Tell the person the model and the credit cost, and wait for a yes.
3. **Send.** Write the JSON body to `<project>/assets/kie-task.json` and send it with `call POST`. Then poll with `call GET` until the task finishes.
4. **Save.** Download each result into the media library by type: images to `media-library/ai-photos/`, video clips to `ai-clips/`, music to `music/`. The result links need no key, so plain `curl -o` is fine. Keep the task id.

Where `kie-models` shows `curl … -H "Authorization: Bearer $KIE_API_KEY"`, send the same method, path and body through `call` instead.
