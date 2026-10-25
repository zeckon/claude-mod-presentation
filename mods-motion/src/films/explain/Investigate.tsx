import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';

const CX = 960;
const CY = 470;
const NODES = [
	{k: 'MODIFIED FILES', v: 'users/save.ts', x: 440, y: 290, at: 40},
	{k: 'CALLERS', v: 'api/profile.ts', x: 1480, y: 290, at: 70},
	{k: 'DEPENDENCIES', v: 'cache.ts, db.ts', x: 1480, y: 650, at: 100},
	{k: 'TESTS', v: 'save.test.ts', x: 960, y: 715, at: 130},
	{k: 'GIT HISTORY', v: 'git log', x: 440, y: 650, at: 160},
];

// The rest of the repository: files it does not need to open.
const REPO = Array.from({length: 84}).map((_, i) => {
	const r = (n: number) => {
		const s = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
		return s - Math.floor(s);
	};
	return {x: 120 + r(1) * 1660, y: 150 + r(2) * 640, o: 0.1 + r(3) * 0.12};
});

const COLS = [
	{h: 'Demonstrated', s: 'the code shows it', color: '#7ee787', card: 'save() deletes the cache entry after the write', src: 'users/save.ts', at: 350},
	{h: 'Inferred', s: 'reasonable, from evidence', color: C.clay, card: 'It fixes stale reads after a profile edit', src: 'commit message', at: 396},
	{h: 'Uncertain', s: 'and the page says so', color: '#9aa4b2', card: 'Whether other writers need the same fix', src: 'no evidence', at: 442},
];
const COL_W = 500;
const COL_GAP = 60;
const COL_L = (1920 - (3 * COL_W + 2 * COL_GAP)) / 2;

export const Investigate: React.FC = () => {
	const f = useCurrentFrame();
	const graph = ramp(f, 0, 20) * (1 - ramp(f, 300, 322));
	const sort = ramp(f, 318, 340);
	return (
		<Shell n={3} q="WHAT DOES IT READ FIRST?">
			<div style={{opacity: graph}}>
				{REPO.map((d, i) => (
					<div key={i} style={{position: 'absolute', left: d.x, top: d.y, width: 22, height: 28, borderRadius: 4, border: `2px solid ${C.dim}`, opacity: d.o * ramp(f, 4, 30)}} />
				))}
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					{NODES.map((n) => {
						const t = ramp(f, n.at - 12, n.at + 6);
						return <line key={n.k} x1={CX} y1={CY} x2={CX + (n.x - CX) * t} y2={CY + (n.y - CY) * t} stroke={C.clay} strokeOpacity={0.6} strokeWidth={4} strokeLinecap="round" />;
					})}
				</svg>
				{NODES.map((n) => {
					const o = ramp(f, n.at, n.at + 14);
					const lit = f >= n.at && f < n.at + 30;
					return (
						<div key={n.k} style={{position: 'absolute', left: n.x, top: n.y, translate: '-50% -50%', width: 360, padding: '16px 0', textAlign: 'center', background: C.panel, border: `3px solid ${lit ? C.clay : C.line}`, borderRadius: 14, opacity: o, scale: 0.9 + 0.1 * o, boxShadow: lit ? `0 0 40px ${C.clay}55` : undefined}}>
							<div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: C.dim}}>{n.k}</div>
							<div style={{fontFamily: MONO, fontSize: 30, color: C.text, marginTop: 6}}>{n.v}</div>
						</div>
					);
				})}
				<div style={{position: 'absolute', left: CX, top: CY, translate: '-50% -50%', width: 300, padding: '22px 0', textAlign: 'center', background: '#1a1310', border: `3px solid ${C.clay}`, borderRadius: 14, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.clay}}>the diff</div>
			</div>

			<div style={{opacity: sort}}>
				{COLS.map((c, i) => {
					const x = COL_L + i * (COL_W + COL_GAP);
					const o = ramp(f, c.at, c.at + 16);
					return (
						<React.Fragment key={c.h}>
							<div style={{position: 'absolute', left: x, top: 220, width: COL_W, height: 440, boxSizing: 'border-box', borderRadius: 18, border: `2px dashed ${C.line}`}} />
							<div style={{position: 'absolute', left: x + 34, top: 252, fontFamily: SANS, fontWeight: 700, fontSize: 42, color: c.color}}>{c.h}</div>
							<div style={{position: 'absolute', left: x + 34, top: 310, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim}}>{c.s}</div>
							<div style={{position: 'absolute', left: x + 20, top: 410, width: COL_W - 40, boxSizing: 'border-box', padding: '24px 26px', borderRadius: 14, background: C.panel, borderLeft: `6px solid ${c.color}`, opacity: o, translate: `0 ${(1 - o) * -60}px`}}>
								<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: C.text}}>{c.card}</div>
								<div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 16}}>source: {c.src}</div>
							</div>
						</React.Fragment>
					);
				})}
			</div>

			<Cap from={8} to={100}>It never explains a diff in isolation.</Cap>
			<Cap from={106} to={214} size={54}>First it reads around it: <Em>callers</Em>, dependencies, tests, history.</Cap>
			<Cap from={220} to={312} size={54}>Only the paths that matter, not the whole repo.</Cap>
			<Cap from={330} to={430}>Then it sorts what it found.</Cap>
			<Cap from={436} to={536} size={54}>No invented motives. If it is unclear, it <Em>says so</Em>.</Cap>
		</Shell>
	);
};
