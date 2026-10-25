import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, dimc, Em, Shell, typed} from '../../kit';
import {C, INOUT, lerp, MONO, ramp, SANS} from '../../theme';

const NOLIG: React.CSSProperties = {fontVariantLigatures: 'none'};

const TURNS = [
	{ref: 'HEAD', sha: '9e2d4b1', s: 'fix the flicker on load'},
	{ref: 'HEAD~1', sha: '5a07c3e', s: 'remember the chosen theme'},
	{ref: 'HEAD~2', sha: '7c41e9a', s: 'add a dark mode toggle'},
	{ref: 'HEAD~3', sha: 'b3f8a20', s: 'refactor the theme tokens'},
	{ref: 'HEAD~4', sha: '1d9e6c7', s: 'set up the settings page'},
];

const LX = 96;
const LW = 820;
const TOP = 200;
const ROW = 96;
const rowY = (i: number) => TOP + (i + 1) * ROW; // row 0 is the live workspace

const add = (t: string) => <span style={{color: '#a5d6a7'}}>{t}</span>;
const del = (t: string) => <span style={{color: '#ef9a9a'}}>{t}</span>;

type Cmd = {at: number; cmd: string; hi: number[]; ws?: boolean; out: React.ReactNode};
const CMDS: Cmd[] = [
	{
		at: 16,
		cmd: '/history:log 5',
		hi: [4, 3, 2, 1, 0],
		out: (
			<>
				{TURNS.slice()
					.reverse()
					.map((t) => (
						<React.Fragment key={t.sha}>
							<span style={{color: C.clay}}>{t.sha}</span>
							{'  ' + t.s + '\n'}
						</React.Fragment>
					))}
			</>
		),
	},
	{
		at: 110,
		cmd: '/history:show HEAD~2',
		hi: [2],
		out: (
			<>
				{dimc('commit 7c41e9a')}
				{'\n    add a dark mode toggle\n\n'}
				{' src/Header.tsx      |  4 '}
				{add('++')}
				{'\n src/ThemeToggle.tsx | 31 '}
				{add('+++++')}
				{'\n 2 files changed, 35 insertions(+)'}
			</>
		),
	},
	{
		at: 200,
		cmd: '/history:diff 3',
		hi: [3],
		ws: true,
		out: (
			<>
				{dimc('diff --git a/src/theme.ts b/src/theme.ts')}
				{'\n'}
				{del("-export const mode = 'light'")}
				{'\n'}
				{add('+export const mode = loadMode()')}
				{'\n'}
				{dimc('diff --git a/src/Header.tsx b/src/Header.tsx')}
				{'\n'}
				{add('+  <ThemeToggle />')}
			</>
		),
	},
	{
		at: 290,
		cmd: '/history:transcript 7c41e9a',
		hi: [2],
		out: (
			<>
				{dimc('=== Events in this turn ===')}
				{'\n'}
				{dimc('[2026-10-25T14:02:11Z] ')}user{'\n'}add a dark mode toggle{'\n'}
				{dimc('[2026-10-25T14:02:15Z] ')}assistant{'\n'}
				{'  -> Read({"file_path": "src/Header.tsx"})\n'}
				{'  <- import React from ...'}
			</>
		),
	},
	{
		at: 384,
		cmd: '/history:restore HEAD~2 src/Header.tsx',
		hi: [2],
		ws: true,
		out: (
			<>
				{'---\nrestored src/Header.tsx from HEAD~2'}
			</>
		),
	},
];

export const Rewind: React.FC = () => {
	const f = useCurrentFrame();
	let ci = 0;
	CMDS.forEach((c, i) => {
		if (f >= c.at) ci = i;
	});
	const c = CMDS[ci];
	const next = CMDS[ci + 1]?.at ?? 512;
	const cardO = Math.min(ramp(f, c.at, c.at + 10), 1 - ramp(f, next - 8, next));
	const outO = ramp(f, c.at + c.cmd.length + 6, c.at + c.cmd.length + 16);
	const isLog = ci === 0;
	const logRow = (i: number) => ramp(f, 16 + 22 + (4 - i) * 8, 16 + 32 + (4 - i) * 8);

	// restore: a file chip flies from HEAD~2 up to the workspace row
	const fly = ramp(f, 430, 466, INOUT);
	const landed = f >= 466;
	const chipY = lerp(rowY(2), TOP, fly);

	return (
		<Shell n={5} q="HOW DO YOU GO BACK?">
			<div style={{position: 'absolute', left: LX, top: TOP - 96, fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: C.dim, opacity: ramp(f, 4, 20)}}>SHADOW TIMELINE, NEWEST FIRST</div>
			{/* the spine */}
			<div style={{position: 'absolute', left: LX + 150, top: TOP, width: 4, height: 5 * ROW, background: C.line, opacity: ramp(f, 4, 30)}} />

			{/* live workspace row */}
			<div style={{position: 'absolute', left: LX, top: TOP - ROW / 2 + 8, width: LW, height: ROW - 16, borderRadius: 12, border: `2px dashed ${c.ws ? C.clay : C.line}`, boxSizing: 'border-box', opacity: ramp(f, 6, 24), background: landed ? '#d977571c' : 'transparent'}} />
			<div style={{position: 'absolute', left: LX + 24, top: TOP, translate: '0 -50%', fontFamily: MONO, fontSize: 24, color: C.dim, opacity: ramp(f, 6, 24)}}>now</div>
			<div style={{position: 'absolute', left: LX + 136, top: TOP - 16, width: 32, height: 32, borderRadius: 8, border: `3px solid ${C.text}`, background: C.bg, boxSizing: 'border-box', opacity: ramp(f, 6, 24)}} />
			<div style={{position: 'absolute', left: LX + 200, top: TOP, translate: '0 -50%', fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.text, opacity: ramp(f, 6, 24)}}>your folder</div>

			{TURNS.map((t, i) => {
				const y = rowY(i);
				const on = !isLog ? c.hi.includes(i) && f >= c.at + 6 : f >= c.at + 6 && logRow(i) > 0.5;
				const shown = ramp(f, 10 + i * 6, 26 + i * 6);
				return (
					<React.Fragment key={t.sha}>
						<div style={{position: 'absolute', left: LX, top: y - ROW / 2 + 8, width: LW, height: ROW - 16, borderRadius: 12, background: on ? '#d977571c' : 'transparent', border: `2px solid ${on ? C.clay : 'transparent'}`, boxSizing: 'border-box'}} />
						<div style={{position: 'absolute', left: LX + 24, top: y, translate: '0 -50%', fontFamily: MONO, fontSize: 24, color: on ? C.clay : C.dim, opacity: shown}}>{t.ref}</div>
						<div style={{position: 'absolute', left: LX + 136, top: y - 16, width: 32, height: 32, borderRadius: 32, background: C.clay, opacity: shown, boxShadow: on ? `0 0 24px ${C.clay}` : undefined}} />
						<div style={{position: 'absolute', left: LX + 200, top: y, translate: '0 -50%', fontFamily: SANS, fontWeight: 500, fontSize: 30, color: on ? C.text : C.dim, opacity: shown, whiteSpace: 'nowrap'}}>
							<span style={{fontFamily: MONO, fontSize: 26, color: on ? C.clay : C.dim, marginRight: 20}}>{t.sha}</span>
							{t.s}
						</div>
					</React.Fragment>
				);
			})}

			{/* diff 3: a bracket from HEAD~3 up to now */}
			<div style={{position: 'absolute', left: LX + LW + 14, top: TOP, width: 22, height: rowY(3) - TOP, borderTop: `3px solid ${C.clay}`, borderRight: `3px solid ${C.clay}`, borderBottom: `3px solid ${C.clay}`, borderRadius: '0 10px 10px 0', boxSizing: 'border-box', opacity: ci === 2 ? outO * cardO : 0}} />

			{f >= 430 && ci === 4 ? (
				<div style={{position: 'absolute', left: LX + LW - 40, top: chipY, translate: '-100% -50%', fontFamily: MONO, fontSize: 24, color: C.clay, background: C.panel, border: `2px solid ${C.clay}`, borderRadius: 10, padding: '6px 14px', whiteSpace: 'nowrap'}}>
					src/Header.tsx
				</div>
			) : null}

			<div style={{position: 'absolute', left: 990, top: 150, opacity: cardO}}>
				<CodeCard style={NOLIG} title="~/workspace/myproject  claude" width={834} size={24}>
					<span style={{color: C.clay}}>{'> '}</span>
					{typed(c.cmd, f, c.at + 4, 1)}
					{'\n\n'}
					<span style={{opacity: outO}}>{c.out}</span>
				</CodeCard>
				{ci === 4 ? (
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 22, width: 834, lineHeight: 1.35, opacity: ramp(f, 440, 456)}}>
						Changes your files, so it runs only when you invoke it. The next turn records the result as a new commit.
					</div>
				) : null}
			</div>

			<Cap from={20} to={104} size={54}><Em>log</Em>: one line per turn.</Cap>
			<Cap from={114} to={194} size={54}><Em>show</Em>: what one turn did.</Cap>
			<Cap from={204} to={284} size={54}><Em>diff</Em>: everything since N turns ago.</Cap>
			<Cap from={294} to={378} size={54}><Em>transcript</Em>: the whole turn, every tool call.</Cap>
			<Cap from={388} to={504} size={54}><Em>restore</Em>: bring back one file.</Cap>
		</Shell>
	);
};
