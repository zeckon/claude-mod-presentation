import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, dimc, Em, kw, Shell, str} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';

const T0 = 50;
const GAP = 55;
const FILES = [
	{path: '.claude-plugin/plugin.json', what: 'Name, version, author and where the types live.'},
	{path: 'hooks/hooks.json', what: 'Tells Claude Code which module to load as hooks.'},
	{path: 'hooks/register.tsx', what: 'The whole mod, about 900 lines: reads session data, animates the walker, paints the strip, serves two slash commands.'},
	{path: 'types/index.d.ts', what: 'Types of the values the mod keeps in session state: Snapshot, Git, Tokens, Counters.'},
];

export const Files: React.FC = () => {
	const f = useCurrentFrame();
	const idx = Math.max(0, Math.min(3, Math.floor((f - T0) / GAP)));
	return (
		<Shell n={7} q="WHAT IS A MOD MADE OF?">
			<div style={{position: 'absolute', left: 130, top: 250, fontFamily: MONO, fontSize: 34, lineHeight: '78px', color: C.text}}>
				<div style={{color: C.clay, fontWeight: 700, opacity: ramp(f, 6, 22)}}>pixelbar/</div>
				{FILES.map((fl, i) => {
					const on = f >= T0 && idx === i;
					return (
						<div key={fl.path} style={{opacity: ramp(f, 14 + i * 8, 30 + i * 8) * (on ? 1 : 0.5), color: on ? C.text : C.dim, background: on ? '#d9775722' : 'transparent', padding: '0 14px', margin: '0 -14px', borderRadius: 8}}>
							{i === FILES.length - 1 ? '`-- ' : '|-- '}
							{fl.path}
						</div>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 1010, top: 250, width: 800}}>
				{[0, 1, 2, 3].map((i) => {
					const on = f >= T0 && idx === i;
					if (!on) return null;
					const t = T0 + i * GAP;
					const o = Math.min(ramp(f, t, t + 10), 1 - (i < 3 ? ramp(f, t + GAP - 8, t + GAP) : 0));
					return (
						<div key={i} style={{position: 'absolute', left: 0, top: 0, width: 800, opacity: o}}>
							{i === 0 ? (
								<CodeCard title="plugin.json" width={800} size={26}>
									{'{ '}
									{str('"name"')}: {str('"pixelbar"')},
									{'\n  '}
									{str('"version"')}: {str('"0.2.0"')},
									{'\n  '}
									{str('"types"')}: {str('"./types/index.d.ts"')} {'}'}
								</CodeCard>
							) : null}
							{i === 1 ? (
								<CodeCard title="hooks.json" width={800} size={30}>
									{'{ '}
									{str('"modules"')}: [{str('"./register.tsx"')}] {'}'}
								</CodeCard>
							) : null}
							{i === 2 ? (
								<CodeCard title="register.tsx" width={800} size={25}>
									{kw('export const')} register: Register = on {'=> {'}
									{'\n  '}
									{dimc("on('session.start', …)")}
									{'\n  '}
									{dimc("on('turn.complete', …)")}
									{'\n  '}
									{dimc("on('command.run', …)")}
									{'\n  '}
									{dimc("on('ui.render', …)")}
									{'\n'}
									{'}'}
								</CodeCard>
							) : null}
							{i === 3 ? (
								<CodeCard title="index.d.ts" width={800} size={25}>
									{kw('export type')} Snapshot = {'{'}
									{'\n  '}dir: string{'\n  '}git: Git | null{'\n  '}model: string{'\n  '}ctxPercent: number | null{'\n  '}costUsd: number | null{'\n  '}…{'\n'}
									{'}'}
								</CodeCard>
							) : null}
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.text, marginTop: 26, lineHeight: 1.35}}>{FILES[i].what}</div>
						</div>
					);
				})}
			</div>
			<Cap from={6} to={46} size={54}>A mod is just a few <Em>files</Em>.</Cap>
			<Cap from={T0 + 2 * GAP + 4} to={T0 + 3 * GAP - 4} size={50}>One of them does the work.</Cap>
		</Shell>
	);
};
