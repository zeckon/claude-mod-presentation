import {Player, PlayerRef} from '@remotion/player';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {Film, TOTAL} from './Film';

// The page script drives the player through window.pixelbarPlayer.
declare global {
	interface Window {
		pixelbarPlayer?: PlayerRef | null;
	}
}

const App: React.FC = () => {
	const ref = React.useRef<PlayerRef>(null);
	React.useEffect(() => {
		window.pixelbarPlayer = ref.current;
		const p = ref.current;
		if (!p) return;
		const on = () => window.dispatchEvent(new CustomEvent('pixelbar-frame', {detail: p.getCurrentFrame()}));
		p.addEventListener('frameupdate', on);
		return () => p.removeEventListener('frameupdate', on);
	}, []);
	return (
		<Player
			ref={ref}
			component={Film}
			durationInFrames={TOTAL}
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

createRoot(document.getElementById('player')!).render(<App />);
