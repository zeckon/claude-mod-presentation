import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell} from '../../kit';
import {C, INOUT, lerp, MONO, ramp, SANS} from '../../theme';
import {Arrow, DiffCard, Lines} from './parts';

const MiniHead: React.FC<{t: string; o: number}> = ({t, o}) => (
	<div style={{opacity: o, translate: `0 ${(1 - o) * 14}px`, marginTop: 18}}>
		<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.text, marginBottom: 10}}>{t}</div>
	</div>
);

export const ColdOpen: React.FC = () => {
	const f = useCurrentFrame();
	const move = ramp(f, 140, 190, INOUT);
	const dx = lerp(520, 120, move);
	const docO = ramp(f, 180, 210);
	const sec = (i: number) => ramp(f, 196 + i * 10, 212 + i * 10);
	const title = ramp(f, 250, 280);
	return (
		<Shell n={1} q="WHAT IS EXPLAIN?">
			<DiffCard width={880} style={{position: 'absolute', left: dx, top: 410, opacity: ramp(f, 4, 26)}} />

			<Arrow x={1024} y={560} w={72} opacity={docO} t={ramp(f, 180, 200)} />

			<div style={{position: 'absolute', left: 1120, top: 330, width: 680, height: 494, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 16, padding: '24px 30px', boxSizing: 'border-box', opacity: docO, translate: `${(1 - docO) * 40}px 0`, boxShadow: '0 30px 80px rgba(0,0,0,0.5)', overflow: 'hidden'}}>
				<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.clay}}>Invalidating the user cache on save</div>
				<MiniHead t="Background" o={sec(0)} />
				<div style={{opacity: sec(0)}}>
					<Lines widths={[92, 70]} />
				</div>
				<MiniHead t="The problem" o={sec(1)} />
				<div style={{opacity: sec(1)}}>
					<Lines widths={[84, 60]} />
				</div>
				<MiniHead t="Data flow" o={sec(2)} />
				<div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: sec(2)}}>
					{['save', 'db', 'cache'].map((n, i) => (
						<React.Fragment key={n}>
							{i ? <div style={{width: 34, height: 4, background: C.clay}} /> : null}
							<div style={{fontFamily: MONO, fontSize: 24, color: C.text, border: `2px solid ${C.clay}`, borderRadius: 8, padding: '4px 14px'}}>{n}</div>
						</React.Fragment>
					))}
				</div>
				<MiniHead t="Quiz" o={sec(3)} />
				<div style={{display: 'flex', gap: 12, opacity: sec(3)}}>
					{[0, 1, 2, 3, 4].map((i) => (
						<div key={i} style={{width: 40, height: 40, borderRadius: 20, border: `3px solid ${i < 4 ? C.clay : C.line}`, background: i < 4 ? '#d9775733' : 'transparent'}} />
					))}
				</div>
			</div>

			<div style={{position: 'absolute', top: 128, left: 0, right: 0, textAlign: 'center', opacity: title, translate: `0 ${(1 - title) * 24}px`}}>
				<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 112, color: C.clay, lineHeight: 1}}>explain</div>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.dim, marginTop: 14}}>a Claude Code plugin that turns a code change into a lesson</div>
			</div>

			<Cap from={16} to={124}>A diff shows <Em>what</Em> changed.</Cap>
			<Cap from={130} to={204}>It rarely shows why, or what else it touches.</Cap>
			<Cap from={210} to={282}>explain turns a change into a <Em>lesson</Em>.</Cap>
			<Cap from={288} to={326}>Meet explain.</Cap>
		</Shell>
	);
};
