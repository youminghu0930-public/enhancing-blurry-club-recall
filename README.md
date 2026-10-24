# Enhancing Blurry Club Recall

A technical showcase of applying state-of-the-art segmentation and custom heuristic blur synthesis to improve difficult blurred-club recall. Plain HTML, CSS, and JavaScript; no production backend.

## Local preview

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:8003. FFmpeg and ffprobe are required. No npm installation is needed. To use another port, run `node scripts/serve.mjs 8004`.

The server prepares missing snapshot images at startup and refreshes the catalog after source data or content changes on page reload. Restart an already-running server after changing the server or preparation scripts.

## Content and layout

All copy and labels live in `materials/content.json`. The page follows the revised portfolio template:

1. Abstract: short summary, metrics, and snapshot carousel.
2. Introduction: background, data gap, and working hypothesis.
3. Methods: implementation choices and their purpose, with proprietary details omitted.
4. Results: recall summary and video comparison.
5. Discussion: interpretation, limitations, MLOps integration, and future work.
6. Conclusion: concise technical takeaway.

`demo` is a shared top-level object for snapshot and video labels. Set `snapshots: true` on a section to mount the carousel there. Results (`id: result`) mounts the video viewer. Metrics retain the template design and appear after the Abstract paragraph.

## Materials and snapshots

```text
materials/
  content.json
  data/
    snapshot.json
    snapshots/<camera-view>/<clip>/<zero-based-frame>.jpg
    vidoes/<camera-view>/<clip>.MP4
    poses/
      before/<camera-view>/<clip>.json
      after/<camera-view>/<clip>.json
```

The existing `vidoes` spelling is preserved. Matching videos and both prediction files are discovered automatically. Predictions use `joints` and frame-indexed `pred` arrays.

Edit `materials/data/snapshot.json` to select snapshots and captions:

```json
{
  "0000": {
    "203": {
      "golf_club_head": {
        "before": "Misplaced club head",
        "after": "Correct club head location"
      }
    }
  }
}
```

Indices are zero-based: index 203 is displayed as frame 204. A view-specific clip key (such as `face-on-0000`) resolves ambiguous IDs. Multiple joint entries and optional titles are supported.

Preparation extracts each selected frame into `snapshots/<camera-view>/<clip>/<frame>.jpg`. Existing `.jpg`, `.jpeg`, `.png`, or `.webp` images with that frame name are reused unless older than the source video. Missing or stale extracted frames are regenerated automatically; source videos and predictions are unchanged. Run `node scripts/prepare-data.mjs` to prepare without starting a server.

The browser loads compact WebP derivatives and only the selected frame's predictions from the catalog. Snapshot loading never downloads or decodes a video, including error fallback. Extracted JPEGs can be committed for inspection; CI also regenerates them from committed videos when missing. Only referenced delivery assets are published.

The first Abstract snapshot initializes on landing. Remaining snapshots and the selected video's metadata warm after the hero leaves the viewport; full video buffering follows snapshot readiness. Other videos are loaded on selection. The banner retains its early loading priority, original stripe framing, and complete human-and-club skeleton; Results and snapshots remain club-only. `page.banner.video` and one-based `startFrame` control the banner clip and start point.

Before/After predictions share one image or video. Yellow is Before; green is After. Legend eyes toggle each overlay and its messages. The After tag retains its crown; messages use red cross and green circle status icons. Club points are hollow and connections use solid colors. The shared pan/zoom, frame controls, carousel, and project-specific message placement are preserved.

Optional attribution belongs in `materials/data/credits.json`.

## Generated output and deployment

`materials/data/catalog.json`, `materials/data/.generated/`, and `dist/` are ignored generated files. The production build copies selected generated assets to `dist/media/` and rewrites their URLs because GitHub Pages' artifact uploader excludes dot-prefixed directories.

```sh
node --test tests/*.test.mjs
node scripts/build-site.mjs
node scripts/verify-site.mjs
node scripts/serve.mjs --dist
```

For GitHub Pages, select **Settings → Pages → Source → GitHub Actions**. The workflow runs on pushes to `main` or `master`, or manually from Actions. It installs Node.js 22 and FFmpeg, runs tests, builds from committed source materials, verifies asset paths, and publishes only `dist/`. Source media and prediction files must be committed for CI to include them. No local preview server runs in production.
