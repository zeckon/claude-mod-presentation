// Wraps web/index.html (a page fragment: head tags, then <main>) into a full
// document and copies it, with player.js, to site/ for GitHub Pages.
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const src = readFileSync('web/index.html', 'utf8');
const at = src.indexOf('<main>');
if (at < 0) throw new Error('web/index.html has no <main>');

const html = `<!doctype html>
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

mkdirSync('site', {recursive: true});
writeFileSync('site/index.html', html);
copyFileSync('web/player.js', 'site/player.js');
console.log('site/ ready');
