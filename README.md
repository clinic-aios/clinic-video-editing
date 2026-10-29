# Claude Video Editing

Record yourself talking to camera. Claude cuts the pauses and the slips, then adds your clinic's brand graphics and captions and renders the finished video, ready for YouTube, a reel or your website.

## What you need

- Claude Desktop, using its **Code** tab.
- Your clinic's design system in Claude.
- A [Kie.ai](https://kie.ai) account with credits, for generated images, clips and music.
- Optional: an [ElevenLabs](https://elevenlabs.io) API key for transcription. Without one, transcription runs on your computer.

## Patient data: read this first

- **Never** put special category patient health data into a Claude chat.
- **Never** give Claude access to folders or files that hold it.
- **Never** connect Claude to systems that hold it.
- Patients can appear in your clinic's videos only with their explicit written consent: separate from consent to treatment, naming where the video will be published, and theirs to withdraw at any time. Even then, edit those recordings somewhere else, not here: a video showing a patient holds their health data.
- Recordings you edit here: no patients, no patient names, no screens from your clinic systems.

## Setup

Create a folder called `clinic-video-editing` in your Documents, open it in Claude Code, and paste these prompts one at a time.

### 1. Install

> Set up the clinic video editing starter from https://github.com/clinic-aios/clinic-video-editing directly in this folder, not in a subfolder. Install anything my computer is missing: Node 22 or newer, Git, FFmpeg 7 or newer, and Chrome. Then install HyperFrames and its official skills from heygen-com/hyperframes using HyperFrames' own installer, so Claude Code can use them. Done when `npx hyperframes doctor` passes, a five-second HyperFrames test video renders, and the cut-silences script runs in plan-only mode on a short made-up transcript. If I need to do something myself, such as typing my password, tell me exactly what to run. Finish by telling me to start a new conversation in this folder.

### 2. Make it mine

> Create my-clinic.md for my clinic: [clinic name], design system [link], we publish to [YouTube / Instagram / Facebook / LinkedIn / website]. Check you can read the design system and tell me my brand colours and fonts. Create the media-library folders. Done when a fresh conversation in this folder can tell me my brand colours.

### 3. Connect services

> Connect Kie.ai using Kie's own Claude skill, and make sure you can transcribe my recordings word by word: use ElevenLabs if I give you a key, otherwise HyperFrames' local transcription. Tell me where to put each key, and don't ask me to paste them into this chat. Always tell me the credit cost before any generation. Done when one cheap test image is saved in media-library/kie and a ten-second test recording of me is transcribed.

### 4. Update (whenever a new version is announced)

> Update this starter from its GitHub repo, and update HyperFrames' engine and skills and Kie's skill. My my-clinic.md, .env, media-library and video-projects must not change. Check the HyperFrames test still renders.

## Your first edit

> Edit my recording at [path] for [Instagram reel / YouTube / website]. Cut the pauses and show me the mistake cuts before applying them, then add on-brand captions and graphics. Show me the preview before the final render.

## Credits

- The cutting skills are by Nate Herk, from his [HyperFrames Student Kit](https://github.com/nateherkai/hyperframes-student-kit). See `NOTICE.md`.
- [HyperFrames](https://github.com/heygen-com/hyperframes) is by HeyGen.
- Generated media comes from [Kie.ai](https://kie.ai).
