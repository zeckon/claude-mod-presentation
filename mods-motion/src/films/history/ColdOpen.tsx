import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell, typed} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';

const PROMPTS = ['set up the settings page', 'refactor the theme tokens', 'add a dark mode toggle', 'fix the flicker on load'];
const SHAS = ['1d9e6c7', 'b3f8a20', '7c41e9a', '9e2d4b1'];
const T0 = 26;
const GAP = 62;
const X0 = 420;
const DX = 380;
const LINE_L = 120;
const LINE_R = 1800;
const YA = 500;
const YB = 690;

/** One horizontal timeline with a label above it. */
const Track: React.FC<{y: number; label: string; path: string; o: number; hi: number}> = ({y, label, path, o, hi}) => (
	<>
		<div style={{position: 'absolute', left: LINE_L, top: y - 64, fontFamily: MONO, fontSize: 26, color: C.dim, opacity: o, whiteSpace: 'nowrap'}}>
			<span style={{color: C.text, fontWeight: 700}}>{label}</span>
			{'   '}
			<span style={{color: hi > 0 ? C.clay : C.dim}}>{path}</span>
		</div>
		<div style={{position: 'absolute', left: LINE_L, top: y - 2, width: (LINE_R - LINE_L) * o, height: 4, background: C.line, borderRadius: 2}} />
	</>
);

const Dot: React.FC<{x: number; y: number; p: number; color: string; label?: string}> = ({x, y, p, color, label}) =>
	p <= 0 ? null : (
		<>
			<div style={{position: 'absolute', left: x - 18, top: y - 18 - (1 - p) * 60, width: 36, height: 36, borderRadius: 36, background: color, opacity: p, boxShadow: `0 0 ${24 * (1 - p) + 10}px ${color}88`}} />
			{label ? <div style={{position: 'absolute', left: x, top: y + 30, translate: '-50% 0', fontFamily: MONO, fontSize: 24, color: C.dim, opacity: p}}>{label}</div> : null}
		</>
	);

export const ColdOpen: React.FC = () => {
	const f = useCurrentFrame();
	const idx = Math.max(0, Math.min(PROMPTS.length - 1, Math.floor((f - T0) / GAP)));
	const t = T0 + idx * GAP;
	const working = f > t + 30 && f < t + GAP - 4 && f < T0 + PROMPTS.length * GAP;
	const diagram = 1 - 0.88 * ramp(f, 330, 356);
	const title = ramp(f, 340, 372);
	const sep = ramp(f, 226, 246) * (1 - ramp(f, 320, 334));
	return (
		<Shell n={1} q="WHAT IS HISTORY?">
			<div style={{opacity: diagram}}>
				<div style={{position: 'absolute', left: 360, top: 200, width: 1200, height: 92, borderRadius: 14, background: '#0e1115', border: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 32, lineHeight: '88px', padding: '0 28px', color: C.text, opacity: ramp(f, 4, 22), boxSizing: 'border-box'}}>
					<span style={{color: C.clay}}>{'> '}</span>
					{f < T0 + PROMPTS.length * GAP ? typed(PROMPTS[idx], f, t, 0.9) : ''}
					{working ? <span style={{color: C.dim}}>{'   ' + '...'.slice(0, 1 + (Math.floor(f / 6) % 3))}</span> : null}
				</div>
				<div style={{position: 'absolute', left: 360, top: 304, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, opacity: ramp(f, 10, 28)}}>
					you prompt, Claude edits files
				</div>

				<Track y={YA} label="your repo" path="myproject/.git" o={ramp(f, 8, 40)} hi={0} />
				<Track y={YB} label="shadow repo" path="~/.claude-history/myproject-a3f9b2.git" o={ramp(f, 16, 48)} hi={sep} />
				<Dot x={220} y={YA} p={ramp(f, 30, 44)} color={C.text} label="init" />
				<Dot x={1250} y={YA} p={ramp(f, 196, 214)} color={C.text} label="your commit" />
				{PROMPTS.map((_, i) => (
					<Dot key={i} x={X0 + i * DX} y={YB} p={ramp(f, T0 + i * GAP + GAP - 8, T0 + i * GAP + GAP + 8)} color={C.clay} label={SHAS[i]} />
				))}
				{/* the shadow line is its own track: a barrier between the two repos */}
				<div style={{position: 'absolute', left: LINE_L, top: (YA + YB) / 2 - 2, width: LINE_R - LINE_L, height: 0, borderTop: `3px dashed ${C.clay}`, opacity: sep * 0.7}} />
			</div>

			<div style={{position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', opacity: title, translate: `0 ${(1 - title) * 30}px`}}>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 170, color: C.clay, lineHeight: 1}}>history</div>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 40, color: C.dim, marginTop: 22}}>a git commit for every Claude Code turn</div>
			</div>

			<Cap from={20} to={104}>Every prompt, Claude changes your files.</Cap>
			<Cap from={112} to={220}>Each turn becomes a <Em>commit</Em>: prompt plus files.</Cap>
			<Cap from={228} to={326}>A separate repo. Your project&apos;s <Em>.git</Em> is never touched.</Cap>
			<Cap from={364} to={444}>Meet history.</Cap>
		</Shell>
	);
};
