import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell, typed} from '../kit';
import {hex, PALETTES} from '../pixelbar/palettes';
import {Strip} from '../pixelbar/Strip';
import {C, MONO, ramp, SANS} from '../theme';

const CW = 10.6;
const COLS = 160;

const Command: React.FC<{text: string; y: number; opacity?: number}> = ({text, y, opacity = 1}) => (
	<div style={{position: 'absolute', left: 200, right: 200, top: y, height: 84, borderRadius: 14, border: `2px solid ${C.line}`, background: C.panel, fontFamily: MONO, fontSize: 38, lineHeight: '80px', padding: '0 30px', color: C.text, opacity}}>
		{text}
	</div>
);

export const Customize: React.FC = () => {
	const f = useCurrentFrame();

	// part 1: sections
	const c1 = '/pixelbar-sections on commit';
	const c2 = '/pixelbar-sections off session';
	const showCmd2 = f >= 120;
	const cmd = showCmd2 ? typed(c2, f, 124) : typed(c1, f, 28);
	const commit = f >= 78 ? '5m feat(pixelbar): two lines' : null;
	const hidden = ['7d', 'last', 'agents', 'tools', 'edits', 'compacts', 'hint', ...(f >= 78 ? [] : ['commit']), ...(f >= 176 ? ['session'] : []), 'diff', 'mode', 'effort'];

	// part 2: palettes
	const part2 = f >= 236;
	const pi = f < 280 ? 0 : Math.min(11, Math.floor((f - 280) / 16) + 1);
	const palette = PALETTES[part2 ? pi : 0];

	return (
		<Shell n={4} q="CAN YOU MAKE IT YOURS?">
			<Command text={part2 ? typed('/pixelbar-palette', f, 244) : `> ${cmd}`.replace('> ', '')} y={230} opacity={ramp(f, 10, 28)} />
			<div style={{position: 'absolute', left: (1920 - COLS * CW) / 2, top: 420, opacity: ramp(f, 14, 34)}}>
				<Strip cw={CW} state={{palette, cols: COLS, hidden, commit, mood: 'walk', tick: Math.floor(f / 8)}} />
			</div>
			{part2 ? (
				<>
					<div style={{position: 'absolute', top: 540, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 36, color: hex(palette.accent)}}>
						{f >= 280 ? `pixelbar: palette ${palette.name} (${pi + 1}/12)` : ''}
					</div>
					<div style={{position: 'absolute', top: 650, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16}}>
						{PALETTES.map((pl, i) => (
							<div key={pl.id} style={{width: 84, height: 84, borderRadius: 10, background: hex(pl.ground), border: `4px solid ${i === pi ? '#fff' : C.line}`, display: 'grid', placeItems: 'center', scale: i === pi ? 1.12 : 1}}>
								<div style={{width: 36, height: 36, background: hex(pl.accent)}} />
							</div>
						))}
					</div>
				</>
			) : (
				<div style={{position: 'absolute', top: 560, left: 200, right: 200, fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.dim, lineHeight: 1.4, opacity: ramp(f, 40, 70)}}>
					Project: dir, git, diff, commit, stash
					<br />
					Claude and session: mode, model, effort, ctx, cache, tok, 5h, 7d, session, last, agents, tools, edits, compacts, hint
				</div>
			)}
			<Cap from={30} to={110}>Every section can be switched <Em>on or off</Em>.</Cap>
			<Cap from={120} to={226}>Your choice is saved for next time.</Cap>
			<Cap from={262} to={470} size={54}>12 palettes: one hue each, plus an <Em>alert</Em> color.</Cap>
		</Shell>
	);
};
