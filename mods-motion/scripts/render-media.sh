#!/usr/bin/env bash
# Renders each film's poster still (always) and MP4 (when missing, or with
# --force) into out/, for scripts/build-site.mjs to copy into the site.
set -euo pipefail
cd "$(dirname "$0")/.."
force=${1:-}
mkdir -p out
node -e 'for (const p of require("./web/plugins.json")) console.log(p.id, p.poster)' | while read -r id frame; do
	npx remotion still "$id" "out/$id.jpg" --frame="$frame" --image-format=jpeg --jpeg-quality=85 --log=error
	if [[ "$force" == "--force" || ! -f "out/$id.mp4" ]]; then
		npx remotion render "$id" "out/$id.mp4" --codec=h264 --log=error
	fi
	echo "$id: out/$id.jpg out/$id.mp4"
done
