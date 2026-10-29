# Notices

## Licences

- **This repo's own files** (`CLAUDE.md`, `README.md`, `NOTICE.md`, `.gitignore`): MIT, see `LICENSE`.
- **The files bundled from Nate Herk** (below) keep their own licences, in `licenses/`.

## Bundled from Nate Herk's HyperFrames Student Kit

Source: [github.com/nateherkai/hyperframes-student-kit](https://github.com/nateherkai/hyperframes-student-kit), commit `10511e5af86fc47756ea89803b397422e2d89284` (2026-10-14). Copied unchanged:

| File | Purpose |
| --- | --- |
| `.claude/skills/cut-silences/SKILL.md`, `scripts/cut-silences.mjs` | Trims dead air using the word-level transcript |
| `.claude/skills/cut-mistakes/SKILL.md`, `scripts/find-cut-candidates.mjs`, `scripts/apply-cuts.mjs` | Proposes stutters, false starts and retakes for approval, then applies the approved cuts |
| `scripts/build-edl-review.mjs` | The review page `cut-mistakes` uses |
| `scripts/transcribe-elevenlabs.mjs` | The ElevenLabs Scribe transcriber `cut-silences` names |

Licences: MIT (`licenses/NATE-HERK-STUDENT-KIT-LICENSE`) and the kit's use permission (`licenses/PIPELINE-USE-PERMISSION.txt`), which asks that the notice be kept when the kit's materials are redistributed. Thank you, Nate.

## Installed on each machine, not bundled

- **HyperFrames** and its skills, by HeyGen: [github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) (Apache-2.0). Installed and updated by HyperFrames' own installer.
- **`kie-models`**, Kie.ai's skill for its generation API: [kie.ai](https://kie.ai).
- **FFmpeg, Node, Chrome, Git**: each under its own licence.

## Refreshing the bundled files (for the maintainer)

Only when one of these happens: ElevenLabs changes or retires the Scribe endpoint or model, a member hits a real bug in the cutters, FFmpeg changes the `-/filter_complex` syntax, or Nate publishes a cutting improvement worth having.

1. Shallow-clone the kit: `git clone --depth 1 https://github.com/nateherkai/hyperframes-student-kit.git`.
2. Copy the same paths from the kit's `.claude/skills/` and `scripts/`, plus `LICENSE` and `licenses/PIPELINE-USE-PERMISSION.txt`, unchanged. Never patch them here.
3. Confirm the skills' commands still say `node .claude/skills/…`.
4. Update the commit and date above, re-run the clean-folder test, then publish.
