import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../../kit';
import {C, keys, MONO, ramp, SANS} from '../../theme';

type Line = {t: string; part: number; head?: boolean};
const LINES: Line[] = [
	{t: 'add a dark mode toggle', part: 0},
	{t: '', part: -1},
	{t: '=== Response ===', part: 1, head: true},
	{t: 'Added a ThemeToggle to the header and saved', part: 1},
	{t: 'the choice in localStorage. ...', part: 1},
	{t: '', part: -1},
	{t: '=== Activity ===', part: 2, head: true},
	{t: 'Files changed: 2', part: 2},
	{t: 'Tool calls: Read x3, Edit x2', part: 2},
	{t: '', part: -1},
	{t: 'Session: 4f1c09d2-8b7e-4a51-9c3d-...', part: 3},
	{t: 'Model: claude-opus-5-5', part: 3},
	{t: 'Tokens-In: 12453', part: 3},
	{t: 'Tokens-Out: 678', part: 3},
	{t: 'Cache-Read: 9800', part: 3},
	{t: 'Duration: 18.4s', part: 3},
	{t: 'Tools: Read x3,Edit x2', part: 3},
	{t: 'Files-Changed: 2', part: 3},
];

const PARTS = [
	{name: 'Subject', what: 'your prompt, first line (up to 120 characters)'},
	{name: 'Response', what: "Claude's reply, cut to about 1 KB"},
	{name: 'Activity', what: 'files changed and tool calls'},
	{name: 'Trailers', what: 'one key per line, so git can query them'},
	{name: 'Tree', what: 'the whole folder as it stood, minus excludes'},
];

const T0 = 30;
const GAP = 58;
const SIZE = 27;
const LH = 42;
const VISIBLE = 12;

export const Commit: React.FC = () => {
	const f = useCurrentFrame();
	const idx = f < T0 ? -1 : Math.min(PARTS.length - 1, Math.floor((f - T0) / GAP));
	const [scroll] = keys(f, [
		[T0 + 3 * GAP - 6, 0],
		[T0 + 3 * GAP + 18, LINES.length - VISIBLE],
	]);
	const tree = idx === 4;
	return (
		<Shell n={4} q="WHAT DOES ONE COMMIT HOLD?">
			<div style={{position: 'absolute', left: 96, top: 170, width: 900, height: 52 + VISIBLE * LH + 32, background: '#0e1115', border: `2px solid ${tree ? C.clay : C.line}`, borderRadius: 16, overflow: 'hidden', fontFamily: MONO, fontVariantLigatures: 'none', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', opacity: ramp(f, 4, 22)}}>
				<div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 22px', borderBottom: `1px solid ${C.line}`, color: C.dim, fontSize: 22, gap: 12}}>
					<span style={{width: 12, height: 12, background: C.clay}} />
					commit 7c41e9a
				</div>
				<div style={{position: 'relative', height: VISIBLE * LH + 32, overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 16 - scroll * LH}}>
						{LINES.map((l, i) => {
							const on = l.part === idx;
							return (
								<div key={i} style={{height: LH, lineHeight: `${LH}px`, padding: '0 24px', fontSize: SIZE, whiteSpace: 'pre', color: on ? C.text : l.head ? C.dim : '#9aa3b2', background: on ? '#d977571f' : 'transparent', fontWeight: l.part === 0 ? 700 : 400, opacity: tree ? 0.45 : 1}}>
									{l.t}
								</div>
							);
						})}
					</div>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: 'linear-gradient(to top, #0e1115, #0e111500)'}} />
				</div>
			</div>

			<div style={{position: 'absolute', left: 1070, top: 190, width: 754}}>
				{PARTS.map((p, i) => {
					const shown = ramp(f, T0 + i * GAP, T0 + i * GAP + 14);
					const on = i === idx;
					return (
						<div key={p.name} style={{marginBottom: 14, padding: '10px 22px', borderRadius: 12, border: `2px solid ${on ? C.clay : 'transparent'}`, background: on ? '#d977571c' : 'transparent', opacity: shown * (on ? 1 : 0.55), translate: `${(1 - shown) * 24}px 0`}}>
							<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: on ? C.clay : C.text}}>{p.name}</div>
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: on ? C.text : C.dim, marginTop: 4}}>{p.what}</div>
						</div>
					);
				})}
			</div>

			<Cap from={8} to={T0 + 2 * GAP - 4} size={54}>Each shadow commit is <Em>one turn</Em>.</Cap>
			<Cap from={T0 + 3 * GAP + 4} to={T0 + 4 * GAP - 4} size={54}>Usage numbers ride along as <Em>git trailers</Em>.</Cap>
			<Cap from={T0 + 4 * GAP + 4} to={354} size={54}>And the snapshot itself, ready to diff.</Cap>
		</Shell>
	);
};
