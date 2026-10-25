import {FilmDef} from '../../Film';
import {Authoring} from './Authoring';
import {AutoRebuild} from './AutoRebuild';
import {ColdOpen} from './ColdOpen';
import {Lifecycle} from './Lifecycle';
import {OptIn} from './OptIn';
import {Sandbox} from './Sandbox';

export const devcontainers: FilmDef = {
	id: 'devcontainers',
	title: 'devcontainers',
	scenes: [
		{id: 'ColdOpen', title: 'What is devcontainers?', d: 330, C: ColdOpen},
		{id: 'Authoring', title: 'How do you write one?', d: 510, C: Authoring},
		{id: 'Lifecycle', title: 'How do you run it?', d: 420, C: Lifecycle},
		{id: 'Sandbox', title: "Where do Claude's commands run?", d: 660, C: Sandbox},
		{id: 'AutoRebuild', title: 'What if the config changes?', d: 420, C: AutoRebuild},
		{id: 'OptIn', title: 'Is any of this on by default?', d: 390, C: OptIn},
	],
};
