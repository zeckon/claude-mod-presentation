import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell, typed} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';

const FILES = [
	{p: 'src/', keep: true},
	{p: 'package.json', keep: true},
	{p: '.env', keep: false},
	{p: '.env.local', keep: false},
	{p: 'node_modules/', keep: false},
	{p: 'dist/', keep: false},
	{p: 'debug.log', keep: false},
	{p: '.git/', keep: false},
];

const Box: React.FC<{x: number; y: number; w: number; h: number; title: string; sub: string; o: number; dashed?: boolean; lit?: boolean; children?: React.ReactNode}> = ({x, y, w, h, title, sub, o, dashed, lit, children}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 16, border: `3px ${dashed ? 'dashed' : 'solid'} ${lit ? C.clay : C.line}`, background: C.panel, boxSizing: 'border-box', padding: '22px 28px', opacity: o}}>
		<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: lit ? C.clay : C.text}}>{title}</div>
		<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.dim, marginTop: 6}}>{sub}</div>
		{children}
	</div>
);

export const Privacy: React.FC = () => {
	const f = useCurrentFrame();
	const diagram = ramp(f, 0, 20) * (1 - ramp(f, 236, 252));
	const strike = ramp(f, 40, 60);
	const flow = ramp(f, 70, 100);
	const remote = f >= 132;
	const lit = ramp(f, 186, 200);
	const end = ramp(f, 256, 286);
	return (
		<Shell n={6} q="WHERE DOES IT ALL GO?">
			<div style={{opacity: diagram}}>
				<div style={{position: 'absolute', left: 96, top: 170, fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: C.dim}}>YOUR FOLDER</div>
				<div style={{position: 'absolute', left: 96, top: 220, fontFamily: MONO, fontSize: 30, lineHeight: '64px'}}>
					{FILES.map((fl, i) => (
						<div key={fl.p} style={{color: fl.keep ? C.text : lerpColor(strike), textDecoration: !fl.keep && strike > 0.5 ? 'line-through' : 'none', opacity: ramp(f, 4 + i * 3, 18 + i * 3)}}>
							{fl.p}
						</div>
					))}
				</div>
				<div style={{position: 'absolute', left: 96, top: 750, fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.dim, opacity: strike}}>
					skipped by default via <span style={{fontFamily: MONO, color: C.clay}}>info/exclude</span>
				</div>

				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<path d="M 440 300 L 640 300" stroke={C.clay} strokeWidth={4} strokeOpacity={flow} strokeDasharray="200" strokeDashoffset={200 * (1 - flow)} fill="none" />
					<path d="M 630 288 L 644 300 L 630 312" stroke={C.clay} strokeWidth={4} fill="none" opacity={flow} />
					<path d="M 1180 300 L 1360 300" stroke={lit > 0 ? C.clay : C.line} strokeWidth={4} strokeDasharray="12 10" fill="none" opacity={ramp(f, 110, 130)} />
				</svg>

				<Box x={660} y={230} w={520} h={140} title="~/.claude-history/" sub="this machine, always" o={ramp(f, 60, 84)} lit />
				<Box x={1380} y={230} w={444} h={140} title="private remote" sub={lit > 0.5 ? 'pushes to host/<hostname>' : 'off by default'} o={ramp(f, 110, 130)} dashed lit={lit > 0.5} />

				{remote ? (
					<div style={{position: 'absolute', left: 660, top: 450, width: 1164, fontFamily: MONO, fontSize: 30, lineHeight: '58px', color: C.text, fontVariantLigatures: 'none'}}>
						<div>
							<span style={{color: C.clay}}>{'> '}</span>
							{typed('/history:remote git@github.com:me/history-myproject.git', f, 132, 0.7)}
						</div>
						<div style={{opacity: ramp(f, 170, 174)}}>
							<span style={{color: C.clay}}>{'> '}</span>
							{typed('/history:push-enable --yes', f, 172, 0.7)}
						</div>
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 16, lineHeight: 1.35, opacity: ramp(f, 196, 212)}}>
							Asks for --yes after showing what is excluded. Each machine pushes its own branch.
						</div>
					</div>
				) : null}
			</div>

			{f >= 246 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: end, translate: `0 ${(1 - end) * 20}px`}}>
					<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 150, color: C.clay, lineHeight: 1}}>history</div>
					<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 58, color: C.text, margin: '26px 0 40px'}}>
						Every turn, <Em>on the record</Em>.
					</div>
					{['/plugin marketplace add zeckon/claude-plugins', '/plugin install history@zeckon-claude-plugins', '/history:enable'].map((line, i) => (
						<div key={line} style={{fontFamily: MONO, fontSize: 34, color: C.text, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 12, padding: '14px 28px', margin: '14px auto', width: 1060, textAlign: 'left', whiteSpace: 'pre', opacity: ramp(f, 280 + i * 50, 286 + i * 50)}}>
							<span style={{color: C.clay}}>{'> '}</span>
							{typed(line, f, 286 + i * 50, 1)}
						</div>
					))}
				</div>
			) : null}

			<Cap from={14} to={118} size={54}>Local by default. <Em>.env</Em> and build output are skipped.</Cap>
			<Cap from={128} to={236} size={54}>A private remote is <Em>opt-in</Em>: for backup, or a second machine.</Cap>
		</Shell>
	);
};

const lerpColor = (t: number) => (t > 0.5 ? '#525b69' : C.dim);
