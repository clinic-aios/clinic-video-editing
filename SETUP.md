# Setup guide

**For the AI assistant.** The person asked you to set up clinic video editing in the folder you're working in. They may never have used a terminal. Follow this guide to the end, and coach them through anything their computer throws up.

Repo: `https://github.com/clinic-aios/clinic-video-editing`

## How to coach

- **Check before you change.** Every step starts with a check. If it passes, say so in one line and move on. This makes the guide safe to run again: after a restart, or when the person says "continue setup", start at the top and the checks skip what's done.
- **One step at a time, in plain English.** Before each step, say what it does and roughly how long it takes. Before anything that makes a pop-up appear, say what the pop-up will say and which button to press.
- **Keep a short progress list** (✓ done, → now, · to do) and show it after each step.
- **Passwords and keys never go in the chat.**
  - Never run `sudo`.
  - On a Mac, anything that needs the computer's password runs in a Terminal window you open for them (see Tools). They type the password there.
  - On Windows, they approve the "make changes" pop-up themselves.
  - API keys go into `.env`, which they edit in TextEdit or Notepad.
  - Never read `.env` aloud or print its contents.
- **Stay inside this guide.**
  - Install only what it lists.
  - Never change security settings, turn off antivirus or firewall protection, change PowerShell's execution policy, or skip certificate checks.
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

  If it is synced, recommend a folder called `clinic-video-editing` in their home folder instead (`/Users/<name>/` or `C:\Users\<name>\`). Explain how to create it and open it in Claude, then stop. When they're there, they paste the setup prompt again. If they'd rather stay, carry on.

## 2. Tools

**Check:** `git --version`, `node --version` (must be v22 or newer), `ffmpeg -version` and `ffprobe -version` (FFmpeg 7 or newer).

### Mac

1. **Homebrew** (installs the others). Check with `brew --version`. If that fails, try `/opt/homebrew/bin/brew --version` (Apple silicon) or `/usr/local/bin/brew --version` (Intel). If none works, install it:
   - It needs their Mac password, so open it in its own Terminal window:
     ```bash
     printf '%s\n' '#!/bin/bash' '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' 'echo; echo "Finished. You can close this window and go back to Claude."' > "$TMPDIR/install-homebrew.command" && chmod +x "$TMPDIR/install-homebrew.command" && open "$TMPDIR/install-homebrew.command"
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
2. **The tools:** `brew install node ffmpeg`, plus `git` if `git --version` failed. No password is needed. It takes a few minutes.

### Windows

1. Install whatever is missing with `winget`. Windows may ask "Do you want to allow this app to make changes to your device?": they click Yes.
   ```bash
   winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements
   winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
   winget install --id Gyan.FFmpeg -e --accept-package-agreements --accept-source-agreements
   ```
2. New tools aren't visible until Claude restarts. Ask them to quit Claude completely (not just close the window), reopen it, open this folder in the Code tab and say "continue setup".

**Done when** all four checks pass.

## 3. The starter

**Check:** `git remote get-url origin` prints the repo URL above, and `CLAUDE.md` exists here.

If not, fetch it into this folder. This works even if the folder already has files in it:

```bash
git init && git remote add origin https://github.com/clinic-aios/clinic-video-editing && git fetch origin && git checkout -t origin/main
```

If git says files "would be overwritten", list them and ask the person what they are before doing anything else. From here on, read this guide from the local `SETUP.md`.

## 4. HyperFrames

HyperFrames is HeyGen's free video engine. It makes the graphics, captions and final videos. Run every command with `npx --yes` so it never stops to ask a question.

1. **Its skills.** Check: `~/.claude/skills/hyperframes/SKILL.md` exists. If not, run `npx --yes hyperframes skills`. That installs them for the person's user account, not into this folder.
2. **Its own Chrome**, used for rendering: `npx --yes hyperframes browser ensure`. This is a download of about 150 MB, separate from any Chrome they use.
3. **The speech model**, for transcription on this computer. Check: `npx --yes hyperframes models list` shows parakeet "installed". If not, run `npx --yes hyperframes models install parakeet`. It's about 600 MB and takes a few minutes.
4. **Health check:** `npx --yes hyperframes doctor`. The lines that matter are Node.js, FFmpeg, FFprobe and Chrome. Docker, TTS (Kokoro), BGM (MusicGen) and whisper-cpp are optional, so ignore a ✗ on those.

**Done when** those four lines show ✓ and parakeet is installed.

## 5. Kie.ai (generated images, clips and music)

Optional. If the person has no Kie.ai account yet, skip this step, tell them they can add it any time, and go on.

1. **Kie's skill.** Check: `~/.claude/skills/kie-models/SKILL.md` exists. If not:
   ```bash
   npx --yes skills add https://kie.ai --skill kie-models --global --agent claude-code --copy --yes
   ```
2. **The key.**
   - If `.env` doesn't exist, create it containing the line `KIE_API_KEY=`.
   - Open it for them with `open -e .env` (Mac) or `notepad .env` (Windows).
   - Tell them to copy their key from kie.ai/api-key, paste it straight after the `=` with no spaces, then save and close the file.
   - Check it's there without showing it: `grep -c '^KIE_API_KEY=.' .env` should print `1`.
3. **Test it for free** by asking for the credit balance:
   ```bash
   set -a; . ./.env; set +a; curl -s -H "Authorization: Bearer $KIE_API_KEY" https://api.kie.ai/api/v1/chat/credit
   ```
   It should print a balance. A 401 means the key is wrong, so they paste it again.

## 6. Make it theirs

**Check:** `my-clinic.md` exists.

If not, ask for each of these, one at a time:

- the clinic's name;
- its design system link (a claude.ai link). If they don't have one yet, leave it blank: they can make one later and add it;
- where their videos go (YouTube, Instagram, Facebook, LinkedIn, TikTok, website);
- anything else to always remember, such as tone or words to avoid.

Then write it:

```markdown
# My clinic

- Clinic: <name>
- Design system: <link, or "not yet">
- We publish to: <channels>
- Always remember: <notes>
```

If there's a design system link:
- Read it with the Artifact tool and tell them the brand colours and fonts you found.
- Offer to save the clinic's logo, photos and videos from its website into `media-library/brand/`, with no patients in any of them.

Create `media-library/brand/`, `media-library/kie/`, `media-library/b-roll/` and `video-projects/` if they're missing.

## 7. Prove it works

Run everything from this folder's top level. The test files go in `video-projects/setup-test/`, so create it first.

1. **A spoken test clip.** Use the computer's own voice:
   - Mac:
     ```bash
     say -o video-projects/setup-test/voice.aiff "Welcome to the clinic. Today I'm going to, um, I'm going to show you how how we treat a verruca. [[slnc 2500]] It's quick and simple."
     ```
   - Windows:
     ```bash
     powershell -NoProfile -Command 'Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.SetOutputToWaveFile("video-projects\setup-test\voice.wav"); $s.Speak("Welcome to the clinic. Today I am going to, um, I am going to show you how how we treat a verruca."); $s.Dispose()'
     ```
   - Then turn it into a video. On Windows, use `voice.wav` in place of `voice.aiff`:
     ```bash
     ffmpeg -y -f lavfi -i "color=c=0x1d2b4f:s=1280x720:r=30" -i video-projects/setup-test/voice.aiff -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac video-projects/setup-test/test.mp4
     ```
2. **Run the first three steps of an edit** on `video-projects/setup-test/test.mp4`, following each skill:
   - `transcribe`;
   - `cut-silences` with `--apply`;
   - `cut-mistakes`' finder (`find-cut-candidates.mjs`).

   **Done when** the silenced video exists and the finder lists the "how how" stutter.
3. **A HyperFrames render:**
   ```bash
   (cd video-projects/setup-test && npx --yes hyperframes init render-test --example blank --non-interactive --skip-skills && cd render-test && npx --yes hyperframes render . --quality draft --output renders/test.mp4)
   ```
   **Done when** `video-projects/setup-test/render-test/renders/test.mp4` exists. It takes under a minute.

Tell them it all works. Then ask them to start a **new conversation** in this folder, because that's when Claude loads the clinic rules and the new skills. Suggest a first prompt from the README's "Your first edit".

## Updating

Run this when the person asks to update ("update my video editing setup"):

1. **Ask whether they're in the middle of a video.** If so, suggest finishing it first: an update can change how HyperFrames behaves part-way through.
2. **The starter:** `git pull --ff-only`. If it refuses because files here were changed:
   - show them `git status`;
   - their own settings belong in `my-clinic.md`, which updates never touch;
   - ask before discarding any change.
3. **HyperFrames' skills:** `npx --yes hyperframes skills update`.
4. **Kie's skill:** re-run the command in step 5.1, but only if Kie is set up.
5. Run step 7 again. Then they start a new conversation.

## Known bumps

| What happens | What to do |
| --- | --- |
| Mac: "xcode-select: no developer tools were found" or a pop-up offering command line tools | Click Install, wait for it to finish, then run the check again. |
| Mac: `brew: command not found` right after installing Homebrew | Run the `eval` line from Tools step 1. On a new conversation, `~/.zprofile` covers it. |
| Mac: Homebrew says the macOS version is unsupported or starts building from source | Stop. Ask them to update macOS first; an old version can take hours to build everything. |
| Mac: "Claude would like to access files in your Documents / Desktop / Downloads folder" | Allow only if the recording really is there. Better: move recordings into this folder. |
| Mac or Windows: "accept incoming network connections" for node or chrome-headless-shell | Deny is fine. The preview runs on this computer only. |
| Windows: `winget` is not recognised | Install "App Installer" from the Microsoft Store, then restart Claude. |
| Windows: a tool installed fine but "is not recognized" | Claude needs a restart (see Tools, Windows). |
| Windows: "running scripts is disabled on this system" | Use `npx.cmd` instead of `npx`. Never change the execution policy. |
| Windows: Parakeet fails with a missing DLL or "VC++" | `winget install --id Microsoft.VCRedist.2015+.x64 -e`, restart Claude, then install Parakeet again. |
| `npx` asks "Ok to proceed?" | Use `npx --yes`. |
| Certificate errors (`SELF_SIGNED_CERT_IN_CHAIN`, `UNABLE_TO_GET_ISSUER_CERT`) | The network inspects traffic, which is common on clinic Wi-Fi. Try another network, such as home or a phone hotspot. Never turn off certificate checks. |
| Timeouts or `EAI_AGAIN` | Network blip. Wait a minute and try once more. |
| `hyperframes browser ensure` fails | `npx --yes hyperframes browser ensure --force`. If it's blocked, try another network. |
| Parakeet still won't install | Carry on with Whisper, but warn them that stutters and restarts will be harder to find. Try Parakeet again another day. |
| "No space left on device" | Stop. They free up space, then continue setup. |
| Kie: 401 | The key is wrong or has spaces. Paste it again. |
| Kie: not enough credits | Top up at kie.ai. Nothing else needs changing. |
