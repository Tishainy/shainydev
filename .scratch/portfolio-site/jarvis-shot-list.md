# Jarvis demo clip: shot list

**Goal:** a 20–40 second screen recording that shows a non-technical visitor, in one glance, that Jarvis listens, thinks and answers out loud. It plays silently by default on the site (visitors can unmute), so **the screen must tell the story even without sound**.

## Setup

- **Record:** your screen plus the microphone/system audio. On Windows, **Xbox Game Bar** (`Win + G`, then record) or **OBS Studio** both work.
- **Size:** 1920×1080 if you can, landscape.
- **Screen layout:** make the terminal (or log window) where Jarvis prints what it heard and what it says large and readable. Bump the font size up to around 18–20pt and close everything else. Dark terminal theme is ideal; it matches the site.
- **Quiet room**, so the speech recognition hears you clearly on the first try.
- Do a couple of practice runs, then record 3–4 takes and keep the cleanest.

## The shots (in order)

| # | Time | What you do | What should be visible on screen |
|---|------|-------------|----------------------------------|
| 1 | 0–3s | Nothing yet. | Jarvis running and idle (e.g. "Listening…"). |
| 2 | 3–8s | Say **"Hey Jarvis"**. | The wake word being detected. |
| 3 | 8–15s | Ask it to set a reminder, e.g. **"Remind me to call the client at three o'clock."** | Your words appearing as transcribed text. |
| 4 | 15–25s | Let it answer. | Jarvis's reply printed **and** spoken (the confirmation of the reminder). |
| 5 | 25–35s | Optional, if it works reliably: ask a normal question, e.g. **"What's on my list today?"** | The second reply, showing it remembers tasks. |
| 6 | last 2s | Stop talking, let it sit idle for a moment. | A clean end frame (this frame also becomes the video's still image). |

## Tips

- **Speak naturally** and a bit slower than normal. Don't rush the wake word.
- **Don't show** IP addresses, file paths with your username, or anything personal in the terminal. Scroll those out of view or clear the screen first (`cls` / `clear`) before you start recording.
- If the 3B model is slow on the CPU, that's fine. I can trim the waiting time out in editing, so don't fill the silence.
- Presence detection and the camera are a nice bonus, but only include them if they're easy to show. Never film anything in your room you wouldn't want public.

## Hand-off

Drop the raw recording (any format) into the repo folder `assets-raw/` (or send it to me however is easiest). I'll trim it, compress it for the web, and make the still image (ticket 04).
