# Clinic Video Editing

**Version 0.1.0** · see [What's new](#whats-new)

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

Your assistant tells you what's new. Your settings, keys, media and videos are never touched by an update.

## What's inside

- `README.md`: this page, the only one written for people.
- `SETUP.md`: the setup and update guide your assistant follows, including fixes for common computer problems.
- `AGENTS.md`: the clinic rules and the editing order your assistant follows. `CLAUDE.md` loads them for Claude; Codex and other tools read `AGENTS.md` directly.
- `.claude/skills/` and `.agents/skills/`: the skills, in two identical copies. The first is for Claude Code, the second for Codex and other tools. Add your own skills to the one your app uses.
- `.claude/settings.json`: Claude Code settings that keep your key file out of the assistant's reach.
- `LICENSE` and `licenses/`: the licences (see the end of this page).

## The skills

| Skill | What it does | Source | Added |
| --- | --- | --- | --- |
| `transcribe` | Word-by-word transcript made on the computer. It keeps stutters and restarts, and lines words up with the real pauses. | This starter | 0.1.0 |
| `cut-silences` | Trims dead air and long pauses, keeping a natural breath. | Nate Herk's Student Kit, unchanged | 0.1.0 |
| `cut-mistakes` | Finds stutters, false starts and retakes, then cuts only the ones you approve. Its review page is `scripts/build-edl-review.mjs`. | Nate Herk's Student Kit, unchanged | 0.1.0 |
| `kie` | A small shim: it opens the key file for you to paste your Kie key, then runs Kie's own commands with the key loaded but never shown. It's the only thing allowed to touch `.env`. | This starter | 0.1.0 |

Setup also installs these into your skills folder. They come from their makers, aren't stored in this repo, and load only in this folder, never in your other AI projects:
- HyperFrames' four core skills (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`), from HeyGen's GitHub. The `hyperframes` skill is the front door.
- Kie's `kie-models`.

## What's new

### 0.1.0 · 2026-10-29

First release, for the pilot.
- One setup prompt; `SETUP.md` coaches you through your computer's quirks and ends with a test video.
- Transcription on your computer with Parakeet. It keeps the slips the mistake-cutter needs to see.
- Nate Herk's `cut-silences` and `cut-mistakes`, copied from his kit at commit `10511e5` (2026-10-14).
- Kie key handled by the `kie` shim only: Kie's own commands run through it, and Claude Code is blocked from reading the key file.
- HyperFrames' and Kie's skills install into this folder only.
- HyperFrames pinned to 0.8.216, engine and skills, so every clinic runs the version that was tested.
- Before handing over a video, the assistant runs a 10-point checklist, shows you the plan first, and never sends frames to an outside AI.
- A media library sorted by where each file came from: `brand/`, `my-photos/`, `my-clips/`, `ai-photos/`, `ai-clips/` and `music/`. Setup copies the clinic's photos and videos from its design system first, and searches the website only if they aren't there.
- Rules in `AGENTS.md`, and skills in both `.claude/skills/` and `.agents/skills/`, so Codex can use it too (untested so far).

## For maintainers

### Adding or changing a skill

1. **One folder per skill:** `<name>/SKILL.md`, with anything it needs (`scripts/`, `references/`) inside that folder. Write commands with the path from the top of the workspace, such as `node .claude/skills/<name>/scripts/<file>.mjs`. That path works in both apps, because the repo ships both folders.
2. **A starter skill goes in both folders.** Write it in `.claude/skills/`, then copy it across with `rsync -a --delete .claude/skills/<name>/ .agents/skills/<name>/`. `diff -rq .claude/skills .agents/skills` prints nothing when the two copies match. A member's own skill goes only in their app's folder.
3. **Keep it self-contained:**
   - Clinic-wide rules live in `AGENTS.md`, not in skills.
   - Only name this starter's skills and the `hyperframes` skill, never HyperFrames' inner skills: they change between releases.
   - Don't name a skill `hyperframes-…`: `.gitignore` hides those names, because setup installs HyperFrames' own skills under them.
4. **If it needs a new tool,** add its check and install to `SETUP.md` step 2 or 4. Otherwise members' setups won't have it.
5. **Add or update its row in The skills.** If someone else wrote it, put their licence in `licenses/` and add them to Credits and licences below. For someone else's skill you've changed, mark it "modified" in its Source cell.
6. **To remove a skill,** delete its folder from both copies and its row. If `AGENTS.md`'s running order names it, update that too.
7. **Test** with `SETUP.md` step 7, which runs the first three skills on a test clip.

### Refreshing Nate's files

Only when one of these happens:
- a member hits a real bug in the cutters;
- FFmpeg changes the `-/filter_complex` syntax;
- Nate publishes a cutting improvement worth having.

How:
1. Shallow-clone his kit: `git clone --depth 1 https://github.com/nateherkai/hyperframes-student-kit.git`.
2. Copy the same files from it, unchanged. Never patch them here.
   - From his `.claude/skills/`, `cut-silences` and `cut-mistakes`, into both skills folders here.
   - `scripts/build-edl-review.mjs`.
   - His `LICENSE` and `licenses/PIPELINE-USE-PERMISSION.txt`.
3. Confirm the skills' commands still say `node .claude/skills/…`.
4. Note the new commit in What's new, and run `SETUP.md` step 7.

### Releasing

1. Raise the **Version** line at the top of this page.
   - To move HyperFrames to a newer version, test it with `SETUP.md` step 7 first. Then replace `0.8.216` everywhere it appears (`grep -rn 0.8.216 .`), in both skills folders too.
2. Add a What's new entry with the date and plain-English bullets. Members' assistants read it to tell them what changed.
3. Commit and push. Members get it with "Update my video editing setup".

## Credits and licences

- **This starter's own files** (the documents and the `transcribe` and `kie` skills): MIT, see `LICENSE`.
- **Nate Herk's files** keep their own licences, in `licenses/`: MIT, plus his kit's use permission, which asks that the notice travel with the files. They are:
  - `cut-silences`;
  - `cut-mistakes`;
  - `scripts/build-edl-review.mjs`.

  They come from his [HyperFrames Student Kit](https://github.com/nateherkai/hyperframes-student-kit), commit `10511e5af86fc47756ea89803b397422e2d89284` (2026-10-14), and were copied unchanged. Thank you, Nate.
- **[HyperFrames](https://github.com/heygen-com/hyperframes)**, by HeyGen (Apache-2.0), is installed during setup, not bundled. It downloads its own Chrome for rendering, and NVIDIA's Parakeet speech model for transcription.
- **[Kie.ai](https://kie.ai)**'s `kie-models` skill and generated media are installed and used from your own Kie account.
- **FFmpeg, Node and Git** are each under their own licence.
