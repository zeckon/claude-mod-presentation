// Builds the claude-plugins site into site/: an index page and one player page
// per plugin, from the fragments in web/ (head tags, then <main>), plus the
// player bundle, each film's poster and MP4 (rendered into out/ beforehand).
import {copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';

const css = readFileSync('web/site.css', 'utf8');
const plugins = JSON.parse(readFileSync('web/plugins.json', 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k === 'css' || k === 'cards' ? vars[k] : esc(vars[k] ?? '')));

/** Wraps a fragment into a full document: everything before <main> goes in <head>. */
const wrap = (src) => {
	const at = src.indexOf('<main>');
	if (at < 0) throw new Error('fragment has no <main>');
	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${src.slice(0, at)}
</head>
<body>
${src.slice(at)}
</body>
</html>
`;
};

rmSync('site', {recursive: true, force: true});
mkdirSync('site', {recursive: true});
writeFileSync('site/.nojekyll', '');
copyFileSync('web/player.js', 'site/player.js');

const page = readFileSync('web/plugin.html', 'utf8');
for (const p of plugins) {
	const dir = `site/${p.id}`;
	mkdirSync(dir, {recursive: true});
	writeFileSync(`${dir}/index.html`, wrap(fill(page, {...p, css})));
	for (const [from, to] of [[`out/${p.id}.jpg`, 'poster.jpg'], [`out/${p.id}.mp4`, `${p.id}.mp4`]]) {
		if (!existsSync(from)) throw new Error(`missing ${from}: run scripts/render-media.sh first`);
		copyFileSync(from, `${dir}/${to}`);
	}
}

const cards = plugins
	.map(
		(p) => `		<a class="card" href="${p.id}/">
			<img src="${p.id}/poster.jpg" alt="Still from the ${esc(p.id)} explainer" loading="lazy" width="1920" height="1080">
			<div class="name">${esc(p.id)} <span>${esc(p.length)} video</span></div>
			<p>${esc(p.tagline)}</p>
		</a>`,
	)
	.join('\n');
writeFileSync('site/index.html', wrap(fill(readFileSync('web/home.html', 'utf8'), {css, cards})));
console.log(`site/ ready: index + ${plugins.map((p) => p.id).join(', ')}`);
