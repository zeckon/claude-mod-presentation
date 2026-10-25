# claude-mod-presentation

Animated explainers for every plugin in [zeckon/claude-plugins](https://github.com/zeckon/claude-plugins), built with [Remotion](https://www.remotion.dev) (React, 1920x1080, 30 fps). They are published at **https://zeckon.github.io/claude-plugins/**: an index page plus one player page per plugin.

| Film | Length | What it covers |
|---|---|---|
| `pixelbar` | 3:00 | The status strip tile by tile, the walker's moods, sections and palettes, then how a mod works: hooks, events, state, the `Raster` cell grid |
| `history` | 1:30 | Each turn committed to a shadow repo, opting in, the two shell hooks, what a commit holds, going back and restoring |
| `devcontainers` | 1:31 | Authoring a `devcontainer.json`, running it, sandbox mode via a PreToolUse hook, auto-rebuild via PostToolUse, opt-in state |
| `explain` | 1:31 | What `/explain:diff` reads, the lesson it writes, the quiz, and why it is a skill rather than a hook |

The old page at https://zeckon.github.io/claude-mod-presentation/ now forwards to the new site (`redirect/`, deployed by `.github/workflows/pages.yml`).

## Layout

```
mods-motion/                  the Remotion project
  src/films/<plugin>/         one folder per film: a file per scene, index.tsx lists them
  src/films/index.ts          all films
  src/Film.tsx                plays a film's scenes back to back
  src/Root.tsx                one composition per film (id = plugin name)
  src/kit.tsx                 shared scene frame, captions, chips, code cards
  src/theme.ts                fonts, colors, timing helpers
  src/Loop.tsx                the Claude Code loop diagram (ring, hooks, dot)
  src/Terminal.tsx            terminal mock-up
  src/pixelbar/               pixelbar's strip: palettes, layout, walker
  src/web.tsx                 the web player (Remotion <Player>) for any film
  web/                        site templates: home.html, plugin.html, site.css, plugins.json
  scripts/                    render-media.sh, build-site.mjs, deploy-plugins-site.sh
redirect/                     the forwarding page for this repo's own GitHub Pages
```

Facts on screen come from each plugin's source in claude-plugins (README, hooks, scripts, skills). pixelbar's palettes and strip layout are copied from its `hooks/register.tsx`.

## Run it

Needs Node 20.19+, 22.13+ or 24+.

```bash
cd mods-motion
npm i
npm run dev          # Remotion Studio at http://localhost:3000, one composition per plugin
```

Check a single frame:

```bash
npx remotion still history out/frame.png --frame=250
```

The first render or still downloads a headless Chrome from `remotion.media`. `out/` and `site/` are git-ignored.

## Publish the site

```bash
cd mods-motion
npm run render:media            # posters always; MP4s only if missing (add -- --force to re-render)
npm run deploy:plugins          # builds site/ and pushes it to claude-plugins' gh-pages branch
```

`deploy:plugins` needs push access to zeckon/claude-plugins. GitHub Pages there serves the `gh-pages` branch root.

Per-plugin page text (tagline, notes, poster frame, length) lives in `web/plugins.json`.

## Change a film

- **Scenes and timing:** `src/films/<plugin>/index.tsx`; the total length is derived from the scene list.
- **Text:** captions are `<Cap from to>` blocks at the bottom of each scene file (frames are local to the scene).
- **New plugin:** add `src/films/<name>/`, register it in `src/films/index.ts` and `src/Root.tsx`, and add an entry to `web/plugins.json`.

## Sandbox notes

If you run this in a Docker sandbox, publish the Studio port from the host:

```bash
sbx ports <sandbox-name> --publish 3000:3000/tcp
```

and allow `remotion.media` in the network policy so Chrome can download.
