import {FilmDef} from '../../Film';
import {Anatomy} from './Anatomy';
import {ColdOpen} from './ColdOpen';
import {Customize} from './Customize';
import {Files} from './Files';
import {HowHooks} from './HowHooks';
import {Moods} from './Moods';
import {Narrow} from './Narrow';
import {RasterScene} from './Raster';
import {Recap} from './Recap';
import {State} from './State';

export const pixelbar: FilmDef = {
	id: 'pixelbar',
	title: 'pixelbar',
	scenes: [
		{id: 'ColdOpen', title: 'What is pixelbar?', d: 330, C: ColdOpen, part: 'The strip'},
		{id: 'Anatomy', title: 'What is on the strip?', d: 1000, C: Anatomy},
		{id: 'Moods', title: 'What does the walker do?', d: 660, C: Moods},
		{id: 'Customize', title: 'Can you make it yours?', d: 480, C: Customize},
		{id: 'Narrow', title: 'What if the terminal is narrow?', d: 240, C: Narrow},
		{id: 'HowHooks', title: 'How can a plugin draw there?', d: 600, C: HowHooks, part: 'How mods work'},
		{id: 'Files', title: 'What is a mod made of?', d: 300, C: Files},
		{id: 'State', title: 'What does it do with events?', d: 540, C: State},
		{id: 'Raster', title: 'How is the strip drawn?', d: 600, C: RasterScene},
		{id: 'Recap', title: 'How does it all fit?', d: 650, C: Recap},
	],
};
