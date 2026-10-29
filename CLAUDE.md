# Clinic Video Editing

Edits staff-recorded videos for a UK clinic: recordings go in, finished, on-brand videos come out. Always use British English.

@my-clinic.md

## Setup and updates

`SETUP.md` is the setup guide. Follow it when:
- the person asks to set up, continue setup or update;
- `my-clinic.md` is missing (setup isn't finished, so offer to continue it);
- a tool turns out to be missing mid-edit.

Coach the person through any problem their computer throws up, as the guide describes.

## Clinic rules (always)

- No patients in recordings edited here. Patients may appear in the clinic's videos with their explicit written consent, but even then the recording holds special category health data, so it is edited outside this folder. If a recording turns out to show a patient, stop and tell the user. Never patient names, or screens from clinic systems (diary, notes, inbox, booking or practice software).
- Never ask the user to put special category patient health data into a chat. Never open folders or files that hold it. Never connect to systems that hold it. If any appears, stop, don't repeat it, and tell the user to delete the conversation and tell their data protection lead.
- Calm pacing: one idea per scene of about four seconds. No hype cuts, flashing or "sizzle".
- Never show AI-generated people as patients, in testimonials, or as before-and-after results. Keep health claims accurate.
- Never print API keys or ask for them in chat.

## Running order

0. Ask where the video will be published, then set the shape from it: 16:9 or 9:16, 1080p unless asked otherwise.
1. `transcribe`: the word-by-word transcript.
2. `cut-silences`: render the silenced video.
3. `cut-mistakes`:
   - Run its finder.
   - Then read the whole silenced transcript yourself and add anything it missed, such as restarts ("I'm going to, um, I'm going to") and stray "um"s.
   - Show the person every candidate with your recommendation, and apply only the ones they approve. Never skip this review.
4. Graphics, captions and render:
   - Start at `/hyperframes` with the cut video, and let it choose its own workflow and skills.
   - Brand everything from the project's `DESIGN.md`, and put the captions in the same composition.
   - Never name HyperFrames' other skills here. They change between releases, and `/hyperframes` always routes to the current ones.
5. Show the Studio preview before the final render.

The cutting skills mention ElevenLabs, `validate-beat-sync.mjs` and a "motion graphics agent". None of these applies here: transcription is step 1, and step 4 follows step 3. Run HyperFrames as `npx --yes hyperframes`, and don't update it in the middle of a video.

The skills in this folder are listed in `SKILLS.md`.

## Brand

The design system linked in `my-clinic.md` is the only brand source. Read its `project/README.md` with the Artifact tool and write every project's `DESIGN.md` from it: palette, type, logo and tone. When a design-system image or film is used, save a local copy in `media-library/brand/`.

## Folders

- `video-projects/<slug>/`: one folder per video. It holds the recording, `work/` (transcripts and cuts), the composition and `renders/`.
- `media-library/`: shared media in `brand/`, `kie/` and `b-roll/`. Projects use files from here rather than copying them about.
- `.env`: `KIE_API_KEY`.
- All of these, and `my-clinic.md`, are gitignored and stay on this computer.

## Kie.ai

- Use Kie's own skill, `kie-models`, for images, video clips and music.
- Load the key into the command without printing it: `set -a; . ./.env; set +a`.
- Before every generation, state the model and the credit cost, and wait for a yes.
- Save outputs to `media-library/kie/` and keep the task id.
