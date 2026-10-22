import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../kit';
import {PALETTES} from '../pixelbar/palettes';
import {Strip, stripLayout, StripState} from '../pixelbar/Strip';
import {C, keys, MONO, ramp, SANS} from '../theme';

const CW = 20;
const TOP = 300;
const GAP = 90;
const START = 56;

type Stop = {id: string; title: string; lines: string[]; sample?: string};
const STOPS: Stop[] = [
	{id: 'walker', title: 'THE WALKER', lines: ['A creature two cells wide, built from', 'quarter-block characters. Its mood shows what Claude is doing.']},
	{id: 'mode', title: 'MODE  /  permission mode', lines: ['Follows shift+tab: DEFAULT, ACCEPT EDITS, PLAN, AUTO...', "It paints over Claude Code's own mode indicator."], sample: 'inferred: settings, hint changes, each prompt'},
	{id: 'model', title: 'MODEL  /  the main model', lines: ['The model /model reports, shortened. A 1M-context', 'variant gets " 1M" added.'], sample: 'claude-opus-5-5  ->  OPUS 5.5'},
	{id: 'effort', title: 'EFFORT  /  how hard it thinks', lines: ['Five rising bars, lit up to the current level:', 'LOW, MEDIUM, HIGH, XHIGH, MAX. AUTO when not known yet.']},
	{id: 'ctx', title: 'CTX  /  context window', lines: ['Six-cell gauge, percent, tokens used / window size.', 'At 80% it turns red, and the walker panics.']},
	{id: '5h', title: '5H  /  usage limit', lines: ['How much of your five-hour rate-limit window is used.', 'Subscriptions only. Red at 90%.']},
	{id: 'session', title: 'SESSION  /  totals', lines: ['Session clock, prompts sent, tokens used, cost so far.', 'The cost is the same figure /cost reports.'], sample: '1h12m   7 prompts   $1.23'},
	{id: 'dir', title: 'DIR  /  working folder', lines: ["Your project goes at the right end of the row.", "The last folder of the working directory, cut at 24 characters."], sample: 'claude-mod-presentation  ->  mods-motion'},
	{id: 'git', title: 'GIT  /  branch and working tree', lines: ['Only inside a git repository. Refreshes every 15 s.', 'A detached HEAD shows the short hash: @1a2b3c4.'], sample: 'main   *2 files changed   ^2 ahead   v1 behind'},
	{id: 'diff', title: 'DIFF  /  lines changed', lines: ['Lines added and removed against the last commit.', 'Hidden when the tree is clean.'], sample: 'git diff --shortstat HEAD  ->  +124 -37'},
];

const MODES = ['DEFAULT', 'ACCEPT EDITS', 'PLAN', 'AUTO'];

export const Anatomy: React.FC = () => {
	const f = useCurrentFrame();
	const p = PALETTES[0];
	const t = (i: number) => START + i * GAP;
	const idx = STOPS.findIndex((_, i) => f >= t(i) && f < t(i) + GAP);

	const base: StripState = {
		palette: p,
		git: 'main *2 ^2 v1',
		diff: '+124 -37',
		h5: 37,
	};
	const at = (id: string) => STOPS.findIndex((s) => s.id === id);
	const ctxStop = at('ctx');
	const effStop = at('effort');
	const modeStop = at('mode');
	const ctx = idx === ctxStop ? 42 + 44 * ramp(f, t(ctxStop) + 20, t(ctxStop) + 56) : 42;
	const effort = idx === effStop ? Math.min(4, Math.floor((f - t(effStop)) / 14) % 5) : 2;
	const modeLabel = idx === modeStop ? MODES[Math.min(3, Math.floor((f - t(modeStop)) / 18))] : 'DEFAULT';
	const panic = ctx >= 80;
	const state: StripState = {...base, ctx, effort, modeLabel, mood: panic ? 'panic' : 'walk', tick: Math.floor(f / (panic ? 3 : 8)), hidden: undefined};

	const layout = stripLayout(state);
	const width = layout.cols * CW;
	const place = (id: string) => {
		if (id === 'walker') return {x: 1, w: 3};
		const q = layout.placed.find((pl) => pl.item.id === id)!;
		return {x: q.x, w: q.item.w};
	};

	// the camera follows the active tile
	const maxPan = width + 192 - 1920;
	const target = (i: number) => {
		const q = place(STOPS[i].id);
		return Math.min(maxPan, Math.max(0, (q.x + q.w / 2) * CW + 96 - 960));
	};
	const rows: number[][] = [[0, 0]];
	STOPS.forEach((_, i) => {
		rows.push([t(i) + 30, target(i)]);
		rows.push([t(i) + GAP, target(i)]);
	});
	const [pan] = keys(f, rows);
	const left = 96 - pan;

	return (
		<Shell n={2} q="WHAT IS ON THE STRIP?">
			<div style={{position: 'absolute', left, top: TOP, opacity: ramp(f, 10, 30)}}>
				<Strip cw={CW} state={state} />
			</div>
			{STOPS.map((s, i) => {
				const o = Math.min(ramp(f, t(i), t(i) + 12), 1 - ramp(f, t(i) + GAP - 10, t(i) + GAP));
				if (o <= 0) return null;
				const q = place(s.id);
				const x = left + q.x * CW - 8;
				const w = q.w * CW + 16;
				const cx = x + w / 2;
				const panelW = 1200;
				const panelLeft = Math.min(1920 - 96 - panelW, Math.max(96, cx - 300));
				const lineX = Math.min(panelLeft + panelW - 40, Math.max(panelLeft + 40, cx));
				return (
					<React.Fragment key={s.id}>
						<div style={{position: 'absolute', left: x, top: TOP - 10, width: w, height: CW * 2 + 20, border: `3px dashed ${C.clay}`, borderRadius: 6, opacity: o}} />
						<div style={{position: 'absolute', left: Math.min(cx, lineX) - 1.5, top: TOP + CW * 2 + 12, width: 3, height: 130, background: C.clay, opacity: o * 0.7}} />
						<div style={{position: 'absolute', left: Math.min(cx, lineX), top: TOP + CW * 2 + 140, width: Math.abs(lineX - cx) + 3, height: 3, background: C.clay, opacity: o * 0.7}} />
						<div style={{position: 'absolute', left: panelLeft, top: TOP + CW * 2 + 150, width: panelW, opacity: o, translate: `0 ${(1 - ramp(f, t(i), t(i) + 16)) * 14}px`}}>
							<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 38, color: C.clay, letterSpacing: 1}}>{s.title}</div>
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 38, color: C.text, marginTop: 14, lineHeight: 1.3}}>
								{s.lines.map((l) => (
									<div key={l}>{l}</div>
								))}
							</div>
							{s.sample ? <div style={{fontFamily: MONO, fontSize: 30, color: C.dim, marginTop: 18}}>{s.sample}</div> : null}
						</div>
					</React.Fragment>
				);
			})}
			<Cap from={8} to={52} size={52}>One row: <Em>Claude</Em> on the left, <Em>your project</Em> on the right.</Cap>
		</Shell>
	);
};
