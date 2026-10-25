import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../../kit';
import {C, INOUT, keys, MONO, ramp, SANS} from '../../theme';
import {ADD, ADD_BG, BAD, BAD_BG} from './parts';

const OPTIONS = ['So the next read loads the new record', 'To make the write itself faster', 'Because the database requires it', 'To free memory in the cache'];
const RIGHT = 0;
const PICK = 1;
const CLICK = 104;

const CARD_L = 300;
const CARD_T = 130;
const CARD_W = 1320;
const OPT_T = 140; // first option, relative to the card's padding box
const OPT_H = 72;
const OPT_G = 14;

export const Quiz: React.FC = () => {
	const f = useCurrentFrame();
	const card = ramp(f, 2, 22) * (1 - ramp(f, 214, 232));
	const answered = f >= CLICK;
	const fb = ramp(f, CLICK + 6, CLICK + 20);
	const optY = (i: number) => CARD_T + 40 + OPT_T + i * (OPT_H + OPT_G) + OPT_H / 2;
	const [mx, my] = keys(f, [
		[40, 1500, 900],
		[96, CARD_L + 760, optY(PICK)],
	]);
	const press = f >= CLICK - 4 && f < CLICK + 4 ? 0.85 : 1;
	const score = ramp(f, 230, 254);
	return (
		<Shell n={5} q="DID YOU UNDERSTAND IT?">
			<div style={{position: 'absolute', left: CARD_L, top: CARD_T, width: CARD_W, boxSizing: 'border-box', padding: '40px 56px', borderRadius: 18, background: C.panel, border: `2px solid ${C.line}`, opacity: card, translate: `0 ${(1 - ramp(f, 2, 26)) * 30}px`}}>
				<div style={{display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: C.dim}}>
					<span>QUESTION 3 OF 5</span>
					<span>DATA FLOW</span>
				</div>
				<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.text, marginTop: 18, lineHeight: 1.2}}>Why does save() now delete the cached entry?</div>
				<div style={{height: 40}} />
				{OPTIONS.map((o, i) => {
					const good = answered && i === RIGHT;
					const bad = answered && i === PICK;
					const col = good ? ADD : bad ? BAD : C.line;
					return (
						<div key={o} style={{display: 'flex', alignItems: 'center', gap: 22, height: OPT_H, boxSizing: 'border-box', marginTop: i ? OPT_G : 0, padding: '0 24px', borderRadius: 12, border: `3px solid ${col}`, background: good ? ADD_BG : bad ? BAD_BG : 'transparent', fontFamily: SANS, fontWeight: 500, fontSize: 32, color: answered && !good && !bad ? C.dim : C.text}}>
							<span style={{width: 44, height: 44, borderRadius: 22, border: `2px solid ${good || bad ? col : C.dim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 24, color: good || bad ? col : C.dim}}>{'ABCD'[i]}</span>
							<span style={{flex: 1}}>{o}</span>
							{good ? <span style={{fontFamily: MONO, fontSize: 24, color: ADD}}>correct</span> : null}
							{bad ? <span style={{fontFamily: MONO, fontSize: 24, color: BAD}}>your answer</span> : null}
						</div>
					);
				})}
				<div style={{marginTop: 24, height: 84, opacity: fb, fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: C.text}}>
					<span style={{color: BAD, fontWeight: 700}}>Not quite. </span>
					The write costs the same. Deleting the entry forces the next read to load the record Ada just saved.
				</div>
			</div>

			{f < 214 ? (
				<svg width={44} height={56} viewBox="0 0 44 56" style={{position: 'absolute', left: mx, top: my, scale: press, opacity: ramp(f, 40, 56) * (1 - ramp(f, 150, 170))}}>
					<path d="M3 3 L3 44 L14 34 L22 52 L30 48 L22 31 L38 31 Z" fill={C.text} stroke={C.bg} strokeWidth={3} strokeLinejoin="round" />
				</svg>
			) : null}

			{f >= 226 ? (
				<div style={{position: 'absolute', left: 960, top: 450, translate: '-50% -50%', width: 1100, textAlign: 'center', opacity: score, scale: 0.94 + 0.06 * ramp(f, 230, 260, INOUT)}}>
					<div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: C.dim}}>YOUR SCORE</div>
					<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 150, color: C.clay, lineHeight: 1.1}}>4/5</div>
					<div style={{display: 'flex', justifyContent: 'center', gap: 18, margin: '14px 0 30px'}}>
						{[0, 1, 2, 3, 4].map((i) => (
							<div key={i} style={{width: 52, height: 52, borderRadius: 26, border: `4px solid ${i === 2 ? BAD : ADD}`, background: i === 2 ? BAD_BG : ADD_BG, opacity: ramp(f, 240 + i * 6, 252 + i * 6)}} />
						))}
					</div>
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 32, color: C.dim}}>4 correct, 1 incorrect</div>
					<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.text, marginTop: 14}}>You understand the main idea; review the detailed walkthrough.</div>
				</div>
			) : null}

			<Cap from={8} to={98} size={54}>The page ends with five questions about the change.</Cap>
			<Cap from={112} to={210} size={54}>Every answer explains why it is right or wrong.</Cap>
			<Cap from={240} to={326} size={54}>The score tells you what to <Em>reread</Em>.</Cap>
		</Shell>
	);
};
