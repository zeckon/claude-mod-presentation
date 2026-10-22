import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Chip, Em, Shell} from '../kit';
import {C, MONO, ramp, SANS} from '../theme';

const T0 = 40;
const GAP = 52;
const ROWS = [
	{ev: 'session.start', what: 'Registers its two slash commands, loads saved choices, starts a 15 s poll.', atom: 'palette, hidden'},
	{ev: 'turn.start', what: 'The walker starts walking. A 350 ms animation timer begins.', atom: 'mood'},
	{ev: 'turn.step', what: 'Reads the reasoning effort from each request Claude sends.', atom: 'effort'},
	{ev: 'tool.call', what: 'Counts tool calls, and edits among them.', atom: 'counters'},
	{ev: 'turn.complete', what: 'Adds the turn’s tokens, a spark bar and its duration. The walker hops.', atom: 'total, history'},
	{ev: 'session.compact', what: 'Counts compactions.', atom: 'counters'},
	{ev: 'session.measure', what: 'Refreshes context, cost and rate limits.', atom: 'snap'},
	{ev: 'every 15 s', what: 'Four read-only git commands, plus the subagent count.', atom: 'snap'},
];
const ROW_H = 78;
const TOP = 190;

export const State: React.FC = () => {
	const f = useCurrentFrame();
	const done = ramp(f, T0 + 8 * GAP, T0 + 8 * GAP + 24);
	return (
		<Shell n={8} q="WHAT DOES IT DO WITH THEM?">
			<div style={{position: 'absolute', left: 110, top: TOP - 52, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: C.dim, opacity: ramp(f, 6, 24)}}>EVENT</div>
			<div style={{position: 'absolute', left: 620, top: TOP - 52, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: C.dim, opacity: ramp(f, 6, 24)}}>WHAT THE MOD DOES</div>
			<div style={{position: 'absolute', left: 1500, top: TOP - 52, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: C.dim, opacity: ramp(f, 6, 24)}}>STATE</div>
			{ROWS.map((r, i) => {
				const t = T0 + i * GAP;
				const shown = ramp(f, t, t + 12);
				const active = f >= t && f < t + GAP;
				const pulse = ramp(f, t + 6, t + 30);
				const y = TOP + i * ROW_H;
				const flash = f >= t + 28 && f < t + 44;
				return (
					<React.Fragment key={r.ev}>
						<div style={{position: 'absolute', left: 90, top: y - 6, width: 1740, height: ROW_H - 12, borderRadius: 12, background: active ? '#d977571c' : 'transparent', border: `2px solid ${active ? C.clay : 'transparent'}`}} />
						<Chip text={r.ev} x={110} y={y + ROW_H / 2 - 6} align="left" size={26} opacity={shown} color={active ? C.clay : C.dim} />
						<div style={{position: 'absolute', left: 620, top: y + ROW_H / 2 - 6, translate: '0 -50%', width: 820, fontFamily: SANS, fontWeight: 500, fontSize: 26, lineHeight: 1.2, color: active ? C.text : C.dim, opacity: shown}}>{r.what}</div>
						<Chip text={r.atom} x={1500} y={y + ROW_H / 2 - 6} align="left" size={26} opacity={shown} color={flash ? '#fff' : active ? C.clay : C.dim} fill={flash ? '#d9775744' : C.panel} />
						{active && pulse > 0 && pulse < 1 ? <div style={{position: 'absolute', left: 520 + (1480 - 520) * pulse, top: y + ROW_H / 2 - 6 - 8, width: 16, height: 16, borderRadius: 16, background: C.clay, boxShadow: `0 0 20px ${C.clay}`}} /> : null}
					</React.Fragment>
				);
			})}
			<div style={{position: 'absolute', left: 90, top: TOP + 8 * ROW_H + 24, width: 1740, textAlign: 'center', fontFamily: MONO, fontSize: 30, color: C.clay, opacity: done}}>
				any change to state  {'->'}  ui.render runs again  {'->'}  the strip is repainted
			</div>
			<Cap from={8} to={T0 - 4} size={52}>Events come in. The mod keeps <Em>state</Em>.</Cap>
			<Cap from={T0 + 8 * GAP + 14} to={T0 + 8 * GAP + 66} size={52}>Animation costs nothing while idle.</Cap>
		</Shell>
	);
};
