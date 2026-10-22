import {Composition} from 'remotion';
import {Film, TOTAL} from './Film';

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="ClaudeMods"
			component={Film}
			durationInFrames={TOTAL}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};
