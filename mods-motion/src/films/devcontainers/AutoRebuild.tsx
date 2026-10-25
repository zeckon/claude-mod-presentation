import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Chip, CodeCard, dimc, Em, Shell, str} from '../../kit';
import {Hook, Loop} from '../../Loop';
import {C, MONO, ramp, SANS} from '../../theme';
import {Arrow, CT, Tick, Zone} from './parts';

const HOOKS: Hook[] = [{name: 'PostToolUse', angle: 145, at: 100}];
const SWAP = 300;
const WATCHED = [
	{p: '.devcontainer/devcontainer.json', on: true},
	{p: '.devcontainer.json', on: true},
	{p: '.devcontainer/  (Dockerfile, compose, ...)', on: true},
	{p: 'compose files in dockerComposeFile', on: true},
	{p: 'src/app.ts', on: false},
];

export const AutoRebuild: React.FC = () => {
	const f = useCurrentFrame();
	const a = ramp(f, 24, 40) * (1 - ramp(f, SWAP - 14, SWAP));
	const b = ramp(f, SWAP, SWAP + 16);
	const prog = ramp(f, 206, 282, (t) => t);
	const stale = ramp(f, 60, 74) * (1 - ramp(f, 200, 210));
	return (
		<Shell n={5} q="WHAT IF THE CONFIG CHANGES?">
			<Loop f={f} cx={540} cy={480} s={0.72} hooks={HOOKS} orbitAt={40} start={4} labels={ramp(f, 20, 50)} />

			<div style={{position: 'absolute', inset: 0, opacity: a}}>
				<div style={{position: 'absolute', left: 1000, top: 196, translate: `0 ${(1 - ramp(f, 24, 44)) * 20}px`}}>
					<CodeCard title="Edit  .devcontainer/devcontainer.json" width={824} size={26}>
						<span style={{color: '#8bd17c'}}>{'+ '}</span>
						{str('"ghcr.io/devcontainers/features/python:1"')}: {'{}'}
					</CodeCard>
				</div>
				<Arrow x1={1412} y1={336} x2={1412} y2={378} p={ramp(f, 120, 132)} />
				<Chip text="hook-autorebuild.sh" x={1412} y={410} size={28} opacity={ramp(f, 130, 146)} />
				<div style={{position: 'absolute', left: 1412, top: 470, translate: '-50% 0', display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.text, opacity: ramp(f, 158, 172), whiteSpace: 'nowrap'}}>
					is it a watched config file? <Tick p={ramp(f, 166, 180)} /> yes
				</div>
				<Zone x={1000} y={540} w={824} h={230} label="webapp-dev" glow={f > 284 && f < 296} opacity={ramp(f, 30, 46) * (f < 206 ? 1 : 0.55 + 0.45 * ramp(f, 276, 290))}>
					<div style={{position: 'absolute', left: 28, top: 70, fontFamily: MONO, fontSize: 26, color: stale > 0 ? C.clay : C.dim, opacity: f < 200 ? stale : 1}}>
						{f < 200 ? 'running the old config' : f < 284 ? dimc('devcontainers: rebuilding ...') : <span style={{color: '#8bd17c'}}>devcontainers: rebuild complete.</span>}
					</div>
					<div style={{position: 'absolute', left: 28, top: 140, width: 768, height: 22, borderRadius: 11, background: C.line, opacity: ramp(f, 200, 210)}}>
						<div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 11, background: CT}} />
					</div>
					<div style={{position: 'absolute', left: 28, top: 176, fontFamily: MONO, fontSize: 24, color: C.dim, opacity: ramp(f, 210, 222)}}>
						devcontainer up --remove-existing-container
					</div>
				</Zone>
			</div>

			<div style={{position: 'absolute', left: 1000, top: 210, width: 824, opacity: b, translate: `0 ${(1 - b) * 20}px`}}>
				<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.text, marginBottom: 22}}>Edits that trigger a rebuild</div>
				{WATCHED.map((w, i) => (
					<div key={w.p} style={{display: 'flex', alignItems: 'center', gap: 14, height: 70, fontFamily: MONO, fontSize: 27, color: w.on ? C.text : C.dim, opacity: ramp(f, SWAP + 10 + i * 12, SWAP + 22 + i * 12), whiteSpace: 'pre'}}>
						{w.on ? <Tick size={34} p={ramp(f, SWAP + 10 + i * 12, SWAP + 24 + i * 12)} /> : <span style={{width: 34, textAlign: 'center', fontWeight: 700}}>x</span>}
						{w.p}
						{w.on ? null : <span style={{fontFamily: SANS, fontSize: 26, marginLeft: 8}}>ignored</span>}
					</div>
				))}
			</div>

			<Cap from={14} to={112} size={56}>Claude edits the config. The container is now <Em>stale</Em>.</Cap>
			<Cap from={118} to={200} size={56}>A <Em>PostToolUse</Em> hook checks which file changed.</Cap>
			<Cap from={206} to={296} size={56}>A config file? It rebuilds the container on the spot.</Cap>
			<Cap from={306} to={414} size={56}>Claude waits for it: often 30 s to 5 min.</Cap>
		</Shell>
	);
};
