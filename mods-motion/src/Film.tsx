import React from 'react';
import {Series} from 'remotion';
import {Anatomy} from './scenes/Anatomy';
import {ColdOpen} from './scenes/ColdOpen';
import {Customize} from './scenes/Customize';
import {Files} from './scenes/Files';
import {HowHooks} from './scenes/HowHooks';
import {Moods} from './scenes/Moods';
import {Narrow} from './scenes/Narrow';
import {RasterScene} from './scenes/Raster';
import {Recap} from './scenes/Recap';
import {State} from './scenes/State';

export const SCENES = [
	{id: 'ColdOpen', d: 330, C: ColdOpen},
	{id: 'Anatomy', d: 1000, C: Anatomy},
	{id: 'Moods', d: 660, C: Moods},
	{id: 'Customize', d: 480, C: Customize},
	{id: 'Narrow', d: 240, C: Narrow},
	{id: 'HowHooks', d: 600, C: HowHooks},
	{id: 'Files', d: 300, C: Files},
	{id: 'State', d: 540, C: State},
	{id: 'Raster', d: 600, C: RasterScene},
	{id: 'Recap', d: 650, C: Recap},
];
export const TOTAL = SCENES.reduce((n, s) => n + s.d, 0);

export const Film: React.FC = () => (
	<Series>
		{SCENES.map(({id, d, C}) => (
			<Series.Sequence key={id} durationInFrames={d} name={id}>
				<C />
			</Series.Sequence>
		))}
	</Series>
);
