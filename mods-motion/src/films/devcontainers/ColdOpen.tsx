import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Cap, Chip, Em, Shell} from '../../kit';
import {C, INOUT, lerp, MONO, ramp, SANS} from '../../theme';
import {CT, Zone} from './parts';

const TOOLS = [
	{t: 'node 22', x: 700, y: 300, at: 44},
	{t: 'pnpm', x: 1220, y: 300, at: 56},
	{t: 'git', x: 680, y: 655, at: 68},
	{t: 'github-cli', x: 1210, y: 655, at: 80},
];

export const ColdOpen: React.FC = () => {
	const f = useCurrentFrame();
	const shrink = ramp(f, 244, 290, INOUT);
	const s = lerp(1, 0.6, shrink);
	const dy = lerp(0, 175, shrink);
	const box = ramp(f, 112, 168, INOUT);
	const title = ramp(f, 256, 292);
	return (
		<Shell n={1} q="WHAT IS DEVCONTAINERS?">
			<AbsoluteFill style={{scale: s, translate: `0 ${dy}px`, transformOrigin: '960px 470px'}}>
				<Zone x={560} y={230} w={800} h={490} label="" draw={box} glow={f > 168 && f < 200} />
				<div style={{position: 'absolute', left: 760, top: 372, width: 400, boxSizing: 'border-box', padding: '20px 30px', background: '#0e1115', border: `2px solid ${C.line}`, borderRadius: 16, fontFamily: MONO, fontSize: 30, lineHeight: '46px', color: C.text, whiteSpace: 'pre', opacity: ramp(f, 4, 26), translate: `0 ${(1 - ramp(f, 4, 30)) * 20}px`}}>
					<div style={{color: C.clay, fontWeight: 700}}>webapp/</div>
					<div>{'|-- package.json'}</div>
					<div>{'|-- pnpm-lock.yaml'}</div>
					<div>{'`-- src/'}</div>
				</div>
				{TOOLS.map((t) => (
					<div key={t.t} style={{position: 'absolute', left: 0, top: 0, scale: lerp(0.6, 1, ramp(f, t.at, t.at + 16)), transformOrigin: `${t.x}px ${t.y}px`}}>
						<Chip text={t.t} x={t.x} y={t.y} size={30} color={box > 0.6 ? CT : C.text} opacity={ramp(f, t.at, t.at + 12)} />
					</div>
				))}
				<Chip text=".devcontainer/devcontainer.json" x={960} y={230} size={30} color={C.text} fill={C.bg} opacity={ramp(f, 176, 196)} />
			</AbsoluteFill>

			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: title}}>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 140, color: CT, lineHeight: 1, translate: `0 ${(1 - title) * 30}px`}}>devcontainers</div>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 38, color: C.dim, marginTop: 20}}>write and run dev containers from Claude Code</div>
			</div>

			<Cap from={18} to={108}>A project needs the right <Em>tools</Em> to build and run.</Cap>
			<Cap from={116} to={196}>A <Em color={CT}>dev container</Em> packs them into one box.</Cap>
			<Cap from={200} to={256}>One file describes it, the containers.dev way.</Cap>
			<Cap from={286} to={326}>Meet devcontainers.</Cap>
		</Shell>
	);
};
