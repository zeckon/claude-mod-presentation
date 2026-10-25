import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../../kit';
import {PALETTES} from '../../pixelbar/palettes';
import {Strip, stripLayout, StripState} from '../../pixelbar/Strip';
import {C, INOUT, lerp, MONO, ramp} from '../../theme';

const CW = 7.8;

export const Narrow: React.FC = () => {
	const f = useCurrentFrame();
	const base: StripState = {
		palette: PALETTES[0],
		git: 'main *2 ^2 v1',
		diff: '+124 -37',
		cache: '92%',
		tok: [30, 80, 45, 120, 60, 90, 150, 70],
		h5: 37,
		effort: 2,
		hidden: ['commit', '7d', 'last', 'agents', 'tools', 'edits', 'compacts', 'hint'],
		mood: 'walk',
		tick: Math.floor(f / 8),
	};
	const full = stripLayout(base);
	const cols = Math.round(lerp(full.natural, 34, ramp(f, 40, 200, INOUT)));
	const state: StripState = {...base, cols};
	const kept = stripLayout(state, cols).ids;
	const dropped = full.ids.filter((id) => !kept.includes(id) && id !== 'divider');
	const w = cols * CW;
	const left = 96;
	return (
		<Shell n={5} q="WHAT IF THE TERMINAL IS NARROW?">
			<div style={{position: 'absolute', left, top: 420, opacity: ramp(f, 8, 28)}}>
				<Strip cw={CW} state={state} />
			</div>
			<div style={{position: 'absolute', left: left - 2, top: 400, width: w + 4, height: 2 * CW + 40, border: `2px dashed ${C.dim}`, borderRadius: 4}} />
			<div style={{position: 'absolute', left, top: 500, width: w, height: 3, background: C.clay}} />
			<div style={{position: 'absolute', left: left + w - 3, top: 488, width: 3, height: 27, background: C.clay}} />
			<div style={{position: 'absolute', left, top: 520, fontFamily: MONO, fontSize: 34, color: C.clay}}>{cols} columns</div>
			<div style={{position: 'absolute', left, top: 610, right: 96, fontFamily: MONO, fontSize: 30, color: C.dim, lineHeight: 1.5, opacity: ramp(f, 60, 80)}}>
				dropped: {dropped.length ? dropped.map((d) => d.toUpperCase()).join('  ') : '-'}
			</div>
			<Cap from={14} to={120} size={54}>Too narrow? The least important tiles go <Em>first</Em>.</Cap>
			<Cap from={130} to={228} size={54}>The walker, DIR, MODE and CTX stay.</Cap>
		</Shell>
	);
};
