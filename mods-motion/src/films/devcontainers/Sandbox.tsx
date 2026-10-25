import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Chip, CodeCard, Em, Shell, str} from '../../kit';
import {Hook, Loop, pointOn} from '../../Loop';
import {C, INOUT, lerp, MONO, ramp, SANS} from '../../theme';
import {Arrow, CT, Tag, Zone} from './parts';

const LCX = 500;
const LCY = 480;
const LS = 0.72;
const HOOKS: Hook[] = [{name: 'PreToolUse', angle: 35, at: 96}];

const B0 = 384;
const GAP = 24;
const CMDS = [
	{c: 'git status', host: true},
	{c: 'pnpm test', host: false},
	{c: 'ls src', host: true},
	{c: 'npx vitest', host: false},
	{c: 'cd /tmp && make', host: true},
	{c: 'node scripts/seed.js', host: false},
];
const ALLOW = 'git  gh  docker  docker-compose  devcontainer  claude  code  cd  pwd  echo  mkdir  ls  cat  which  command';

export const Sandbox: React.FC = () => {
	const f = useCurrentFrame();
	const a = ramp(f, 0, 20) * (1 - ramp(f, 350, 370));
	const b = ramp(f, 372, 390);
	const door = pointOn(LCX, LCY, LS, 35, 62);
	const wire = ramp(f, 132, 160);
	return (
		<Shell n={4} q="WHERE DO CLAUDE'S COMMANDS RUN?">
			<div style={{position: 'absolute', inset: 0, opacity: a}}>
				<Loop f={f} cx={LCX} cy={LCY} s={LS} hooks={HOOKS} orbitAt={40} start={4} labels={ramp(f, 20, 50)} />
				<div style={{position: 'absolute', left: 1000, top: 196, opacity: ramp(f, 30, 46), translate: `0 ${(1 - ramp(f, 30, 50)) * 20}px`}}>
					<CodeCard title="Bash tool call from Claude" width={824} size={28}>
						{'{ '}
						{str('"command"')}: {str('"pnpm test"')}
						{' }'}
					</CodeCard>
				</div>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<path d={`M${door.x + 205} ${door.y} C${door.x + 260} ${door.y} 940 430 1262 430`} stroke={C.clay} strokeOpacity={0.6} strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - wire} />
				</svg>
				<Arrow x1={1412} y1={340} x2={1412} y2={398} p={ramp(f, 126, 140)} />
				<Chip text="hook-sandbox.sh" x={1412} y={430} size={28} opacity={ramp(f, 140, 156)} />
				<Arrow x1={1412} y1={464} x2={1412} y2={514} p={ramp(f, 214, 228)} color={CT} />
				<div style={{position: 'absolute', left: 1000, top: 528, opacity: ramp(f, 226, 244), translate: `0 ${(1 - ramp(f, 226, 248)) * 20}px`}}>
					<CodeCard title="what actually runs" width={824} size={28} style={{border: `2px solid ${CT}`}}>
						<span style={{color: CT}}>{'<plugin-root>/bin/devcontainers'}</span>
						{'\n'}
						<span style={{color: CT}}>{'  exec -- bash -lc '}</span>
						{str("'pnpm test'")}
					</CodeCard>
				</div>
				<div style={{position: 'absolute', left: 1000, top: 742, opacity: ramp(f, 258, 274)}}>
					<Tag text="runs inside webapp-dev" color={CT} size={26} />
				</div>
			</div>

			<div style={{position: 'absolute', inset: 0, opacity: b}}>
				<Zone x={96} y={250} w={800} h={540} label="HOST" color={C.text} draw={ramp(f, 372, 400, INOUT)} />
				<Zone x={1024} y={250} w={800} h={540} label="CONTAINER" sub="webapp-dev" draw={ramp(f, 378, 406, INOUT)} />
				<div style={{position: 'absolute', left: 0, right: 0, top: 124, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, opacity: ramp(f, 376, 392)}}>
					Claude&apos;s Bash calls, with sandbox mode on
				</div>
				{CMDS.map((cm, i) => {
					const t = B0 + i * GAP;
					// Sideways first, then down; slots fill bottom-up so a falling chip never crosses a landed one.
					const p = ramp(f, t + 6, t + 26, INOUT);
					const px = ramp(f, t + 4, t + 18, INOUT);
					const slot = 2 - Math.floor(i / 2);
					const x = lerp(960, cm.host ? 496 : 1424, px);
					const y = lerp(205, 362 + slot * 82, ramp(f, t + 12, t + 26, INOUT));
					const col = p < 1 ? C.text : cm.host ? C.text : CT;
					const first = cm.c.split(' ')[0];
					const flash = cm.c.startsWith('cd') && f >= 584;
					return (
						<div key={cm.c} style={{position: 'absolute', left: x, top: y, translate: '-50% -50%', opacity: ramp(f, t, t + 8), fontFamily: MONO, fontSize: 30, color: C.text, background: C.panel, border: `2px solid ${flash ? C.clay : col}`, borderRadius: 10, padding: '6px 18px', whiteSpace: 'pre', boxShadow: flash ? `0 0 26px ${C.clay}88` : undefined}}>
							<span style={{color: f >= 392 + 10 || flash ? C.clay : C.text}}>{first}</span>
							{cm.c.slice(first.length)}
						</div>
					);
				})}
				<div style={{position: 'absolute', left: 124, top: 610, width: 744, opacity: ramp(f, 500, 518)}}>
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.dim, marginBottom: 8}}>first words that stay here:</div>
					<div style={{fontFamily: MONO, fontSize: 24, lineHeight: '36px', color: C.text, wordSpacing: 2}}>{ALLOW}</div>
					<div style={{fontFamily: MONO, fontSize: 24, lineHeight: '36px', color: C.dim}}>bash, npx: only for the plugin&apos;s own tools</div>
				</div>
				<div style={{position: 'absolute', left: 1052, top: 610, width: 744, opacity: ramp(f, 530, 548)}}>
					<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.dim, marginBottom: 8}}>everything else is wrapped in:</div>
					<div style={{fontFamily: MONO, fontSize: 26, lineHeight: '40px', color: CT}}>
						devcontainers exec -- bash -lc {str("'...'")}
					</div>
				</div>
			</div>

			<Cap from={10} to={112} size={56}>Claude runs shell commands with its <Em>Bash</Em> tool.</Cap>
			<Cap from={120} to={218} size={56}>A <Em>PreToolUse</Em> hook sees each call before it runs.</Cap>
			<Cap from={228} to={362} size={56}>In sandbox mode, it sends the call <Em color={CT}>into the container</Em>.</Cap>
			<Cap from={392} to={494} size={56}>Each call is sorted by its first word.</Cap>
			<Cap from={500} to={578} size={56}>A short <Em>allowlist</Em> stays on the host.</Cap>
			<Cap from={586} to={656} size={56}>So <Em>cd /tmp && make</Em> stays on the host too.</Cap>
		</Shell>
	);
};
