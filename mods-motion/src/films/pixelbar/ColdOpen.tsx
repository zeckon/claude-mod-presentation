import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../../kit';
import {PALETTES} from '../../pixelbar/palettes';
import {Strip} from '../../pixelbar/Strip';
import {camT, STRIP_H, STRIP_W, STRIP_X, STRIP_Y, TERM_H, TERM_W, Terminal} from '../../Terminal';
import {C, INOUT, lerp, PIXEL, ramp, SANS} from '../../theme';

export const ColdOpen: React.FC = () => {
	const f = useCurrentFrame();
	const p = PALETTES[0];
	const wipe = ramp(f, 170, 226, INOUT);
	const zoom = ramp(f, 226, 286, INOUT);
	const s = Math.exp(lerp(0, Math.log(1.45), zoom));
	const [zx, zy] = camT(1.45, 70, 640);
	const tx = lerp(960, zx, zoom);
	const ty = lerp(480, zy, zoom);
	const hl = ramp(f, 96, 116) * (1 - ramp(f, 176, 190));
	const walking = f >= 232;
	return (
		<Shell n={1} q="WHAT IS PIXELBAR?">
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: TERM_W,
					height: TERM_H,
					translate: `${tx - TERM_W / 2}px ${ty - TERM_H / 2}px`,
					scale: s,
					opacity: ramp(f, 4, 30),
				}}
			>
				<Terminal body={1 - 0.85 * zoom} hintOpacity={f < 190 ? 1 : 0} cursorOn={Math.floor(f / 15) % 2 === 0} wipe={wipe}>
					<Strip cw={STRIP_W / 140} state={{palette: p, cols: 140, mood: walking ? 'walk' : 'idle', tick: Math.floor(f / 7)}} />
				</Terminal>
				<div style={{position: 'absolute', left: STRIP_X - 8, top: STRIP_Y - 8, width: STRIP_W + 16, height: STRIP_H + 16, border: `3px dashed ${C.clay}`, borderRadius: 6, opacity: hl}} />
			</div>
			<div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: ramp(f, 250, 284)}}>
				<div style={{fontFamily: PIXEL, fontWeight: 700, fontSize: 170, color: '#9bbc0f', lineHeight: 1, translate: `0 ${(1 - ramp(f, 250, 284)) * 30}px`}}>pixelbar</div>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.dim, marginTop: 14}}>a pixel-art status strip for Claude Code</div>
			</div>
			<Cap from={24} to={150}>Under every prompt: a dim <Em>hint line</Em> and a mode indicator.</Cap>
			<Cap from={164} to={236}>pixelbar replaces both with something alive.</Cap>
			<Cap from={290} to={324}>Meet pixelbar.</Cap>
		</Shell>
	);
};
