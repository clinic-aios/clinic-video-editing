# Clinic Video Editing

Edits staff-recorded videos for a UK clinic: recordings go in, finished, on-brand videos come out. Always use British English.

@my-clinic.md

If `my-clinic.md` is missing, ask for the clinic's name, its design system link, where its videos are published and the transcription choice (ElevenLabs or local), then create it.

## Clinic rules (always)

- No patients in recordings edited here. Patients may appear in the clinic's videos with their explicit written consent, but even then the recording holds special category health data, so it is edited outside this folder. If a recording turns out to show a patient, stop and tell the user. Never patient names, or screens from clinic systems (diary, notes, inbox, booking or practice software).
- Never ask the user to put special category patient health data into a chat. Never open folders or files that hold it. Never connect to systems that hold it. If any appears, stop, don't repeat it, and tell the user to delete the conversation and tell their data protection lead.
- Calm pacing: one idea per scene of about four seconds. No hype cuts, flashing or "sizzle".
- Never show AI-generated people as patients, in testimonials, or as before-and-after results. Keep health claims accurate.
- Never print API keys or ask for them in chat.

## Brand

The design system linked in `my-clinic.md` is the only brand source. Read its `project/README.md` with the Artifact tool and write every project's `DESIGN.md` from it: palette, type, logo and tone. When a design-system image or film is used, save a local copy in `media-library/brand/`.

## Folders

- `video-projects/<slug>/`: one folder per video (recording, transcript, cuts, composition, renders).
- `media-library/`: shared media in `brand/`, `kie/` and `b-roll/`. Create any missing folder on first use. Projects use files from here rather than copying them about.
- `.env`: `KIE_API_KEY`, and `ELEVENLABS_API_KEY` if ElevenLabs is used.
- All of these, and `my-clinic.md`, are gitignored and stay on this machine.

## Running order

0. Ask where the video will be published, then set the shape from it: 16:9 or 9:16, 1080p unless asked otherwise.
1. Transcribe word by word (see Transcription).
2. `cut-silences`: render the silenced video.
3. `cut-mistakes`: show the user every candidate cut and apply only the approved ones. Never skip this review.
4. Graphics, captions and render: start at `/hyperframes` with the cut video and let it choose its own workflow and skills. Brand everything from the project's `DESIGN.md`, and put the captions in the same composition. Never name HyperFrames' other skills here: they change between releases, and `/hyperframes` always routes to the current ones.
5. Show the Studio preview before the final render.

The cutting skills mention `validate-beat-sync.mjs` and a "motion graphics agent"; neither applies here, so step 4 follows step 3. Run HyperFrames through `npx hyperframes`, and don't upgrade it in the middle of a project.

## Transcription

The cutting scripts need `{ "words": [ { "text", "start", "end" } ] }`, in seconds on the source video's timeline.

- **ElevenLabs:** `node scripts/transcribe-elevenlabs.mjs <video>`. Its output already has this shape.
- **Local:** `npx hyperframes transcribe <video> --model small.en --json`. It writes a flat array, so wrap it as `{ "words": [...] }` and pass `--video` to the cutters so they read the duration.

Spot-check five words against the audio before cutting.

## Kie.ai

Use Kie's own skill, `kie-models`, for images, video clips and music. Load `KIE_API_KEY` from `.env` into the command's environment without printing it. State the model and the credit cost, and wait for a yes, before every generation. Save outputs to `media-library/kie/` and keep the task id.

## Requirements

FFmpeg 7 or newer with libx264 (the cutters use `-/filter_complex`), Node 22 or newer, Chrome, Git, and `curl` and `jq` for Kie.
