import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell, typed} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';
import {CT, Tick, Zone} from './parts';

const ROWS = [
	{cmd: 'validate', cli: 'devcontainer read-configuration', a: 30, b: 95},
	{cmd: 'build', cli: 'devcontainer build', a: 95, b: 170},
	{cmd: 'up', cli: 'devcontainer up', a: 170, b: 240},
	{cmd: 'exec -- pnpm test', cli: 'devcontainer exec', a: 240, b: 310},
	{cmd: 'rebuild', cli: 'devcontainer up --remove-existing-container', a: 310, b: 400},
];
const LAYERS = ['javascript-node:1-22', 'common-utils:2', 'git:1', 'github-cli:1'];

const ZX = 980;
const ZY = 330;
const ZW = 820;
const ZH = 450;

export const Lifecycle: React.FC = () => {
	const f = useCurrentFrame();
	const gone = ramp(f, 318, 336) * (1 - ramp(f, 352, 372));
	const built = (i: number) => ramp(f, 104 + i * 14, 116 + i * 14) * (1 - gone * 0.85);
	const running = ramp(f, 182, 198) * (1 - gone);
	const status = f < 104 ? 'no image yet' : f < 182 ? 'image built' : f < 318 ? 'running' : f < 360 ? 'recreating' : 'running';
	const term = ramp(f, 246, 256) * (1 - ramp(f, 316, 326));
	return (
		<Shell n={3} q="HOW DO YOU RUN IT?">
			{ROWS.map((r, i) => {
				const on = f >= r.a && f < r.b;
				const seen = ramp(f, 8 + i * 6, 24 + i * 6);
				return (
					<div key={r.cmd} style={{position: 'absolute', left: 96, top: 214 + i * 112, width: 820, height: 96, boxSizing: 'border-box', padding: '10px 22px', borderRadius: 14, border: `2px solid ${on ? C.clay : 'transparent'}`, background: on ? '#d977571c' : 'transparent', opacity: seen * (on || f < 30 ? 1 : 0.7)}}>
						<div style={{fontFamily: MONO, fontSize: 30, color: C.text, whiteSpace: 'pre'}}>
							<span style={{color: C.clay}}>{'/'}</span>devcontainers:{r.cmd}
						</div>
						<div style={{fontFamily: MONO, fontSize: 24, color: on ? CT : C.dim, marginTop: 6, whiteSpace: 'pre'}}>{'-> '}{r.cli}</div>
					</div>
				);
			})}

			<div style={{position: 'absolute', left: ZX, top: 226, display: 'flex', alignItems: 'center', gap: 16, fontFamily: MONO, fontSize: 28, color: C.text, opacity: ramp(f, 10, 26)}}>
				<span style={{padding: '8px 16px', border: `2px solid ${C.line}`, borderRadius: 10, background: C.panel}}>devcontainer.json</span>
				<span style={{opacity: ramp(f, 46, 56), display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 28, color: C.dim}}>
					<Tick p={ramp(f, 46, 60)} /> parses
				</span>
			</div>

			<Zone x={ZX} y={ZY} w={ZW} h={ZH} label="webapp-dev" opacity={ramp(f, 14, 30) * (0.4 + 0.6 * Math.max(running, built(0) * 0.5))} glow={running > 0.9 && f < 214} draw={1} />
			<div style={{position: 'absolute', left: ZX + 28, top: ZY + 64, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 24, color: running > 0.5 ? '#8bd17c' : C.dim, opacity: ramp(f, 14, 30)}}>
				<span style={{width: 16, height: 16, borderRadius: 8, background: running > 0.5 ? '#8bd17c' : C.line, boxShadow: running > 0.5 ? '0 0 14px #8bd17c' : undefined}} />
				{status}
			</div>

			{LAYERS.map((l, i) => (
				<div key={l} style={{position: 'absolute', left: ZX + 28, top: ZY + ZH - 30 - (i + 1) * 58, width: 360, height: 48, boxSizing: 'border-box', borderRadius: 8, background: i === 0 ? `${CT}38` : `${CT}1f`, border: `2px solid ${CT}`, fontFamily: MONO, fontSize: 24, lineHeight: '44px', paddingLeft: 14, color: C.text, opacity: built(i), translate: `0 ${(1 - ramp(f, 104 + i * 14, 116 + i * 14)) * -30}px`}}>
					{l}
				</div>
			))}

			<div style={{position: 'absolute', left: ZX + 420, top: ZY + 130, width: 370, height: 286, boxSizing: 'border-box', borderRadius: 12, background: '#0e1115', border: `2px solid ${C.line}`, padding: '16px 20px', fontFamily: MONO, fontSize: 26, color: C.text, opacity: term}}>
				<div style={{whiteSpace: 'pre'}}>
					<span style={{color: CT}}>{'$ '}</span>
					{typed('pnpm test', f, 254, 1.5)}
				</div>
				{[0, 1, 2].map((i) => (
					<div key={i} style={{height: 14, width: [260, 200, 230][i], background: C.line, borderRadius: 7, marginTop: 24, opacity: ramp(f, 276 + i * 8, 284 + i * 8)}} />
				))}
			</div>

			<Cap from={10} to={92} size={56}>Then run it, one command per step.</Cap>
			<Cap from={100} to={236} size={56}>Each wraps the official <Em>@devcontainers/cli</Em>.</Cap>
			<Cap from={246} to={308} size={56}><Em>exec</Em> runs a command inside the container.</Cap>
			<Cap from={316} to={412} size={56}>Compose project? Add <Em>--service</Em> to pick one.</Cap>
		</Shell>
	);
};
