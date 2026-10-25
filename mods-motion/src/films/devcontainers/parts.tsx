import React from 'react';
import {typed} from '../../kit';
import {C, MONO, SANS} from '../../theme';

/** The container colour: everything that lives inside the dev container. */
export const CT = '#6cb6ff';

/** A labelled outline: the host, or the dev container. */
export const Zone: React.FC<{x: number; y: number; w: number; h: number; label: string; sub?: string; color?: string; opacity?: number; draw?: number; glow?: boolean; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, label, sub, color = CT, opacity = 1, draw = 1, glow = false, children, style}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity, ...style}}>
		<svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<rect x={2} y={2} width={w - 4} height={h - 4} rx={22} fill={`${color}0d`} stroke={color} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{filter: glow ? `drop-shadow(0 0 18px ${color})` : undefined}} />
		</svg>
		<div style={{position: 'absolute', left: 28, top: 20, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 3, color, opacity: draw}}>
			{label}
			{sub ? <span style={{fontWeight: 400, color: C.dim, letterSpacing: 0, marginLeft: 18}}>{sub}</span> : null}
		</div>
		{children}
	</div>
);

/** A Claude Code prompt line that types `text` from frame `at`. */
export const Prompt: React.FC<{f: number; at: number; text: string; speed?: number; size?: number; width?: number; cursor?: boolean; children?: React.ReactNode}> = ({f, at, text, speed = 1.2, size = 30, width, cursor = true, children}) => {
	const shown = typed(text, f, at, speed);
	const done = shown.length === text.length;
	return (
		<div style={{width, boxSizing: 'border-box', fontFamily: MONO, fontSize: size, color: C.text, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 12, padding: '14px 26px', whiteSpace: 'pre', display: 'flex', alignItems: 'center'}}>
			<span style={{color: C.clay}}>{'> '}</span>
			{shown}
			{cursor && (!done || Math.floor(f / 15) % 2 === 0) ? <span style={{display: 'inline-block', width: size * 0.5, height: size * 1.1, marginLeft: 2, background: C.text, opacity: 0.85}} /> : null}
			{children}
		</div>
	);
};

/** A small rounded tag, e.g. OK or a note next to a line. */
export const Tag: React.FC<{text: string; color?: string; opacity?: number; size?: number; style?: React.CSSProperties}> = ({text, color = C.clay, opacity = 1, size = 24, style}) => (
	<span style={{display: 'inline-block', fontFamily: MONO, fontSize: size, lineHeight: 1.2, color, border: `2px solid ${color}`, background: `${color}1f`, borderRadius: 8, padding: '2px 12px', whiteSpace: 'nowrap', opacity, ...style}}>
		{text}
	</span>
);

/** A drawn tick (the mono font has no check glyph). */
export const Tick: React.FC<{size?: number; color?: string; p?: number}> = ({size = 34, color = '#8bd17c', p = 1}) => (
	<svg width={size} height={size} viewBox="0 0 40 40" style={{verticalAlign: 'middle'}}>
		<path d="M8 21 L17 30 L33 11" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
	</svg>
);

/** A straight arrow from (x1,y1) to (x2,y2), drawn to fraction p. */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; p?: number; color?: string; width?: number}> = ({x1, y1, x2, y2, p = 1, color = C.clay, width = 4}) => {
	const x = x1 + (x2 - x1) * p;
	const y = y1 + (y2 - y1) * p;
	const a = Math.atan2(y2 - y1, x2 - x1);
	const hs = 16;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
			{p > 0 ? <line x1={x1} y1={y1} x2={x} y2={y} stroke={color} strokeWidth={width} strokeLinecap="round" /> : null}
			{p > 0.95 ? <path d={`M${x2 - hs * Math.cos(a - 0.5)} ${y2 - hs * Math.sin(a - 0.5)} L${x2} ${y2} L${x2 - hs * Math.cos(a + 0.5)} ${y2 - hs * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
		</svg>
	);
};

/** Plain-language body text. */
export const Body: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 32, color = C.text, style}) => (
	<div style={{fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1.35, color, ...style}}>{children}</div>
);
