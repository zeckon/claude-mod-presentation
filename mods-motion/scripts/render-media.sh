#!/usr/bin/env bash
# Renders each plugin's poster (the poster-<id> still, always) and MP4 (when missing, or with
# --force) into out/, for scripts/build-site.mjs to copy into the site.
set -euo pipefail
cd "$(dirname "$0")/.."
force=${1:-}
mkdir -p out
node -e 'for (const p of require("./web/plugins.json")) console.log(p.id)' | while read -r id; do
	npx remotion still "poster-$id" "out/$id.jpg" --image-format=jpeg --jpeg-quality=88 --log=error
	if [[ "$force" == "--force" || ! -f "out/$id.mp4" ]]; then
		npx remotion render "$id" "out/$id.mp4" --codec=h264 --log=error
	fi
	echo "$id: out/$id.jpg out/$id.mp4"
done
