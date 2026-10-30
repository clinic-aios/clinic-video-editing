# Setup guide

**For the AI assistant** (Claude Code, Codex or another). The person asked you to set up clinic video editing in the folder you're working in. They may never have used a terminal. Follow this guide to the end, and coach them through anything their computer throws up.

Repo: `https://github.com/clinic-aios/clinic-video-editing`

## How to coach

- **Check before you change.** Every step starts with a check. If it passes, say so in one line and move on. This makes the guide safe to run again: after a restart, or when the person says "continue setup", start at the top and the checks skip what's done.
- **One step at a time, in plain English.** Before each step, say what it does and roughly how long it takes.
- **Warn before every pop-up.** Each step names the pop-ups it can cause. Say what the pop-up will say and which button to press *before* running the command.
  - The AI app's own "allow this command?" prompts count too. Explain each command in one line so they can allow it.
  - Never suggest turning those prompts off.
- **Keep a short progress list** (✓ done, → now, · to do) and show it after each step.
- **Keep long downloads quiet.** Installs and downloads print progress bars that flood the chat. Send their output to a log, and show only its end if something fails: `<command> > "${TMPDIR:-/tmp}/setup.log" 2>&1 || tail -c 1500 "${TMPDIR:-/tmp}/setup.log"`.
- **Passwords and keys never go in the chat.**
  - Never run `sudo`.
  - On a Mac, anything that needs the computer's password runs in a Terminal window you open for them (step 2). They type the password there.
  - On Windows, they approve the "make changes" pop-up themselves.
  - The Kie key goes into `.env` only through the `kie` skill's script (step 5). Never read, write or print `.env` yourself.
- **Stay inside this guide.**
  - Install only what it lists.
  - Never change security settings, turn off antivirus or firewall protection, change PowerShell's execution policy, or skip certificate checks.
  - Don't run install hints that other tools print, such as the ones `hyperframes doctor` shows for optional extras.
  - If a fix would need any of those, stop and explain.
- **When something fails:**
  1. Read the whole error.
  2. Look it up in Known bumps below. Explain it simply and try the fix once.
  3. If it still fails, stop. Say plainly what happened, and give the person a short summary to send to their trainer: the computer, the step and the exact error.
  4. Never loop on the same failing command.

## 1. This computer

**Check:** `uname -s` (Darwin = Mac; MINGW, MSYS or CYGWIN = Windows), `pwd`, and `df -h .`.

- **Disk space.** Allow at least 5 GB free: about 2 GB for the tools, and the rest for videos. If there's less, say so and let the person decide whether to carry on.
- **Synced folders.** Video files shouldn't live in a folder that syncs to the cloud. They're slow to upload, and the cloud can "offload" a file mid-edit. The folder is synced if:
  - its path contains `OneDrive`, `iCloud`, `Mobile Documents`, `CloudStorage`, `Dropbox` or `Google Drive`;
  - or, on a Mac, it's inside Documents or Desktop and `~/Library/Mobile Documents/com~apple~CloudDocs/Documents` exists.

  If it is synced, and `AGENTS.md` isn't here yet (if it is, they've already chosen to stay, so don't ask again):
  - recommend a folder in their home folder instead;
  - offer to create it for them: `mkdir -p ~/clinic-video-editing`;
  - then walk them through opening it. In their AI app's folder picker (in Claude Desktop, the Code tab's), they choose the folder, go to their home folder (the one with their name), pick `clinic-video-editing`, and paste the setup prompt again there.

  If they'd rather stay, carry on.

## 2. Tools

Git, Node 22 or newer, and FFmpeg 7 or newer (with ffprobe).

### Mac

Check in this order, because running `git` on a fresh Mac pops up Apple's installer.

1. **Homebrew** (installs the others). Check with `brew --version`. If that fails, try `/opt/homebrew/bin/brew --version` (Apple silicon) or `/usr/local/bin/brew --version` (Intel). If none works, install it:
   - It needs their Mac password, so open it in its own Terminal window:
     ```bash
     printf '%s\n' '#!/bin/bash' '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' 'echo; echo "Finished. You can close this window and go back to the chat."' > "$TMPDIR/install-homebrew.command" && chmod +x "$TMPDIR/install-homebrew.command" && open "$TMPDIR/install-homebrew.command"
     ```
   - Tell them what to expect in that window:
     1. Type your Mac password. Nothing appears as you type, which is normal. Press Return.
     2. Press Return again when it asks to continue.
     3. If a pop-up offers to install Apple's "command line developer tools", click Install.
     4. Wait for "Installation successful" and "Finished". That's usually 5–15 minutes.
     5. Come back and say "done".
   - Afterwards, make `brew` findable:
     ```bash
     eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
     ```
     Add the same line to `~/.zprofile` if it isn't there.
2. **Apple's developer tools.** Check with `xcode-select -p`, which never causes a pop-up. If it fails:
   - Warn them: "A pop-up will offer to install command line developer tools. Click Install and wait. It takes a few minutes."
   - Run `xcode-select --install`.
   - When it's finished, check again.
3. **The tools.** Check: `git --version`, `node --version` (must be v22 or newer), `ffmpeg -version` and `ffprobe -version`. Install whatever is missing with `brew install node ffmpeg` (add `git` if needed). No password is needed. It takes a few minutes.

### Windows

1. **Check:** `git --version`, `node --version` (must be v22 or newer), `ffmpeg -version` and `ffprobe -version`.
2. **Install whatever is missing.** Warn first: Windows may ask "Do you want to allow this app to make changes to your device?", and they click Yes.
   ```bash
   winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements
   winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
   winget install --id Gyan.FFmpeg -e --accept-package-agreements --accept-source-agreements
   ```
3. **Restart the AI app.** New tools aren't visible until the app restarts. Ask them to quit it completely (not just close the window), reopen it, open this folder again and say "continue setup".

**Done when** all four checks pass.

## 3. The starter

**Check:** `git remote get-url origin` prints the repo URL above, and `AGENTS.md` exists here.

If not, fetch it into this folder. This works even if the folder already has files in it, and it's safe to run again:

```bash
[ -d .git ] || git init; git remote get-url origin >/dev/null 2>&1 || git remote add origin https://github.com/clinic-aios/clinic-video-editing; git fetch origin && git checkout -t origin/main
```

If git says files "would be overwritten", they're the person's own files with the same names as the starter's.
1. List them and ask what they are.
2. Usually the answer is to keep them under a new name, for example `mv -n README.md my-old-README.md`. Never delete them.
3. Run the command again.

From here on, read this guide from the local `SETUP.md`.

## 4. HyperFrames

HyperFrames is HeyGen's free video engine. It makes the graphics, captions and final videos. Run every command with `npx --yes` so it never stops to ask a question.

Its skills live in this folder only, so they don't load in the person's other AI projects. Skills go in your app's skills folder (`.claude/skills/` in Claude Code, `.agents/skills/` in Codex and other tools). The starter's own skills are already in both.
- Never run `npx hyperframes skills` or `skills update`: those install for the whole computer.
- Any `npx hyperframes init` must have `--skip-skills` or start with `HYPERFRAMES_SKIP_SKILLS=1`. Otherwise it quietly installs skills for the whole computer too.
- `.claude/settings.json` sets `HYPERFRAMES_SKIP_SKILLS=1` for every conversation after this one.

1. **Usage statistics off.** HyperFrames and the skills installer send anonymous usage statistics unless told not to. For a clinic, switch them off:
   - Check: `npx --yes hyperframes@0.8.216 telemetry status` says disabled. If not, run `npx --yes hyperframes@0.8.216 telemetry disable`.
   - Start every skills install or update with `DO_NOT_TRACK=1`, as the commands below do.
2. **Its skills, into this folder.** Check: `hyperframes/SKILL.md` exists in your app's skills folder (`.claude/skills/` in Claude Code, `.agents/skills/` in Codex and other tools). If not, run this. In Codex or another tool, use `--agent codex` in place of `--agent claude-code`:
   ```bash
   DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1 npx --yes skills add "heygen-com/hyperframes#v0.8.216" --skill hyperframes --skill hyperframes-cli --skill hyperframes-registry --skill media-use --agent claude-code --copy --full-depth --yes
   ```
   That installs HyperFrames' four core skills from HeyGen's GitHub. If the `hyperframes` skill later asks for another of its skills (such as `slideshow`), run the same command with that name in place of the four.
3. **Its own Chrome**, used for rendering: `npx --yes hyperframes@0.8.216 browser ensure`. This is a download of about 200 MB, separate from any Chrome they use.
4. **The speech model**, for transcription on this computer. Check: `npx --yes hyperframes@0.8.216 models list` shows parakeet "installed". If not, run `npx --yes hyperframes@0.8.216 models install parakeet`. It's about 650 MB and takes a few minutes.
5. **Health check:** `npx --yes hyperframes@0.8.216 doctor`.
   - The lines that matter are Node.js, FFmpeg, FFprobe and Chrome.
   - Docker, TTS (Kokoro), BGM (MusicGen) and whisper-cpp are optional, so ignore a ✗ on those.
   - Don't run the install hints it prints for them; one even contains `sudo`. A stray `docker: command not found` line is normal too.
   - HyperFrames sometimes suggests its desktop app (`hyperframes open`). This setup doesn't use it, so skip it.

**Done when** those four lines show ✓ and parakeet is installed.

## 5. Kie.ai (generated images, clips and music)

Optional. In plain English, Kie.ai is a pay-as-you-go service that makes AI images, short video clips and music. They buy credits on kie.ai, each thing it makes uses some, and the assistant always says the cost and waits for a yes first.
- If `my-clinic.md` says `Kie.ai: later`, skip this step without asking.
- If the person has no Kie.ai account, skip it and remember to write `Kie.ai: later` in step 6. Tell them they can say "set up Kie" any time to come back to this step.

1. **Kie's skill, into this folder.** Check: `kie-models/SKILL.md` exists in your app's skills folder. If not, run this, with `--agent codex` in Codex or another tool:
   ```bash
   DO_NOT_TRACK=1 npx --yes skills add https://kie.ai --skill kie-models --agent claude-code --copy --yes
   ```
2. **The key.** Never touch `.env` yourself: your own tools are blocked from it (in Claude Code by `.claude/settings.json`; elsewhere, treat it as blocked), and the `kie` skill's script is the only thing that reads or writes it.
   1. Ask them to sign in at kie.ai/api-key and copy their key (its copy button).
   2. Run `node .claude/skills/kie/scripts/kie.mjs key`. TextEdit (Mac) or Notepad (Windows) opens, showing `KIE_API_KEY=`.
   3. Tell them: paste the key straight after the `=`, save (⌘S on a Mac, Ctrl+S on Windows), close the window, and say "done".
3. **Test it for free,** with the balance check in the `kie` skill ("Saving the key", step 4). It runs Kie's own credit command through the skill's `run`. A `"code":200` reply shows their credits; a 401 means the key is wrong, so run `key` again for them to fix it.

When it works, set the `Kie.ai` line in `my-clinic.md` to `set up`, if the file exists.

## 6. Make it theirs

**Check:** `my-clinic.md` exists.

If not, ask these one at a time, in this order:

1. **The clinic's name.**
2. **Its design system.** This is the clinic's brand page made in Claude, with a link starting `https://claude.ai/`. Only Claude can open it; in other AI apps, ask for colours and a font as if there were none. If they don't know what that is, they don't have one yet, and that's fine.
   - **With a link:** read it with the Artifact tool and tell them the brand colours and fonts you found.
   - **Without one:** ask for two or three brand colours and a font, or offer to take them from the clinic's website. Ask whether there's a logo file. They can add a design system later.
3. **Where their videos go:** YouTube, Instagram, Facebook, LinkedIn, TikTok or their website.
4. **Anything to always remember,** such as tone or words to avoid.

Then write `my-clinic.md`:

```markdown
# My clinic

- Clinic: <name>
- Design system: <link, or "not yet">
- Brand (only when there's no design system): <2–3 colours as hex, font, logo file or "no logo yet">
- We publish to: <channels>
- Kie.ai: <set up, or later>
- Always remember: <notes>
```

Create `video-projects/` and these media folders if they're missing: `media-library/brand/`, `my-photos/`, `my-clips/`, `ai-photos/`, `ai-clips/` and `music/`. `AGENTS.md` says what goes where.

**The clinic's media** (logo, photos, video clips). Get them once, in this order:
1. **Already here?** If `brand/`, `my-photos/` or `my-clips/` already hold files, only add what's missing, and skip the website.
2. **From the design system first** (Claude only). If `my-clinic.md` links a design system and you can open it with the Artifact tool:
   - list its published files and its uploaded assets (`list` with `scope` `files`, then `assets`);
   - download every logo, font, photo and video (`read` with `paths`). They land in a temporary folder;
   - copy each into the right folder with a clear name.

   The design system was made from their website, so if it has photos or videos, don't search the website again. Tell them what you copied.
3. **From the website, only if needed.** If there's no design system, it holds no photos or videos, or you can't open it, offer to download the logo, photos and videos from the clinic's website into the same folders.
4. **Never patients,** whatever the source. Tell them they can drop their own photos and clips into `my-photos/` and `my-clips/` at any time.

## 7. Prove it works

Run everything from this folder's top level. The test lives in `video-projects/setup-test/`.

1. **A spoken test clip** in the computer's own voice, with a stutter, a restart and a pause:
   - Mac (if the Daniel voice is missing, leave out `-v Daniel`):
     ```bash
     mkdir -p video-projects/setup-test/assets && say -v Daniel -o video-projects/setup-test/voice.aiff "Welcome to the clinic. Today I'm going to, um, I'm going to show you how how we treat a verruca. [[slnc 2500]] It's quick and simple."
     ```
   - Windows:
     ```bash
     mkdir -p video-projects/setup-test/assets && powershell -NoProfile -Command 'Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $p = New-Object System.Speech.Synthesis.PromptBuilder; $p.AppendText("Welcome to the clinic. Today I am going to, um, I am going to show you how how we treat a verruca."); $p.AppendBreak([TimeSpan]::FromSeconds(2.5)); $p.AppendText("It is quick and simple."); $s.SetOutputToWaveFile("video-projects\setup-test\voice.wav"); $s.Speak($p); $s.Dispose()'
     ```
   - Then turn it into a video. On Windows, use `voice.wav` in place of `voice.aiff`:
     ```bash
     ffmpeg -y -f lavfi -i "color=c=0x1d2b4f:s=1280x720:r=30" -i video-projects/setup-test/voice.aiff -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac video-projects/setup-test/test.mp4
     ```
2. **The first three steps of an edit:**
   ```bash
   npx --yes hyperframes@0.8.216 transcribe video-projects/setup-test/test.mp4 --dir video-projects/setup-test/assets --json
   node .claude/skills/transcribe/scripts/words.mjs video-projects/setup-test/assets/transcript.json --video video-projects/setup-test/test.mp4
   node .claude/skills/cut-silences/scripts/cut-silences.mjs video-projects/setup-test/assets/test.words.json --video video-projects/setup-test/test.mp4 --out-dir video-projects/setup-test/assets --apply --output video-projects/setup-test/assets/test.silenced.mp4
   node .claude/skills/cut-mistakes/scripts/find-cut-candidates.mjs video-projects/setup-test/assets/test.words.silence-transcript.json --out-dir video-projects/setup-test/assets
   ```
   **Done when:**
   - `transcribe` names `parakeet`;
   - `assets/test.silenced.mp4` exists;
   - `assets/test.words.cut-candidates.md` lists the "how how" stutter.

   The finder only catches stutters like that one. The restart and the "um" are left for the assistant's own read of the transcript in a real edit (see `AGENTS.md`). A misheard word, such as "verruca", is normal; names and terms get fixed in the captions.
3. **A HyperFrames render.** Warn first: the computer may ask whether "chrome-headless-shell" or "node" may "accept incoming network connections". Deny is fine.
   ```bash
   (cd video-projects/setup-test && npx --yes hyperframes@0.8.216 init render-test --example blank --non-interactive --skip-skills && cd render-test && npx --yes hyperframes@0.8.216 render . --quality draft --output renders/test.mp4)
   ```
   **Done when** `video-projects/setup-test/render-test/renders/test.mp4` exists. It takes under a minute. HyperFrames puts its own `CLAUDE.md` and `AGENTS.md` inside each project it creates. Leave them alone: they only apply inside that project's folder.

Tell them it all works. Then ask them to start a **new conversation** in this folder, because that's when the assistant loads the clinic rules and the new skills. Suggest a first prompt from the README's "Your first edit".

## Updating

Run this when the person asks to update ("update my video editing setup"):

1. **Ask whether they're in the middle of a video.** If so, suggest finishing it first: an update can change how HyperFrames behaves part-way through.
2. **The starter:**
   1. Note the **Version** line at the top of `README.md`.
   2. Run `git pull --ff-only`. If it refuses because files here were changed:
      - show them `git status`;
      - their own settings belong in `my-clinic.md`, which updates never touch;
      - ask before discarding any change.
   3. If the version went up, read `README.md`'s "What's new" entries since their old version and tell them what changed, in plain English.
3. **HyperFrames' skills:** re-run the command in step 4.2. It fetches the latest from HeyGen's GitHub and replaces the copies in this folder. Add the name of any other HyperFrames skill already in your app's skills folder.
4. **Kie's skill:** re-run the command in step 5.1, but only if `my-clinic.md` says `Kie.ai: set up`.
5. **Run step 7 again**, then they start a new conversation. Re-running it overwrites the old test files, so there's nothing to delete first.

## Known bumps

| What happens | What to do |
| --- | --- |
| Mac: "xcode-select: no developer tools were found" or a pop-up offering command line tools | Click Install, wait for it to finish, then run the check again. |
| Mac: `brew: command not found` right after installing Homebrew | Run the `eval` line from step 2. On a new conversation, `~/.zprofile` covers it. |
| Mac: Homebrew says the macOS version is unsupported or starts building from source | Stop. Ask them to update macOS first; an old version can take hours to build everything. |
| Mac: `say` reports "Voice `Daniel` not found" | Run it again without `-v Daniel`. |
| Mac: "Claude" (or another app) "would like to access files in your Documents / Desktop / Downloads folder" | Allow only if the recording really is there. Better: move recordings into this folder. |
| Mac or Windows: "accept incoming network connections" for node or chrome-headless-shell | Deny is fine. The preview runs on this computer only. |
| Windows: `winget` is not recognised | Install "App Installer" from the Microsoft Store, then restart the AI app. |
| Windows: a tool installed fine but "is not recognized" | The AI app needs a restart (step 2, Windows). |
| Windows: "running scripts is disabled on this system" | Use `npx.cmd` instead of `npx`. Never change the execution policy. |
| Windows: Parakeet fails with a missing DLL or "VC++" | `winget install --id Microsoft.VCRedist.2015+.x64 -e`, restart the AI app, then install Parakeet again. |
| `npx` asks "Ok to proceed?" | Use `npx --yes`. |
| Certificate errors (`SELF_SIGNED_CERT_IN_CHAIN`, `UNABLE_TO_GET_ISSUER_CERT`) | The network inspects traffic, which is common on clinic Wi-Fi. Try another network, such as home or a phone hotspot. Never turn off certificate checks. |
| Timeouts or `EAI_AGAIN` | Network blip. Wait a minute and try once more. |
| `hyperframes browser ensure` fails | `npx --yes hyperframes@0.8.216 browser ensure --force`. If it's blocked, try another network. |
| Parakeet still won't install | Carry on with Whisper, but warn them that stutters and restarts will be harder to find. Try Parakeet again another day. |
| "No space left on device" | Stop. They free up space, then continue setup. |
| Kie: 401 | The key is wrong. Run the kie skill's `key` command so they can paste it again. |
| Kie: not enough credits | Top up at kie.ai. Nothing else needs changing. |
