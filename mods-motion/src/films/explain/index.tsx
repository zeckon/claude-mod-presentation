import {FilmDef} from '../../Film';
import {ColdOpen} from './ColdOpen';
import {HowItWorks} from './HowItWorks';
import {Investigate} from './Investigate';
import {Page} from './Page';
import {Quiz} from './Quiz';
import {Targets} from './Targets';

export const explain: FilmDef = {
	id: 'explain',
	title: 'explain',
	scenes: [
		{id: 'ColdOpen', title: 'What is explain?', d: 330, C: ColdOpen},
		{id: 'Targets', title: 'What can you point it at?', d: 360, C: Targets},
		{id: 'Investigate', title: 'What does it read first?', d: 540, C: Investigate},
		{id: 'Page', title: 'What does it write?', d: 570, C: Page},
		{id: 'Quiz', title: 'Did you understand it?', d: 330, C: Quiz},
		{id: 'HowItWorks', title: 'How does it work?', d: 600, C: HowItWorks},
	],
};
