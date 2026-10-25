import React from 'react';
import {C, MONO, SANS} from '../../theme';

export const ADD = '#7ee787';
export const ADD_BG = '#2ea0432e';
export const BAD = '#ff7b72';
export const BAD_BG = '#f851492e';

/** The example change used throughout the film. */
export const DIFF: {sign: ' ' | '+'; text: string}[] = [
	{sign: ' ', text: 'async function save(user) {'},
	{sign: ' ', text: '  await db.write(user)'},
	{sign: '+', text: '  cache.delete(user.id)'},
	{sign: ' ', text: '}'},
];

/** A dark `git diff` window with the example change. */
export const DiffCard: React.FC<{width: number; size?: number; style?: React.CSSProperties}> = ({width, size = 30, style}) => (
	<div style={{width, background: '#0e1115', border: `2px solid ${C.line}`, borderRadius: 16, fontFamily: MONO, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', ...style}}>
		<div style={{height: 56, display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `1px solid ${C.line}`, color: C.dim, fontSize: 24, gap: 12}}>
			<span style={{width: 12, height: 12, background: ADD}} />
			git diff  src/users/save.ts
		</div>
		<div style={{padding: '18px 0', fontSize: size, lineHeight: `${size * 1.7}px`, whiteSpace: 'pre'}}>
			{DIFF.map((l, i) => (
				<div key={i} style={{padding: '0 24px', background: l.sign === '+' ? ADD_BG : 'transparent', color: l.sign === '+' ? ADD : C.text}}>
					<span style={{color: l.sign === '+' ? ADD : C.dim}}>{l.sign} </span>
					{l.text}
				</div>
			))}
		</div>
	</div>
);

/** A right-pointing arrow drawn with divs. */
export const Arrow: React.FC<{x: number; y: number; w: number; color?: string; opacity?: number; t?: number}> = ({x, y, w, color = C.clay, opacity = 1, t = 1}) => (
	<div style={{position: 'absolute', left: x, top: y - 14, width: w, height: 28, opacity}}>
		<div style={{position: 'absolute', left: 0, top: 12, width: Math.max(0, (w - 18) * t), height: 4, background: color, borderRadius: 2}} />
		{t >= 1 ? <div style={{position: 'absolute', right: 0, top: 2, width: 0, height: 0, borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: `20px solid ${color}`}} /> : null}
	</div>
);

/** A labelled callout box, as the generated page uses them. */
export const Callout: React.FC<{label: string; children: React.ReactNode; color?: string; size?: number}> = ({label, children, color = C.clay, size = 28}) => (
	<div style={{borderLeft: `6px solid ${color}`, background: `${color}14`, borderRadius: '0 10px 10px 0', padding: '14px 22px'}}>
		<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 2, color}}>{label}</div>
		<div style={{fontFamily: SANS, fontWeight: 500, fontSize: size, color: C.text, lineHeight: 1.3, marginTop: 4}}>{children}</div>
	</div>
);

/** Grey placeholder text lines. */
export const Lines: React.FC<{widths: number[]; gap?: number; h?: number}> = ({widths, gap = 16, h = 14}) => (
	<div>
		{widths.map((w, i) => (
			<div key={i} style={{width: `${w}%`, height: h, borderRadius: h / 2, background: C.line, marginTop: i ? gap : 0}} />
		))}
	</div>
);
