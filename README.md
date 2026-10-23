# Enhancing Blurry Club Recall

A buildless showcase based on `improving-golf-swing-pose-estimation`, preserving its styling, typography, five sections, left navigation, snapshot carousel, and synchronized Before/After comparison.

## Run locally

```sh
node scripts/serve.mjs
```

Open http://127.0.0.1:8003. Use `node scripts/serve.mjs 8004` if that port is occupied. FFmpeg and ffprobe are required for metadata and previews. No npm installation is needed.

## Content and materials

All page copy and labels live in `materials/content.json`. The first four sections have placeholders; Results uses your supplied examples. Edit the existing sample snapshot wording as needed.

```text
materials/
  content.json
  data/
    vidoes/<camera-view>/<clip>.MP4
    poses/
      before/<camera-view>/<clip>.json
      after/<camera-view>/<clip>.json
      snapshot.json
```

The existing `vidoes` spelling is preserved. Videos and matching before/after predictions are discovered automatically. Predictions use `joints` and frame-indexed `pred` arrays. Both golfer and club points are visible. Unpaired clips are skipped.

`poses/snapshot.json` selects zero-based frames, highlighted joints, titles, and `message_box.before` / `message_box.after` annotations. The supplied example remains unchanged. Optional attribution can be added in `materials/data/credits.json`.

`materials/data/catalog.json`, `materials/data/.generated/`, and `dist/` are ignored generated output. Reload after data changes to refresh metadata. Source videos and predictions are preserved. The server supports byte-range video seeking. The comparison retains linked zoom/pan, shared playback, frame stepping, and lazy loading.

Build a static bundle with `node scripts/build-site.mjs`, then preview with `node scripts/serve.mjs --dist`. Nothing is published automatically.
