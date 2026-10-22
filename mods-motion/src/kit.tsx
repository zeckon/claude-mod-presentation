import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, MONO, ramp, SANS} from './theme';

export const Em: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.clay}) => <span style={{color}}>{children}</span>;

/** One scene's frame: background, question label, fade in and out. */
export const Shell: React.FC<{n: number; q: string; children: React.ReactNode}> = ({n, q, children}) => {
	const f = useCurrentFrame();
	const {durationInFrames: d} = useVideoConfig();
	const o = Math.min(ramp(f, 0, 14), 1 - ramp(f, d - 14, d));
	return (
		<AbsoluteFill style={{background: C.bg, opacity: o, overflow: 'hidden'}}>
			<AbsoluteFill style={{backgroundImage: 'radial-gradient(#ffffff0f 2px, transparent 2px)', backgroundSize: '48px 48px'}} />
			<div style={{position: 'absolute', top: 60, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: C.dim, opacity: ramp(f, 8, 24)}}>
				<span style={{color: C.clay}}>{String(n).padStart(2, '0')}</span>
				{'  /  '}
				{q}
			</div>
			{children}
		</AbsoluteFill>
	);
};

/** A caption that fades in at `from` and out at `to`; sits on a fade so it never fights the picture. */
export const Cap: React.FC<{from: number; to: number; children: React.ReactNode; size?: number}> = ({from, to, children, size = 60}) => {
	const f = useCurrentFrame();
	const o = Math.min(ramp(f, from, from + 12), 1 - ramp(f, to - 10, to));
	if (o <= 0) return null;
	return (
		<>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 230, background: `linear-gradient(to top, ${C.bg} 35%, ${C.bg}00)`, opacity: o}} />
			<div
				style={{
					position: 'absolute',
					left: 120,
					right: 120,
					bottom: 84,
					textAlign: 'center',
					fontFamily: SANS,
					fontWeight: 700,
					fontSize: size,
					lineHeight: 1.15,
					color: C.text,
					opacity: o,
					translate: `0 ${(1 - ramp(f, from, from + 16)) * 16}px`,
				}}
			>
				{children}
			</div>
		</>
	);
};

export const Chip: React.FC<{text: string; x: number; y: number; opacity?: number; size?: number; align?: 'left' | 'right' | 'center'; color?: string; fill?: string}> = ({text, x, y, opacity = 1, size = 26, align = 'center', color = C.clay, fill = C.panel}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: y,
			translate: `${align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0%'} -50%`,
			opacity,
			fontFamily: MONO,
			fontSize: size,
			color,
			padding: '6px 14px',
			background: fill,
			border: `2px solid ${color}`,
			borderRadius: 10,
			whiteSpace: 'nowrap',
		}}
	>
		{text}
	</div>
);

/** Text typed one character per `speed` frames. */
export const typed = (text: string, f: number, start: number, speed = 1.4) => text.slice(0, Math.max(0, Math.floor((f - start) / speed)));

export const Spark: React.FC<{size: number; rot: number}> = ({size, rot}) => (
	<svg width={size} height={size} viewBox="0 0 100 100" style={{rotate: `${rot}deg`}}>
		<g transform="translate(50 50)" fill={C.clay}>
			{Array.from({length: 8}).map((_, i) => (
				<rect key={i} x={-4.5} y={-44} width={9} height={i % 2 ? 24 : 34} rx={4.5} transform={`rotate(${i * 45})`} />
			))}
		</g>
	</svg>
);

/** A dark code window. */
export const CodeCard: React.FC<{title: string; width: number; children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({title, width, children, size = 24, style}) => (
	<div style={{width, background: '#0e1115', border: `2px solid ${C.line}`, borderRadius: 16, fontFamily: MONO, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', ...style}}>
		<div style={{height: 52, display: 'flex', alignItems: 'center', padding: '0 22px', borderBottom: `1px solid ${C.line}`, color: C.dim, fontSize: 20, gap: 12}}>
			<span style={{width: 12, height: 12, background: '#9bbc0f'}} />
			{title}
		</div>
		<div style={{padding: '16px 24px', fontSize: size, lineHeight: `${size * 1.55}px`, color: C.text, whiteSpace: 'pre'}}>{children}</div>
	</div>
);
export const kw = (t: string) => <span style={{color: '#c792ea'}}>{t}</span>;
export const str = (t: string) => <span style={{color: '#a5d6a7'}}>{t}</span>;
export const dimc = (t: string) => <span style={{color: C.dim}}>{t}</span>;
