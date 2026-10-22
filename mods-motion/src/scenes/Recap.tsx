import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../kit';
import {Loop, hit, pointOn} from '../Loop';
import {hex, PALETTES} from '../pixelbar/palettes';
import {Strip} from '../pixelbar/Strip';
import {STRIP_H, STRIP_W, STRIP_X, STRIP_Y, TERM_H, TERM_W, Terminal} from '../Terminal';
import {C, MONO, PIXEL, ramp, SANS} from '../theme';
import {typed} from '../kit';

type Pt = {x: number; y: number};
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
	const u = 1 - t;
	return {
		x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
		y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
	};
};

export const Recap: React.FC = () => {
	const f = useCurrentFrame();
	const p = PALETTES[0];
	const diagram = ramp(f, 0, 24) * (1 - 0.85 * ramp(f, 330, 350));
	const LCX = 330;
	const LCY = 470;
	const LS = 0.5;
	const angle = 30;
	const h = hit(f, 40, angle);
	const start = pointOn(LCX, LCY, LS, angle);
	const cardL = 640;
	const cardR = 1160;
	const w1 = {a: start, b: {x: start.x + 120, y: start.y}, c: {x: cardL - 120, y: 470}, d: {x: cardL, y: 470}};
	const TS = 0.44;
	const TX = 1516;
	const TY = 470;
	const stripPt = {x: TX + TS * (STRIP_X + 300 - TERM_W / 2), y: TY + TS * (STRIP_Y + STRIP_H / 2 - TERM_H / 2)};
	const w2 = {a: {x: cardR, y: 470}, b: {x: cardR + 100, y: 470}, c: {x: stripPt.x - 80, y: stripPt.y}, d: stripPt};
	const wireO = ramp(f, 30, 60);
	const pulse1 = h.since < 20 ? bez(w1.a, w1.b, w1.c, w1.d, h.since / 20) : null;
	const s2 = h.since - 22;
	const pulse2 = s2 >= 0 && s2 < 22 ? bez(w2.a, w2.b, w2.c, w2.d, s2 / 22) : null;
	const arrived = h.since >= 44 && h.since < 60;
	const wire = (w: typeof w1) => `M${w.a.x} ${w.a.y} C${w.b.x} ${w.b.y} ${w.c.x} ${w.c.y} ${w.d.x} ${w.d.y}`;

	const facts = ['Four read-only git commands, run in your project', 'Nothing leaves your machine', 'Only your palette and hidden sections are saved'];
	const end = ramp(f, 450, 480);

	return (
		<Shell n={10} q="HOW DOES IT ALL FIT?">
			<div style={{opacity: diagram}}>
				<Loop f={f} cx={LCX} cy={LCY} s={LS} orbitAt={40} start={4} hooks={[{name: 'turn.start', angle, at: 30}]} labels={0} hookLabels={0} />
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					{[w1, w2].map((w, i) => (
						<path key={i} d={wire(w)} stroke={C.clay} strokeOpacity={0.55 * wireO} strokeWidth={4} fill="none" strokeLinecap="round" />
					))}
					{pulse1 ? <circle cx={pulse1.x} cy={pulse1.y} r={11} fill={C.clay} /> : null}
					{pulse2 ? <circle cx={pulse2.x} cy={pulse2.y} r={11} fill={hex(p.accent)} /> : null}
				</svg>
				<div style={{position: 'absolute', left: cardL, top: 350, width: cardR - cardL, height: 240, borderRadius: 16, border: `2px solid ${arrived ? C.clay : C.line}`, background: '#0e1115', fontFamily: MONO, fontSize: 25, lineHeight: '42px', padding: '16px 24px', color: C.text, whiteSpace: 'pre', opacity: ramp(f, 14, 40)}}>
					<div style={{color: C.dim}}>register.tsx</div>
					<div>on('turn.start', …)</div>
					<div style={{color: C.dim}}>state.mood = 'walk'</div>
					<div>on('ui.render', …)</div>
				</div>
				<div style={{position: 'absolute', left: 0, top: 0, width: TERM_W, height: TERM_H, translate: `${TX - TERM_W / 2}px ${TY - TERM_H / 2}px`, scale: TS, opacity: ramp(f, 20, 46)}}>
					<Terminal body={0.5} hintOpacity={0} cursorOn wipe={1}>
						<Strip cw={STRIP_W / 140} state={{palette: p, cols: 140, mood: arrived ? 'happy' : 'walk', tick: Math.floor(f / 8)}} />
					</Terminal>
				</div>
				{[
					{x: LCX, t: 'Claude Code', s: 'announces events'},
					{x: (cardL + cardR) / 2, t: 'the mod', s: 'listens, keeps state'},
					{x: TX, t: 'your terminal', s: 'shows the strip'},
				].map((l, i) => (
					<div key={l.t} style={{position: 'absolute', left: l.x, top: 660, translate: '-50% 0', textAlign: 'center', opacity: ramp(f, 60 + i * 14, 80 + i * 14)}}>
						<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.clay}}>{l.t}</div>
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim}}>{l.s}</div>
					</div>
				))}
			</div>

			<div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.text, lineHeight: 1.9}}>
				{facts.map((t, i) => (
					<div key={t} style={{opacity: Math.min(ramp(f, 356 + i * 22, 376 + i * 22), 1 - ramp(f, 436, 450))}}>
						<span style={{color: C.clay}}>{'+ '}</span>
						{t}
					</div>
				))}
			</div>

			{f >= 440 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: end, translate: `0 ${(1 - end) * 20}px`}}>
					<div style={{fontFamily: PIXEL, fontWeight: 700, fontSize: 160, color: hex(p.accent), lineHeight: 1}}>pixelbar</div>
					<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 58, color: C.text, margin: '26px 0 40px'}}>
						Make Claude Code <Em>yours</Em>.
					</div>
					{['/plugin marketplace add zeckon/claude-plugins', '/plugin install pixelbar@zeckon-claude-plugins'].map((line, i) => (
						<div key={line} style={{fontFamily: MONO, fontSize: 34, color: C.text, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 12, padding: '14px 28px', margin: '14px auto', width: 1060, textAlign: 'left', whiteSpace: 'pre'}}>
							<span style={{color: C.clay}}>{'> '}</span>
							{typed(line, f, 490 + i * 50, 1)}
						</div>
					))}
				</div>
			) : null}

			<Cap from={24} to={170} size={54}>Claude Code announces what it is doing.</Cap>
			<Cap from={180} to={326} size={54}>The mod listens, keeps state, and <Em>paints</Em>.</Cap>
		</Shell>
	);
};
