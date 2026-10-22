import React from 'react';
import {C, MONO} from './theme';

export const TERM_W = 1300;
export const TERM_H = 520;
export const STRIP_X = 20;
export const STRIP_W = 1260;
export const STRIP_H = (STRIP_W / 140) * 2;
export const STRIP_Y = TERM_H - 20 - STRIP_H;

type Props = {
	body: number; // opacity of everything except the strip
	hintOpacity: number;
	cursorOn: boolean;
	children: React.ReactNode; // the strip
	wipe: number; // 0..1 how much of the strip is revealed
};

export const Terminal: React.FC<Props> = ({body, hintOpacity, cursorOn, children, wipe}) => (
	<div
		style={{
			position: 'relative',
			width: TERM_W,
			height: TERM_H,
			borderRadius: 18,
			background: '#0e1115',
			border: `2px solid ${C.line}`,
			boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
			overflow: 'hidden',
			fontFamily: MONO,
		}}
	>
		<div style={{opacity: body}}>
			<div style={{height: 44, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 18}}>
				{['#ff5f57', '#febc2e', '#28c840'].map((c) => (
					<div key={c} style={{width: 13, height: 13, borderRadius: 7, background: c, opacity: 0.8}} />
				))}
				<span style={{marginLeft: 16, color: C.dim, fontSize: 17}}>~/mods-motion  claude</span>
			</div>
			<div style={{padding: '22px 28px', fontSize: 24, lineHeight: '46px', color: C.text}}>
				<div><span style={{color: C.clay}}>{'> '}</span>refactor the login form</div>
				<div style={{color: C.dim}}>{'* Reading src/login.tsx'}</div>
				<div style={{color: C.dim}}>{'* Editing 2 files'}</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 20,
					right: 20,
					top: 300,
					height: 72,
					border: `2px solid ${C.line}`,
					borderRadius: 10,
					padding: '0 22px',
					fontSize: 24,
					lineHeight: '68px',
					color: C.text,
				}}
			>
				<span style={{color: C.clay}}>{'> '}</span>
				<span style={{display: 'inline-block', width: 13, height: 28, verticalAlign: 'middle', background: C.text, opacity: cursorOn ? 0.9 : 0}} />
			</div>
			<div style={{position: 'absolute', left: STRIP_X + 10, top: STRIP_Y, color: C.dim, fontSize: 15, lineHeight: `${STRIP_H}px`, opacity: hintOpacity}}>
				manual mode on  ·  ? for shortcuts
			</div>
		</div>
		<div style={{position: 'absolute', left: STRIP_X, top: STRIP_Y, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`}}>{children}</div>
	</div>
);

/** Terminal centre (tx, ty) that puts strip column `fc` at screen x=960 and the strip row at screen y. */
export const camT = (s: number, fc: number, y: number): [number, number] => [
	960 - s * (STRIP_X + fc * (STRIP_W / 140) - TERM_W / 2),
	y - s * (STRIP_Y + STRIP_H / 2 - TERM_H / 2),
];
