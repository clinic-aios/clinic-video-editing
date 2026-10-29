# Skills

This starter's own skills come in two identical copies, one folder per skill: `.claude/skills/` for Claude Code and `.agents/skills/` for Codex and other tools. Their commands say `node .claude/skills/…`, which works in either app because the repo ships both folders. Members get every change here when they say "update my video editing setup".

| Skill | What it does | Source | Added |
| --- | --- | --- | --- |
| `transcribe` | Word-by-word transcript made on the computer. It keeps stutters and restarts, and lines words up with the real pauses. | This starter | 2026-10-29 |
| `cut-silences` | Trims dead air and long pauses, keeping a natural breath. | Nate Herk's Student Kit, unchanged | 2026-10-29 |
| `cut-mistakes` | Finds stutters, false starts and retakes, then cuts only the ones the person approves. | Nate Herk's Student Kit, unchanged | 2026-10-29 |
| `kie` | Opens the key file for the person to paste their Kie key, and sends every Kie request without the key being shown. It is the only thing allowed to touch `.env`. | This starter | 2026-10-29 |

Shared helper: `cut-mistakes` expects its review page at `scripts/build-edl-review.mjs` (Nate's, unchanged).

**Installed into each member's skills folder by `SETUP.md`, but kept out of git.** They load only in this folder, never in the member's other AI projects:
- HyperFrames' four core skills (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`; the front door is the `hyperframes` skill), fetched from HeyGen's GitHub;
- Kie's `kie-models`.

`.gitignore` lists their names. So don't name a skill of ours `hyperframes-…`; anything else is tracked automatically.

## Adding a skill

1. **Give it its own folder:** `<name>/SKILL.md`. Anything it needs (`scripts/`, `references/`) goes inside that folder. Write commands with the path from the top of the workspace, such as `node .claude/skills/<name>/scripts/<file>.mjs`.
   - **A member's own skill** goes in their app's folder only: `.claude/skills/` for Claude Code, `.agents/skills/` for Codex.
   - **A starter skill** goes in both. Write it in `.claude/skills/`, then copy it across with `rsync -a --delete .claude/skills/<name>/ .agents/skills/<name>/`.
2. **Keep it self-contained:**
   - Clinic-wide rules live in `AGENTS.md`, not in skills.
   - Only name this starter's skills and the `hyperframes` skill, never HyperFrames' inner skills: they change between releases.
3. **If it needs a new tool,** add its check and install to `SETUP.md` step 2 or 4. Otherwise members' setups won't have it.
4. **Add its row above.** If someone else wrote it, put their licence in `licenses/` and credit them in `NOTICE.md`.
5. **Commit and push.** Members get it on their next update.

## Changing or removing a skill

- **Change:** edit the skill in `.claude/skills/`, copy it across with the same `rsync` command, and commit. `diff -rq .claude/skills .agents/skills` prints nothing when the two copies match. For someone else's skill, mark it "modified" in its Source cell and in `NOTICE.md`.
- **Remove:** delete its folder from both copies, and its row. If `AGENTS.md`'s running order names it, update that too.
- **Test** with `SETUP.md` step 7, which runs the first three skills on a test clip.
