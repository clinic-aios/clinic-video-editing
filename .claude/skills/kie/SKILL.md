---
name: kie
description: Every Kie.ai request in this folder goes through this skill. It saves the person's Kie key, checks their credit balance, and sends generation requests without the key ever being shown. Use it with Kie's own kie-models skill, which says which model to use, what to send and what it costs. Never call Kie with curl or read the key yourself.
---

# Kie

`.env` is off limits to Claude's own tools. This script is the only thing that touches it. It reads the key, sends it only to `api.kie.ai`, and never prints it.

```bash
node .claude/skills/kie/scripts/kie.mjs set-key     # save the key from the clipboard
node .claude/skills/kie/scripts/kie.mjs edit-key    # fallback: opens .env so they paste it by hand
node .claude/skills/kie/scripts/kie.mjs balance     # free credit check
node .claude/skills/kie/scripts/kie.mjs call POST /api/v1/jobs/createTask @<project>/assets/kie-task.json
node .claude/skills/kie/scripts/kie.mjs call GET "/api/v1/jobs/recordInfo?taskId=<id>"
```

## Saving the key

1. Ask them to sign in at kie.ai/api-key, copy their key with its copy button, and say "copied".
2. Run `set-key`.
3. Run `balance`.

They never paste the key anywhere. If `set-key` says the clipboard doesn't hold a key, they copy it again. If the clipboard can't be read at all, use `edit-key` and tell them to paste it after `KIE_API_KEY=`, then save and close.

## Making something

1. **Choose.** Use `kie-models` to choose the model and build the request: its endpoint, its JSON body and its price.
2. **Ask first.** Tell the person the model and the credit cost, and wait for a yes.
3. **Send.** Write the JSON body to `<project>/assets/kie-task.json` and send it with `call POST`. Then poll with `call GET` until the task finishes.
4. **Save.** Download the result URLs into `media-library/kie/`. The result links need no key, so plain `curl -o` is fine. Keep the task id.

Where `kie-models` shows `curl … -H "Authorization: Bearer $KIE_API_KEY"`, send the same method, path and body through `call` instead.
