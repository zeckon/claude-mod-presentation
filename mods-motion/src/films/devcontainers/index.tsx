import {FilmDef} from '../../Film';
import {Shell} from '../../kit';

const Placeholder: React.FC = () => <Shell n={1} q="COMING SOON">{null}</Shell>;

export const devcontainers: FilmDef = {
	id: 'devcontainers',
	title: 'devcontainers',
	scenes: [{id: 'Placeholder', title: 'Coming soon', d: 90, C: Placeholder}],
};
