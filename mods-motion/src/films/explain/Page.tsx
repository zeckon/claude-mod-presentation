import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, dimc, Em, kw, Shell} from '../../kit';
import {C, INOUT, lerp, MONO, ramp, SANS} from '../../theme';
import {ADD, Arrow, BAD, Callout, Lines} from './parts';

const WIN_L = 96;
const WIN_T = 116;
const WIN_W = 1728;
const WIN_H = 706;
const BAR = 56;
const TOC_W = 400;
const VIEW_H = WIN_H - BAR;
const BODY_W = WIN_W - TOC_W - 120;

const T0 = 60;
const STEP = 28;
const BACK = 360; // scroll back up to the diagram
const LIGHT = 404; // diagram walk starts

const td: React.CSSProperties = {padding: '10px 18px', borderBottom: `1px solid ${C.line}`, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.text};
const th: React.CSSProperties = {...td, fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: C.dim, fontWeight: 400};

const Table: React.FC<{rows: string[][]; widths: number[]}> = ({rows, widths}) => (
	<div style={{border: `1px solid ${C.line}`, borderRadius: 10, overflow: 'hidden'}}>
		{rows.map((r, i) => (
			<div key={i} style={{display: 'flex', background: i === 0 ? '#ffffff08' : 'transparent'}}>
				{r.map((c, j) => (
					<div key={j} style={{...(i === 0 ? th : td), width: `${widths[j]}%`, boxSizing: 'border-box', borderBottom: i === rows.length - 1 ? 'none' : td.borderBottom}}>
						{c}
					</div>
				))}
			</div>
		))}
	</div>
);

const FLOW = [
	{n: 'save(user)', d: '{ id: 42 }'},
	{n: 'db.write', d: "name: 'Ada'"},
	{n: 'cache.delete', d: 'key 42'},
	{n: 'next read', d: 'cache miss'},
	{n: 'db.read', d: "'Ada', fresh"},
];

const Flow: React.FC<{f: number}> = ({f}) => {
	const BW = 200;
	const G = (BODY_W - 5 * BW) / 4;
	return (
		<div style={{position: 'relative', height: 160}}>
			{FLOW.map((b, j) => {
				const t = LIGHT + j * 24;
				const lit = f >= t && f < t + 40;
				const seen = f >= t;
				return (
					<React.Fragment key={b.n}>
						{j ? <Arrow x={j * (BW + G) - G + 6} y={40} w={G - 12} color={seen ? C.clay : C.dim} /> : null}
						<div style={{position: 'absolute', left: j * (BW + G), top: 0, width: BW, height: 80, boxSizing: 'border-box', borderRadius: 10, border: `3px solid ${lit ? C.clay : seen ? '#d9775799' : C.line}`, background: lit ? '#d9775726' : C.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 24, color: C.text, boxShadow: lit ? `0 0 30px ${C.clay}55` : undefined}}>
							{b.n}
						</div>
						<div style={{position: 'absolute', left: j * (BW + G), top: 96, width: BW, textAlign: 'center', fontFamily: MONO, fontSize: 24, color: seen ? C.clay : C.dim}}>{b.d}</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};

type Sec = {toc: string; title: string; h: number; body: (f: number) => React.ReactNode};

const SECTIONS: Sec[] = [
	{
		toc: 'Overview',
		title: 'Overview',
		h: 250,
		body: () => <Table widths={[50, 50]} rows={[['BEFORE', 'AFTER'], ['A read after save can be stale', 'The next read loads the record']]} />,
	},
	{
		toc: 'Background',
		title: 'Background',
		h: 220,
		body: () => (
			<>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, border: `2px solid ${C.line}`, borderRadius: 10, padding: '12px 18px', fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.text}}>
					<span style={{fontFamily: MONO, color: C.clay}}>[+]</span> Foundational: what a read-through cache is
				</div>
				<div style={{marginTop: 22}}>
					<Lines widths={[88, 64]} />
				</div>
			</>
		),
	},
	{
		toc: 'Problem',
		title: 'The problem',
		h: 230,
		body: () => <Callout label="EXAMPLE">Suppose Ada renames herself. The write succeeds, but the next read still returns her old name from the cache.</Callout>,
	},
	{
		toc: 'Intuition',
		title: 'Core intuition',
		h: 200,
		body: () => <Callout label="KEY IDEA">A write makes the cached copy stale. Delete it, and the next read reloads.</Callout>,
	},
	{toc: 'Data flow', title: 'Data flow', h: 250, body: (f) => <Flow f={f} />},
	{
		toc: 'Before vs after',
		title: 'Before vs after',
		h: 280,
		body: () => <Table widths={[34, 33, 33]} rows={[['ASPECT', 'BEFORE', 'AFTER'], ['Cache after save', 'old entry stays', 'entry removed'], ['Next read', 'old name', 'new name']]} />,
	},
	{
		toc: 'Code',
		title: 'Code walkthrough',
		h: 290,
		body: () => (
			<div style={{background: '#0e1115', border: `1px solid ${C.line}`, borderRadius: 10, padding: '18px 24px', fontFamily: MONO, fontSize: 28, lineHeight: '44px', color: C.text, whiteSpace: 'pre'}}>
				{kw('async function')} save(user) {'{'}
				{'\n  '}
				{kw('await')} db.write(user)
				{'\n'}
				<span style={{color: ADD}}>{'  cache.delete(user.id)'}</span>
				{'  '}
				{dimc('// new')}
				{'\n}'}
			</div>
		),
	},
	{
		toc: 'Walkthrough',
		title: 'Detailed walkthrough',
		h: 240,
		body: () => (
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: '50px', color: C.text}}>
				{["save({ id: 42, name: 'Ada' }) arrives", 'db.write stores the new name', 'cache.delete(42) drops the old copy'].map((s, i) => (
					<div key={s}>
						<span style={{fontFamily: MONO, color: C.clay}}>{i + 1}. </span>
						{s}
					</div>
				))}
			</div>
		),
	},
	{
		toc: 'Edge cases',
		title: 'Edge cases and trade-offs',
		h: 200,
		body: () => <Callout label="TRADE-OFF">Every save now costs one extra cache miss on the next read.</Callout>,
	},
	{
		toc: 'Testing',
		title: 'Testing',
		h: 200,
		body: () => (
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: '50px', color: C.text}}>
				<div>
					<span style={{fontFamily: MONO, color: ADD}}>covered </span> save.test.ts: a read after save returns the new name
				</div>
				<div>
					<span style={{fontFamily: MONO, color: BAD}}>missing </span> two saves of the same user at once
				</div>
			</div>
		),
	},
	{
		toc: 'Quiz',
		title: 'Check your understanding',
		h: 300,
		body: () => (
			<div>
				<div style={{fontFamily: MONO, fontSize: 24, color: C.dim, letterSpacing: 2}}>QUESTION 1 OF 5</div>
				{['A', 'B', 'C'].map((l, i) => (
					<div key={l} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, border: `2px solid ${C.line}`, borderRadius: 10, padding: '10px 18px'}}>
						<span style={{fontFamily: MONO, fontSize: 26, color: C.clay}}>{l}</span>
						<div style={{flex: 1}}>
							<Lines widths={[[62, 48, 70][i]]} />
						</div>
					</div>
				))}
			</div>
		),
	},
];

const HEAD_H = 190;
const OFFSETS = SECTIONS.reduce<number[]>((a, s, i) => [...a, i === 0 ? HEAD_H : a[i - 1] + SECTIONS[i - 1].h], []);
const TOTAL = OFFSETS[OFFSETS.length - 1] + SECTIONS[SECTIONS.length - 1].h;
const target = (i: number) => (i < 0 ? 0 : Math.min(Math.max(0, OFFSETS[i] - 40), TOTAL - VIEW_H + 40));

export const Page: React.FC = () => {
	const f = useCurrentFrame();
	const n = SECTIONS.length;
	const i = Math.max(-1, Math.min(n - 1, Math.floor((f - T0) / STEP)));
	const e = i < 0 ? 0 : ramp(f, T0 + i * STEP, T0 + i * STEP + 16, INOUT);
	let scroll = lerp(target(i - 1), target(i), e);
	let active = i < 0 ? 0 : e > 0.5 ? i : Math.max(0, i - 1);
	if (f >= BACK) {
		const b = ramp(f, BACK, BACK + 34, INOUT);
		scroll = lerp(target(n - 1), target(4), b);
		active = b > 0.3 ? 4 : n - 1;
	}
	const reveal = (j: number) => (j < 2 ? ramp(f, 20 + j * 10, 40 + j * 10) : ramp(f, T0 + (j - 2) * STEP + 4, T0 + (j - 2) * STEP + 22));
	const flash = f >= BACK && f < BACK + 40;
	return (
		<Shell n={4} q="WHAT DOES IT WRITE?">
			<div style={{position: 'absolute', left: WIN_L, top: WIN_T, width: WIN_W, height: WIN_H, borderRadius: 18, background: '#0e1115', border: `2px solid ${C.line}`, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.6)', opacity: ramp(f, 2, 22), translate: `0 ${(1 - ramp(f, 2, 26)) * 30}px`}}>
				<div style={{height: BAR, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 22}}>
					{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
						<div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.8}} />
					))}
					<span style={{marginLeft: 18, fontFamily: MONO, fontSize: 24, color: C.dim}}>/tmp/2026-08-14-explanation-cache-invalidation.html</span>
				</div>
				<div style={{position: 'absolute', left: 0, top: BAR, width: TOC_W, bottom: 0, borderRight: `1px solid ${C.line}`, padding: '26px 30px', boxSizing: 'border-box'}}>
					<div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: C.dim, marginBottom: 10}}>CONTENTS</div>
					{SECTIONS.map((s, j) => {
						const on = j === active && f >= T0 - 4;
						return (
							<div key={s.toc} style={{fontFamily: SANS, fontWeight: on ? 700 : 500, fontSize: 28, lineHeight: '48px', color: on ? C.clay : C.dim, paddingLeft: 16, borderLeft: `4px solid ${on ? C.clay : 'transparent'}`, background: on && flash && j === 4 ? '#d9775722' : 'transparent', opacity: Math.max(0.35, reveal(j))}}>
								{s.toc}
							</div>
						);
					})}
				</div>
				<div style={{position: 'absolute', left: TOC_W + 60, top: BAR, width: BODY_W, height: VIEW_H, overflow: 'hidden', maskImage: 'linear-gradient(to bottom, transparent 0, black 36px, black calc(100% - 36px), transparent 100%)'}}>
					<div style={{position: 'absolute', left: 0, top: 30 - scroll, width: BODY_W}}>
						<div style={{height: HEAD_H}}>
							<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.text, lineHeight: 1.15}}>Invalidating the user cache on save</div>
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.dim, marginTop: 14}}>save() now drops the cached user after each write, so reads stay fresh.</div>
						</div>
						{SECTIONS.map((s, j) => (
							<div key={s.toc} style={{position: 'absolute', left: 0, top: OFFSETS[j], width: BODY_W, opacity: reveal(j), translate: `0 ${(1 - reveal(j)) * 30}px`}}>
								<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.text, marginBottom: 18}}>{s.title}</div>
								{s.body(f)}
							</div>
						))}
					</div>
				</div>
			</div>

			<Cap from={8} to={84} size={54}>The result: one long page, with a <Em>table of contents</Em>.</Cap>
			<Cap from={88} to={200} size={54}>Background, the problem and the core idea come first.</Cap>
			<Cap from={206} to={354} size={54}>Then the code, the trade-offs, the tests, a quiz.</Cap>
			<Cap from={368} to={460} size={54}>Diagrams are HTML and CSS. Never ASCII art.</Cap>
			<Cap from={466} to={566} size={54}>With example data, so you can follow it through.</Cap>
		</Shell>
	);
};
