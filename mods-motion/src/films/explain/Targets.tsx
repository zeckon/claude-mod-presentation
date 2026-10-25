import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell, typed} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';

const CARDS = [
	{t: 'Uncommitted changes', s: 'staged or not', ex: 'working tree'},
	{t: 'A branch', s: 'compared with main', ex: 'feature/x'},
	{t: 'A commit or range', s: 'one commit, or several', ex: 'abc1234'},
	{t: 'A pull request', s: 'by number or URL', ex: '#123'},
];

// Example arguments from the README, and the card each one points at.
const EXAMPLES = [
	{arg: 'the current branch against main', card: 1, at: 170},
	{arg: 'PR #123', card: 3, at: 232},
	{arg: 'commit abc1234', card: 2, at: 290},
];

const CW = 386;
const GAP = 30;
const LEFT = (1920 - (4 * CW + 3 * GAP)) / 2;

export const Targets: React.FC = () => {
	const f = useCurrentFrame();
	const cur = [...EXAMPLES].reverse().find((e) => f >= e.at);
	const arg = cur ? typed(cur.arg, f, cur.at, 1) : '';
	const cmd = typed('/explain:diff ', f, 14, 1.2);
	const placeholder = !cur && f >= 34;
	return (
		<Shell n={2} q="WHAT CAN YOU POINT IT AT?">
			<div style={{position: 'absolute', left: 220, top: 170, width: 1480, height: 100, boxSizing: 'border-box', border: `2px solid ${C.line}`, borderRadius: 14, background: '#0e1115', padding: '0 34px', fontFamily: MONO, fontSize: 40, lineHeight: '96px', color: C.text, whiteSpace: 'pre', opacity: ramp(f, 4, 20)}}>
				<span style={{color: C.clay}}>{'> '}</span>
				<span style={{color: C.clay}}>{cmd}</span>
				{placeholder ? <span style={{color: C.dim, opacity: ramp(f, 34, 48)}}>{'<what to explain>'}</span> : arg}
				<span style={{display: 'inline-block', width: 20, height: 44, verticalAlign: 'middle', marginLeft: 4, background: C.text, opacity: Math.floor(f / 15) % 2 ? 0 : 0.85}} />
			</div>

			{CARDS.map((c, i) => {
				const o = ramp(f, 80 + i * 16, 100 + i * 16);
				const on = cur?.card === i && f >= cur.at + 6;
				return (
					<div
						key={c.t}
						style={{
							position: 'absolute',
							left: LEFT + i * (CW + GAP),
							top: 360,
							width: CW,
							height: 330,
							boxSizing: 'border-box',
							padding: '34px 30px',
							borderRadius: 18,
							background: on ? '#d977571c' : C.panel,
							border: `3px solid ${on ? C.clay : C.line}`,
							opacity: o * (cur && !on ? 0.55 : 1),
							translate: `0 ${(1 - o) * 30}px`,
							boxShadow: on ? `0 0 50px ${C.clay}44` : undefined,
						}}
					>
						<div style={{fontFamily: MONO, fontSize: 30, color: on ? C.clay : C.dim}}>{String(i + 1).padStart(2, '0')}</div>
						<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.text, marginTop: 24, lineHeight: 1.15}}>{c.t}</div>
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 12}}>{c.s}</div>
						<div style={{position: 'absolute', left: 30, bottom: 30, fontFamily: MONO, fontSize: 28, color: on ? C.clay : C.text, padding: '4px 14px', border: `2px solid ${on ? C.clay : C.line}`, borderRadius: 8}}>{c.ex}</div>
					</div>
				);
			})}

			<Cap from={10} to={76}>One command. Tell it <Em>what</Em> to explain.</Cap>
			<Cap from={84} to={164} size={54}>Anything Claude can resolve to a change in the repo.</Cap>
			<Cap from={176} to={352}>Plain words work.</Cap>
		</Shell>
	);
};
