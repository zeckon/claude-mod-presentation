import {FilmDef} from '../../Film';
import {ColdOpen} from './ColdOpen';
import {Commit} from './Commit';
import {Enable} from './Enable';
import {Hooks} from './Hooks';
import {Privacy} from './Privacy';
import {Rewind} from './Rewind';

export const history: FilmDef = {
	id: 'history',
	title: 'history',
	scenes: [
		{id: 'ColdOpen', title: 'What is history?', d: 450, C: ColdOpen},
		{id: 'Enable', title: 'Which projects does it record?', d: 390, C: Enable},
		{id: 'Hooks', title: 'How does it plug into Claude Code?', d: 540, C: Hooks},
		{id: 'Commit', title: 'What does one commit hold?', d: 360, C: Commit},
		{id: 'Rewind', title: 'How do you go back?', d: 512, C: Rewind},
		{id: 'Privacy', title: 'Where does it all go?', d: 450, C: Privacy},
	],
};
