#!/usr/bin/env bash
# Builds the site and publishes it to the gh-pages branch of zeckon/claude-plugins,
# which GitHub Pages serves at https://zeckon.github.io/claude-plugins/.
# Run scripts/render-media.sh first so posters and MP4s exist in out/.
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=https://github.com/zeckon/claude-plugins.git
npm run build:site
src=$(git rev-parse --short HEAD)

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
if git ls-remote --exit-code --heads "$REPO" gh-pages >/dev/null; then
	git clone --quiet --depth 1 --branch gh-pages "$REPO" "$work"
else
	git clone --quiet --depth 1 "$REPO" "$work"
	git -C "$work" checkout --quiet --orphan gh-pages
	git -C "$work" rm -rq --cached .
	find "$work" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
fi
rsync -a --delete --exclude .git site/ "$work/"
cd "$work"
git add -A
if git diff --cached --quiet; then
	echo "gh-pages already up to date"
	exit 0
fi
git commit --quiet -m "deploy: plugin videos site from claude-mod-presentation@$src"
git push --quiet origin gh-pages
echo "pushed gh-pages ($src)"
