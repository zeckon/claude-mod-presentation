import React from 'react';
import {Series} from 'remotion';

export type Scene = {id: string; title: string; d: number; C: React.FC; part?: string};
export type FilmDef = {id: string; title: string; scenes: Scene[]};

export const filmLength = (film: FilmDef) => film.scenes.reduce((n, s) => n + s.d, 0);

/** Plays a film's scenes back to back. */
export const FilmView: React.FC<{film: FilmDef}> = ({film}) => (
	<Series>
		{film.scenes.map(({id, d, C}) => (
			<Series.Sequence key={id} durationInFrames={d} name={id}>
				<C />
			</Series.Sequence>
		))}
	</Series>
);
