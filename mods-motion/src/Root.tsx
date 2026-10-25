import {Composition, Folder, Still} from 'remotion';
import {FilmView, filmLength} from './Film';
import {FILMS} from './films';
import {DevcontainersPoster, ExplainPoster, HistoryPoster, PixelbarPoster} from './Posters';

const Pixelbar: React.FC = () => <FilmView film={FILMS.pixelbar} />;
const History: React.FC = () => <FilmView film={FILMS.history} />;
const Devcontainers: React.FC = () => <FilmView film={FILMS.devcontainers} />;
const Explain: React.FC = () => <FilmView film={FILMS.explain} />;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition id="pixelbar" component={Pixelbar} durationInFrames={filmLength(FILMS.pixelbar)} fps={30} width={1920} height={1080} />
			<Composition id="history" component={History} durationInFrames={filmLength(FILMS.history)} fps={30} width={1920} height={1080} />
			<Composition id="devcontainers" component={Devcontainers} durationInFrames={filmLength(FILMS.devcontainers)} fps={30} width={1920} height={1080} />
			<Composition id="explain" component={Explain} durationInFrames={filmLength(FILMS.explain)} fps={30} width={1920} height={1080} />
			<Folder name="posters">
				<Still id="poster-pixelbar" component={PixelbarPoster} width={1080} height={1080} />
				<Still id="poster-history" component={HistoryPoster} width={1080} height={1080} />
				<Still id="poster-devcontainers" component={DevcontainersPoster} width={1080} height={1080} />
				<Still id="poster-explain" component={ExplainPoster} width={1080} height={1080} />
			</Folder>
		</>
	);
};
