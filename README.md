# Clinic Video Editing

Record yourself talking to camera. Your AI assistant cuts the pauses and the slips, then adds your clinic's brand graphics and captions and renders the finished video, ready for YouTube, a reel or your website. Your recordings are edited on your own computer and never uploaded: the assistant works from their transcripts and the stills it checks.

## What you need

- Claude Desktop, using its **Code** tab. (The setup is written to work in Codex too, but it's only been tested in Claude so far.)
- A Mac or Windows PC you can install software on, with about 5 GB free.
- Optional: your clinic's design system in Claude, for brand colours and fonts.
- Optional: a [Kie.ai](https://kie.ai) account with credits, for generated images, clips and music.

## Patient data: read this first

- **Never** put special category patient health data into an AI chat.
- **Never** give your AI assistant access to folders or files that hold it.
- **Never** connect your AI assistant to systems that hold it.
- Patients can appear in your clinic's videos only with their explicit written consent: separate from consent to treatment, naming where the video will be published, and theirs to withdraw at any time. Even then, edit those recordings somewhere else, not here: a video showing a patient holds their health data.
- Recordings you edit here: no patients, no patient names, no screens from your clinic systems.

## Set up

1. Create a folder called `clinic-video-editing` in your home folder. Avoid Desktop and Documents if they sync to iCloud or OneDrive.
2. Open it in Claude Desktop's **Code** tab, or your AI coding app.
3. Paste this:

> Set up clinic video editing in this folder. Download the setup guide with `curl -fsSL https://raw.githubusercontent.com/clinic-aios/clinic-video-editing/main/SETUP.md`, read all of it and follow it. Coach me one step at a time in plain English, and help me through anything that goes wrong on my computer.

Your assistant checks your computer, installs what's missing, tells you which pop-ups to expect, and finishes by making a short test video. Setup takes 20–40 minutes, mostly downloads.

If setup stops part-way, for a restart, a pop-up or a break, open the folder again and say **"continue setup"**. It checks what's done and carries on.

## Your first edit

Start a new conversation in the folder and say:

> Edit my recording at [path] for [Instagram reel / YouTube / website]. Cut the pauses and show me the mistake cuts before applying them, then add on-brand captions and graphics. Show me the preview before the final render.

## Keeping it up to date

When you're between videos, say:

> Update my video editing setup.

Your settings, keys, media and videos are never touched by an update.

## What's inside

- `AGENTS.md`: the clinic rules and the editing order the AI assistant follows. `CLAUDE.md` loads them for Claude; Codex and other tools read `AGENTS.md` directly.
- `SETUP.md`: the setup guide the assistant follows, including fixes for common computer problems.
- `SKILLS.md`: the editing skills in this starter, and how to add one.
- `.claude/skills/` and `.agents/skills/`: the skills, in two identical copies. The first is for Claude Code, the second for Codex and other tools. Add your own skills to the one your app uses.

HyperFrames (the video engine) and its skills, and Kie's skill, are fetched from their makers during setup. They aren't stored in this repo, and their skills load only in this folder.

## Credits

- [HyperFrames](https://github.com/heygen-com/hyperframes) is by HeyGen.
- The cutting skills are by Nate Herk, from his [HyperFrames Student Kit](https://github.com/nateherkai/hyperframes-student-kit). See `NOTICE.md`.
- Generated media comes from [Kie.ai](https://kie.ai).
