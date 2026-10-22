# claude-mod-presentation

A 3-minute animated explainer about **pixelbar**, a Claude Code mod that draws a pixel-art status strip under the prompt, and about how mods work. Built with [Remotion](https://www.remotion.dev) (React): 1920x1080, 30 fps, 5,400 frames.

pixelbar itself lives in [zeckon/claude-plugins](https://github.com/zeckon/claude-plugins).

## What is in the video

| Time | Scene |
|---|---|
| 0:00 | What is pixelbar? |
| 0:11 | What is on the strip? (a tour of every tile) |
| 0:44 | The walker and its five moods |
| 1:06 | Sections and the 12 palettes |
| 1:22 | Narrow terminals |
| 1:30 | How can a plugin draw there? (the loop, hooks, `on(...)`) |
| 1:50 | What a mod is made of (its four files) |
| 2:00 | Events to state |
| 2:18 | How the strip is drawn (cells, `Raster`) |
| 2:38 | Recap and install |

## Layout

```
mods-motion/            the Remotion project
  src/Film.tsx          scene order and durations
  src/scenes/           one file per scene
  src/pixelbar/         the strip: palettes, layout and drop-out logic, walker
  src/Loop.tsx          the Claude Code loop diagram (ring, hooks, dot)
  src/Terminal.tsx      the terminal mock-up the strip sits in
  src/kit.tsx           captions, chips, code cards
  src/theme.ts          fonts, colors, timing helpers
```

The palettes and the strip layout are copied from the pixelbar plugin (`hooks/register.tsx`), so the video shows the real behavior.

## Run it

Needs Node 20.19+, 22.13+ or 24+.

```bash
cd mods-motion
npm i
npm run dev          # Remotion Studio at http://localhost:3000
```

Studio hot-reloads; scrub the timeline to check any scene.

## Render the MP4

```bash
cd mods-motion
npx remotion render ClaudeMods out/pixelbar.mp4
```

The first render or still downloads a headless Chrome from `remotion.media`. `out/` is git-ignored.

Check a single frame:

```bash
npx remotion still ClaudeMods out/frame.png --frame=250
```

## Change it

- **Timing:** scene lengths are in `SCENES` in `mods-motion/src/Film.tsx`; the total is derived from them.
- **Text:** captions are `<Cap from to>` blocks at the bottom of each scene file (frames are local to the scene).
- **Palette or strip contents:** `src/pixelbar/palettes.ts` and the `state` passed to `<Strip>`.

## Sandbox notes

If you run this in a Docker sandbox, publish the Studio port from the host:

```bash
sbx ports <sandbox-name> --publish 3000:3000/tcp
```

and allow `remotion.media` in the network policy so Chrome can download.
