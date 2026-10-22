import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../kit';
import {PALETTES} from '../pixelbar/palettes';
import {colors, Mood, Strip, WalkerPixels} from '../pixelbar/Strip';
import {C, MONO, ramp, SANS} from '../theme';

const T0 = 60;
const BLOCK = 120;
const MOODS: {mood: Mood; name: string; why: string; hook: string}[] = [
	{mood: 'idle', name: 'Idle', why: 'Nothing is happening. Standing still, muted color.', hook: ''},
	{mood: 'walk', name: 'Walking', why: 'Claude is working on a turn. Legs step, accent color.', hook: 'turn.start'},
	{mood: 'happy', name: 'Happy', why: 'A turn just finished. Hops with sparkles for 2.5 s.', hook: 'turn.complete'},
	{mood: 'panic', name: 'Panicking', why: 'Context window at 80% or more. Shakes, alert color.', hook: 'usage update'},
	{mood: 'sleep', name: 'Asleep', why: 'No activity for 5 minutes. Curls up, z and Z drift.', hook: 'wakes on prompt.submit'},
];

export const Moods: React.FC = () => {
	const f = useCurrentFrame();
	const p = PALETTES[0];
	const k = colors(p);
	const idx = Math.max(0, Math.min(4, Math.floor((f - T0) / BLOCK)));
	const m = f < T0 ? 'idle' : MOODS[idx].mood;
	const rate = m === 'walk' ? 7 : m === 'happy' ? 10 : m === 'panic' ? 3 : 27;
	const tick = Math.floor(f / rate);
	const CWB = 64;
	return (
		<Shell n={3} q="WHAT DOES THE WALKER DO?">
			{/* big walker with its cell grid */}
			<div style={{position: 'absolute', left: 300, top: 250, width: CWB * 4, height: CWB * 2, opacity: ramp(f, 6, 26)}}>
				<div style={{position: 'absolute', left: CWB, top: 0}}>
					<WalkerPixels cw={CWB} mood={m} tick={tick} palette={p} />
				</div>
				<div style={{position: 'absolute', left: CWB, top: 0, width: CWB * 2, height: CWB * 2, border: `2px dashed ${C.dim}`}} />
				<div style={{position: 'absolute', left: CWB * 2, top: 0, width: 2, height: CWB * 2, background: C.dim}} />
				{m === 'happy' || m === 'sleep' ? (
					<div style={{position: 'absolute', left: CWB * 3 + 8, top: 0, fontFamily: MONO, fontSize: CWB * 1.1, lineHeight: `${CWB * 2}px`, color: m === 'happy' ? k.LIGHT : k.C4}}>
						{m === 'happy' ? (tick % 2 ? '+' : '*') : tick % 2 ? 'Z' : 'z'}
					</div>
				) : null}
			</div>
			<div style={{position: 'absolute', left: 300, top: 420, width: CWB * 4, fontFamily: MONO, fontSize: 24, color: C.dim, opacity: ramp(f, 30, 50), textAlign: 'center', lineHeight: 1.5}}>
				2 cells · 4x2 pixels
				<br />
				one terminal row
			</div>

			{/* the five moods */}
			<div style={{position: 'absolute', left: 900, top: 190, width: 930}}>
				{MOODS.map((md, i) => {
					const on = f >= T0 && idx === i;
					return (
						<div
							key={md.name}
							style={{
								height: 112,
								marginBottom: 14,
								padding: '0 28px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								borderRadius: 14,
								border: `3px solid ${on ? C.clay : C.line}`,
								background: on ? '#1a1512' : C.panel,
								opacity: ramp(f, 10 + i * 6, 30 + i * 6) * (on ? 1 : 0.55),
							}}
						>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
								<span style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: on ? C.text : C.dim}}>{md.name}</span>
								{md.hook ? <span style={{fontFamily: MONO, fontSize: 22, color: on ? C.clay : C.dim}}>{md.hook}</span> : null}
							</div>
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: on ? C.text : C.dim}}>{md.why}</div>
						</div>
					);
				})}
			</div>

			{/* the same walker, live on the strip */}
			<div style={{position: 'absolute', left: 190, top: 780, opacity: ramp(f, 40, 60)}}>
				<Strip cw={11.5} state={{palette: p, cols: 140, mood: m, tick, ctx: m === 'panic' ? 86 : 42}} />
			</div>

			<Cap from={14} to={56} size={52}>The walker reads the session, and <Em>reacts</Em>.</Cap>
		</Shell>
	);
};
