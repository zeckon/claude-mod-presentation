import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, Em, kw, Shell, str} from '../kit';
import {hex, PALETTES} from '../pixelbar/palettes';
import {Strip} from '../pixelbar/Strip';
import {C, MONO, ramp, SANS} from '../theme';

const p = PALETTES[0];
const CELLS = [
	{ch: '\u2590', code: '0x2590', fg: p.tiles, bg: p.ground},
	{ch: ' ', code: '0x20', fg: p.labels, bg: p.tiles},
	{ch: 'M', code: '0x4d', fg: p.labels, bg: p.tiles},
	{ch: 'O', code: '0x4f', fg: p.labels, bg: p.tiles},
	{ch: 'D', code: '0x44', fg: p.labels, bg: p.tiles},
	{ch: 'E', code: '0x45', fg: p.labels, bg: p.tiles},
	{ch: ' ', code: '0x20', fg: p.labels, bg: p.tiles},
	{ch: 'D', code: '0x44', fg: p.values, bg: p.tiles},
	{ch: 'E', code: '0x45', fg: p.values, bg: p.tiles},
	{ch: 'F', code: '0x46', fg: p.values, bg: p.tiles},
];
const SW = 9.6;
const SL = (1920 - 140 * SW) / 2;

export const RasterScene: React.FC = () => {
	const f = useCurrentFrame();
	const cellsO = ramp(f, 150, 170) * (1 - ramp(f, 330, 346));
	const pipeO = ramp(f, 346, 366) * (1 - ramp(f, 464, 478));
	const codeO = ramp(f, 478, 498);
	const br = ramp(f, 130, 150);
	return (
		<Shell n={9} q="HOW IS THE STRIP DRAWN?">
			<div style={{position: 'absolute', left: SL, top: 190, opacity: ramp(f, 8, 28)}}>
				<Strip cw={SW} state={{palette: p, cols: 140, mood: 'walk', tick: Math.floor(f / 8)}} />
			</div>
			<div style={{position: 'absolute', left: SL + 5 * SW - 6, top: 180, width: 10 * SW + 12, height: SW * 2 + 20, border: `3px dashed ${C.clay}`, opacity: br * (1 - ramp(f, 330, 346))}} />

			{/* one cell = character, foreground, background */}
			<div style={{position: 'absolute', left: 210, top: 330, fontFamily: MONO, fontSize: 30, color: C.clay, opacity: cellsO}}>one cell = [ character, foreground, background ]</div>
			{CELLS.map((c, i) => {
				const o = ramp(f, 160 + i * 9, 176 + i * 9) * (1 - ramp(f, 330, 346));
				return (
					<div key={i} style={{position: 'absolute', left: 210 + i * 150, top: 390, width: 142, opacity: o, translate: `0 ${(1 - o) * 16}px`}}>
						<div style={{height: 142, background: hex(c.bg), position: 'relative', display: 'grid', placeItems: 'center', fontFamily: MONO, fontSize: 84, color: hex(c.fg)}}>
							{i === 0 ? <div style={{position: 'absolute', right: 0, top: 0, width: 71, height: 142, background: hex(c.fg)}} /> : c.ch}
						</div>
						<div style={{fontFamily: MONO, fontSize: 19, lineHeight: '28px', color: C.dim, marginTop: 8, textAlign: 'center'}}>
							{c.code}
							<br />
							fg {hex(c.fg)}
							<br />
							bg {hex(c.bg)}
						</div>
					</div>
				);
			})}

			{/* packing */}
			<div style={{position: 'absolute', left: 120, top: 380, width: 1680, display: 'flex', alignItems: 'center', gap: 28, opacity: pipeO}}>
				{[
					{t: 'Uint32Array', s: '3 numbers per cell'},
					{t: 'base64 string', s: 'one text value'},
					{t: '<Raster />', s: 'columns · rows · cells'},
				].map((b, i) => (
					<React.Fragment key={b.t}>
						<div style={{flex: 1, height: 190, borderRadius: 16, border: `3px solid ${i === 2 ? C.clay : C.line}`, background: C.panel, display: 'grid', placeItems: 'center', textAlign: 'center', opacity: ramp(f, 350 + i * 28, 370 + i * 28)}}>
							<div>
								<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: i === 2 ? C.clay : C.text}}>{b.t}</div>
								<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, marginTop: 10}}>{b.s}</div>
							</div>
						</div>
						{i < 2 ? <div style={{fontFamily: MONO, fontSize: 56, color: C.clay, opacity: ramp(f, 366 + i * 28, 386 + i * 28)}}>{'->'}</div> : null}
					</React.Fragment>
				))}
			</div>

			{/* the hook */}
			<div style={{position: 'absolute', left: 120, top: 240, opacity: codeO, translate: `0 ${(1 - codeO) * 20}px`}}>
				<CodeCard title="register.tsx" width={1060} size={21}>
					{kw('on')}({str("'ui.render'")}, {'{ component: '}
					{str("'PromptHint'")}
					{' }, '}
					{kw('async')} ($, e, next) {'=> {'}
					{'\n  '}
					{kw('const')} canvas = paint({'{ snap, mode, pose, columns, hidden, palette }'})
					{'\n  '}
					{kw('return')} {'('}
					{'\n    '}
					{'<Box width={1} height={1}>'}
					{'\n      '}
					{'<Box position="absolute" left={-pillOffset(mode)}>'}
					{'\n        '}
					{'<Raster columns={canvas.w} rows={1} cells={canvas.base64()} />'}
					{'\n      </Box>'}
					{'\n    </Box>'}
					{'\n  )'}
					{'\n'}
					{'})'}
				</CodeCard>
			</div>
			<div style={{position: 'absolute', left: 120, top: 700, fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.5, color: C.text}}>
				<div style={{opacity: ramp(f, 506, 522)}}><span style={{color: C.clay}}>ASCII only:</span> one width-1 character per cell.</div>
				<div style={{opacity: ramp(f, 524, 540)}}><span style={{color: C.clay}}>Two columns of margin</span> on each side, so it never writes the last column.</div>
				<div style={{opacity: ramp(f, 542, 558)}}><span style={{color: C.clay}}>Reaches back:</span> the site holds one cell; the strip is drawn absolute, over the mode indicator.</div>
			</div>

			<Cap from={10} to={124} size={54}>The strip is one row of terminal <Em>cells</Em>.</Cap>
			<Cap from={176} to={324} size={54}>Each cell: a character and two colors.</Cap>
			<Cap from={366} to={460} size={54}>The mod packs the row into one string…</Cap>
			<Cap from={484} to={596} size={54}>…and returns it from <Em>ui.render</Em>.</Cap>
		</Shell>
	);
};
