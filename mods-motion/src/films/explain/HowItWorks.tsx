import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Chip, CodeCard, dimc, Em, Shell, typed} from '../../kit';
import {Loop, pointOn} from '../../Loop';
import {C, MONO, ramp, SANS} from '../../theme';

const LCX = 470;
const LCY = 480;
const LS = 0.62;
const CARD_X = 1060;
const CARD_Y = 384;

type Pt = {x: number; y: number};
const bez = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
	const u = 1 - t;
	return {
		x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
		y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y,
	};
};

const TREE = ['explain/', '|-- .claude-plugin/plugin.json', '`-- skills/diff/SKILL.md'];
const FACTS = ['Reads your repo; git runs read-only: diff, log, show', 'Never modifies your project’s source', 'Writes one self-contained HTML file, in /tmp'];

export const HowItWorks: React.FC = () => {
	const f = useCurrentFrame();
	const diagram = ramp(f, 0, 20) * (1 - ramp(f, 292, 312));
	const claude = pointOn(LCX, LCY, LS, 0);
	const you = pointOn(LCX, LCY, LS, -90);
	const w = {a: {x: CARD_X, y: CARD_Y + 120}, b: {x: CARD_X - 120, y: CARD_Y + 120}, c: {x: 990, y: claude.y}, d: {x: 860, y: claude.y}};
	const wireO = ramp(f, 140, 160);
	const pt = ramp(f, 166, 192);
	const pulse = pt > 0 && pt < 1 ? bez(w.a, w.b, w.c, w.d, pt) : null;
	const glow = ramp(f, 190, 204) * (1 - ramp(f, 290, 310));
	const end = ramp(f, 432, 460);
	return (
		<Shell n={6} q="HOW DOES IT WORK?">
			<div style={{opacity: diagram}}>
				<Loop f={f} cx={LCX} cy={LCY} s={LS} orbitAt={30} start={0} hooks={[]} />
				<div style={{position: 'absolute', left: claude.x - 70, top: claude.y - 70, width: 140, height: 140, borderRadius: 40, border: `4px solid ${C.clay}`, opacity: glow, boxShadow: `0 0 60px ${C.clay}`}} />
				<Chip text={typed('/explain:diff PR #123', f, 30, 1)} x={you.x} y={196} size={26} opacity={ramp(f, 26, 34)} />

				<div style={{position: 'absolute', left: CARD_X, top: 180, fontFamily: MONO, fontSize: 30, lineHeight: '50px', color: C.text, whiteSpace: 'pre'}}>
					{TREE.map((t, i) => (
						<div key={t} style={{opacity: ramp(f, 60 + i * 10, 76 + i * 10), color: i === 0 ? C.clay : i === 2 && f >= 96 ? C.text : C.dim, fontWeight: i === 0 ? 700 : 400}}>
							{t}
						</div>
					))}
				</div>
				<div style={{position: 'absolute', left: CARD_X, top: CARD_Y, opacity: ramp(f, 100, 124), translate: `0 ${(1 - ramp(f, 100, 128)) * 20}px`}}>
					<CodeCard title="SKILL.md" width={760} size={26} style={{border: `2px solid ${glow > 0.1 ? C.clay : C.line}`}}>
						{dimc('# Explain Diff')}
						{'\n## 1. Investigate Before Explaining'}
						{'\n## 3. Structure of the Explanation'}
						{'\n## 13. Quiz'}
						{'\n## 26. Output File'}
						{'\n'}
						{dimc('... about 930 lines in all')}
					</CodeCard>
				</div>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<path d={`M${w.a.x} ${w.a.y} C${w.b.x} ${w.b.y} ${w.c.x} ${w.c.y} ${w.d.x} ${w.d.y}`} stroke={C.clay} strokeOpacity={0.55 * wireO} strokeWidth={4} fill="none" strokeLinecap="round" />
					{pulse ? <circle cx={pulse.x} cy={pulse.y} r={11} fill={C.clay} /> : null}
				</svg>
			</div>

			<div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.text, lineHeight: 1.9}}>
				{FACTS.map((t, i) => (
					<div key={t} style={{opacity: Math.min(ramp(f, 304 + i * 22, 324 + i * 22), 1 - ramp(f, 416, 430))}}>
						<span style={{color: C.clay}}>{'+ '}</span>
						{t}
					</div>
				))}
			</div>

			{f >= 426 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: end, translate: `0 ${(1 - end) * 20}px`}}>
					<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 140, color: C.clay, lineHeight: 1}}>explain</div>
					<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 58, color: C.text, margin: '30px 0 40px'}}>
						Don’t just read the diff. <Em>Understand</Em> it.
					</div>
					{['/plugin marketplace add zeckon/claude-plugins', '/plugin install explain@zeckon-claude-plugins'].map((line, i) => (
						<div key={line} style={{fontFamily: MONO, fontSize: 34, color: C.text, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 12, padding: '14px 28px', margin: '14px auto', width: 1060, textAlign: 'left', whiteSpace: 'pre'}}>
							<span style={{color: C.clay}}>{'> '}</span>
							{typed(line, f, 452 + i * 44, 1)}
						</div>
					))}
				</div>
			) : null}

			<Cap from={10} to={124} size={54}>You run the command. Claude opens one file.</Cap>
			<Cap from={130} to={214} size={54}>That file is a <Em>skill</Em>: instructions Claude follows.</Cap>
			<Cap from={220} to={296} size={54}>No hooks, no doorways: it works inside the loop.</Cap>
		</Shell>
	);
};
