import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Spark} from './kit';
import {DiffCard, Lines} from './films/explain/parts';
import {CT} from './films/devcontainers/parts';
import {hex, PALETTES} from './pixelbar/palettes';
import {Strip, WalkerPixels} from './pixelbar/Strip';
import {C, MONO, PIXEL, SANS} from './theme';

/** A square card image for the site index: the plugin's name, one line, one picture filling the rest. */
const Poster: React.FC<{name: string; accent: string; line: string; children: React.ReactNode}> = ({name, accent, line, children}) => (
	<AbsoluteFill style={{background: C.bg}}>
		<AbsoluteFill style={{backgroundImage: 'radial-gradient(#ffffff0f 2px, transparent 2px)', backgroundSize: '48px 48px'}} />
		<div style={{position: 'absolute', left: 90, top: 90, right: 90}}>
			<div style={{fontFamily: PIXEL, fontWeight: 700, fontSize: Math.min(150, 900 / (name.length * 0.86)), lineHeight: 1, color: accent, whiteSpace: 'nowrap'}}>{name}</div>
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 56, color: C.text, marginTop: 30, lineHeight: 1.18}}>{line}</div>
		</div>
		<div style={{position: 'absolute', left: 90, right: 90, top: 440, bottom: 90, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
	</AbsoluteFill>
);

const Dot: React.FC<{color: string; size?: number}> = ({color, size = 34}) => <div style={{width: size, height: size, borderRadius: size, background: color, flex: 'none'}} />;

export const PixelbarPoster: React.FC = () => (
	<Poster name="pixelbar" accent={hex(PALETTES[0].accent)} line="A pixel-art status strip under your prompt.">
		<div style={{display: 'grid', justifyItems: 'center', gap: 60}}>
			<WalkerPixels cw={110} mood="walk" tick={0} palette={PALETTES[0]} />
			<div style={{border: `2px solid ${C.line}`, borderRadius: 16, padding: 22, background: '#0e1115'}}>
			<Strip cw={12} state={{palette: PALETTES[0], cols: 70, mood: 'walk', tick: 1, ctx: 42, hidden: ['model', 'effort', 'session', 'git', '7d', 'last', 'agents', 'tools', 'edits', 'compacts', 'hint', 'commit']}} />
			</div>
		</div>
	</Poster>
);

const Timeline: React.FC<{label: string; sub: string; dots: number[]; color: string}> = ({label, sub, dots, color}) => (
	<div style={{width: '100%'}}>
		<div style={{fontFamily: MONO, fontSize: 30, color: C.text, marginBottom: 18}}>
			<b>{label}</b> <span style={{color: C.dim}}>{sub}</span>
		</div>
		<div style={{position: 'relative', height: 40}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 18, height: 4, background: C.line}} />
			{dots.map((x) => (
				<div key={x} style={{position: 'absolute', left: `${x}%`, top: 3}}>
					<Dot color={color} />
				</div>
			))}
		</div>
	</div>
);

export const HistoryPoster: React.FC = () => (
	<Poster name="history" accent={C.clay} line="Every Claude turn, committed to a shadow repo.">
		<div style={{width: '100%', display: 'grid', gap: 70}}>
			<Timeline label="your repo" sub=".git" dots={[6, 70]} color={C.text} />
			<Timeline label="shadow repo" sub="~/.claude-history/" dots={[6, 22, 38, 54, 70, 86]} color={C.clay} />
		</div>
	</Poster>
);

export const DevcontainersPoster: React.FC = () => (
	<Poster name="devcontainers" accent={C.clay} line="Author, run and sandbox dev containers from Claude.">
		<div style={{display: 'grid', justifyItems: 'center', gap: 26}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: MONO, fontSize: 36, color: C.text, border: `2px solid ${C.clay}`, borderRadius: 14, padding: '18px 28px', background: C.panel}}>
				<Spark size={48} rot={0} />
				Bash: pnpm test
			</div>
			<svg width={40} height={70} viewBox="0 0 40 70"><path d="M20 4 V60 M6 46 L20 62 L34 46" stroke={C.clay} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
			<div style={{border: `4px solid ${CT}`, borderRadius: 22, padding: '26px 34px', background: '#0f1722', display: 'grid', gap: 18}}>
				<div style={{fontFamily: MONO, fontSize: 30, color: CT}}>dev container</div>
				<div style={{display: 'grid', gridTemplateColumns: 'auto auto', gap: 16}}>
					{['node 22', 'pnpm', 'git', 'github-cli'].map((t) => (
						<div key={t} style={{fontFamily: MONO, fontSize: 32, color: CT, border: `2px solid ${CT}`, borderRadius: 10, padding: '6px 16px'}}>{t}</div>
					))}
				</div>
			</div>
		</div>
	</Poster>
);

export const ExplainPoster: React.FC = () => (
	<Poster name="explain" accent={C.clay} line="Turn a code change into an interactive lesson.">
		<div style={{display: 'grid', justifyItems: 'center', gap: 14, width: '100%', marginTop: 40}}>
			<DiffCard width={820} size={24} />
			<svg width={34} height={44} viewBox="0 0 40 56"><path d="M20 4 V46 M6 32 L20 48 L34 32" stroke={C.clay} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
			<div style={{width: 820, border: `2px solid ${C.line}`, borderRadius: 16, background: C.panel, padding: '20px 28px', display: 'grid', gap: 14}}>
				<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.clay}}>The lesson</div>
				<Lines widths={[92, 74]} />
				<div style={{display: 'flex', gap: 12}}>
					{[1, 2, 3, 4, 5].map((i) => (
						<Dot key={i} size={30} color={i < 5 ? C.clay : C.line} />
					))}
				</div>
			</div>
		</div>
	</Poster>
);
