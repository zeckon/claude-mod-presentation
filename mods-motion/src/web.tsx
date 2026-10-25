import {Player, PlayerRef} from '@remotion/player';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {FilmDef, filmLength, FilmView} from './Film';
import {FILMS} from './films';

type Chapter = {title: string; start: number; part?: string};

// The page script drives the player and builds its chapter list from these.
declare global {
	interface Window {
		pluginPlayer?: PlayerRef | null;
		pluginChapters?: Chapter[];
	}
}

const chapters = (film: FilmDef): Chapter[] => {
	let start = 0;
	return film.scenes.map((s) => {
		const c = {title: s.title, start, part: s.part};
		start += s.d;
		return c;
	});
};

const App: React.FC<{film: FilmDef}> = ({film}) => {
	const ref = React.useRef<PlayerRef>(null);
	React.useEffect(() => {
		window.pluginPlayer = ref.current;
		const p = ref.current;
		if (!p) return;
		const on = () => window.dispatchEvent(new CustomEvent('plugin-frame', {detail: p.getCurrentFrame()}));
		p.addEventListener('frameupdate', on);
		return () => p.removeEventListener('frameupdate', on);
	}, []);
	return (
		<Player
			ref={ref}
			component={FilmView}
			inputProps={{film}}
			durationInFrames={filmLength(film)}
			fps={30}
			compositionWidth={1920}
			compositionHeight={1080}
			controls
			clickToPlay
			allowFullscreen
			spaceKeyToPlayOrPause
			acknowledgeRemotionLicense
			style={{width: '100%', aspectRatio: '16 / 9'}}
		/>
	);
};

const el = document.getElementById('player');
const film = el ? FILMS[el.dataset.film ?? ''] : undefined;
if (el && film) {
	window.pluginChapters = chapters(film);
	window.dispatchEvent(new Event('plugin-chapters'));
	createRoot(el).render(<App film={film} />);
}
