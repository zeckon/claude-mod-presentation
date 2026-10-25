import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Spark} from './kit';
import {DiffCard, Lines} from './films/explain/parts';
import {CT} from './films/devcontainers/parts';
import {hex, PALETTES} from './pixelbar/palettes';
import {Strip} from './pixelbar/Strip';
import {C, MONO, PIXEL, SANS} from './theme';

/** A 16:9 card image for the site index: the plugin's name, one line, one picture. Nothing is cropped or mid-animation. */
const Poster: React.FC<{name: string; accent: string; line: string; children: React.ReactNode}> = ({name, accent, line, children}) => (
	<AbsoluteFill style={{background: C.bg}}>
		<AbsoluteFill style={{backgroundImage: 'radial-gradient(#ffffff0f 2px, transparent 2px)', backgroundSize: '48px 48px'}} />
		<div style={{position: 'absolute', left: 120, top: 110, right: 120}}>
			<div style={{fontFamily: PIXEL, fontWeight: 700, fontSize: Math.min(170, 1600 / (name.length * 0.8)), lineHeight: 1, color: accent, whiteSpace: 'nowrap'}}>{name}</div>
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 56, color: C.text, marginTop: 34, lineHeight: 1.2}}>{line}</div>
		</div>
		<div style={{position: 'absolute', left: 120, right: 120, top: 520, bottom: 110, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
	</AbsoluteFill>
);

const Dot: React.FC<{color: string; size?: number}> = ({color, size = 34}) => <div style={{width: size, height: size, borderRadius: size, background: color, flex: 'none'}} />;

export const PixelbarPoster: React.FC = () => (
	<Poster name="pixelbar" accent={hex(PALETTES[0].accent)} line="A pixel-art status strip under your prompt.">
		<div style={{border: `2px solid ${C.line}`, borderRadius: 16, padding: 28, background: '#0e1115'}}>
			<Strip cw={11.4} state={{palette: PALETTES[0], cols: 140, mood: 'walk', tick: 1, ctx: 42}} />
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
		<div style={{width: '100%', display: 'grid', gap: 54}}>
			<Timeline label="your repo" sub="myproject/.git" dots={[4, 62]} color={C.text} />
			<Timeline label="shadow repo" sub="~/.claude-history/myproject-a3f9b2.git" dots={[10, 22, 34, 46, 58, 70, 82, 94]} color={C.clay} />
		</div>
	</Poster>
);

export const DevcontainersPoster: React.FC = () => (
	<Poster name="devcontainers" accent={C.clay} line="Author, run and sandbox dev containers from Claude.">
		<div style={{display: 'flex', alignItems: 'center', gap: 60}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 22, fontFamily: MONO, fontSize: 32, color: C.text, border: `2px solid ${C.clay}`, borderRadius: 14, padding: '18px 26px', background: C.panel}}>
				<Spark size={44} rot={0} />
				Bash: pnpm test
			</div>
			<div style={{fontFamily: MONO, fontSize: 56, color: C.clay}}>{'->'}</div>
			<div style={{border: `4px solid ${CT}`, borderRadius: 22, padding: '26px 34px', background: '#0f1722', display: 'grid', gap: 18}}>
				<div style={{fontFamily: MONO, fontSize: 28, color: CT}}>.devcontainer/devcontainer.json</div>
				<div style={{display: 'flex', gap: 16}}>
					{['node 22', 'pnpm', 'git', 'github-cli'].map((t) => (
						<div key={t} style={{fontFamily: MONO, fontSize: 28, color: CT, border: `2px solid ${CT}`, borderRadius: 10, padding: '6px 14px'}}>{t}</div>
					))}
				</div>
			</div>
		</div>
	</Poster>
);

export const ExplainPoster: React.FC = () => (
	<Poster name="explain" accent={C.clay} line="Turn a code change into an interactive lesson.">
		<div style={{display: 'flex', alignItems: 'center', gap: 50}}>
			<DiffCard width={700} size={28} />
			<div style={{fontFamily: MONO, fontSize: 56, color: C.clay}}>{'->'}</div>
			<div style={{width: 560, border: `2px solid ${C.line}`, borderRadius: 16, background: C.panel, padding: '26px 30px', display: 'grid', gap: 16}}>
				<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.clay}}>The lesson</div>
				<Lines widths={[92, 78, 96, 64]} />
				<div style={{display: 'flex', gap: 12}}>
					{[1, 2, 3, 4, 5].map((i) => (
						<Dot key={i} size={30} color={i < 5 ? C.clay : C.line} />
					))}
				</div>
			</div>
		</div>
	</Poster>
);
