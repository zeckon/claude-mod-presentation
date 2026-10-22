import React from 'react';
import {C, lerp, MONO, ramp, SANS} from './theme';
import {Chip, Spark} from './kit';

export const R = 300;
export const LAP = 72;
export type Hook = {name: string; angle: number; at: number};
export type Pt = {x: number; y: number};

const rad = (d: number) => (d * Math.PI) / 180;
const wrap = (a: number) => (((a % 360) + 360) % 360);
export const NODES = [
	{id: 'you', angle: -90, name: 'You', verb: 'ask', at: 20},
	{id: 'claude', angle: 0, name: 'Claude', verb: 'thinks', at: 0},
	{id: 'tools', angle: 90, name: 'Tools', verb: 'act', at: 30},
	{id: 'screen', angle: 180, name: 'Screen', verb: 'shows', at: 40},
];

export const hit = (f: number, orbitAt: number, angle: number) => {
	const t0 = orbitAt + (wrap(angle + 90) / 360) * LAP;
	if (f < t0) return {since: Infinity, n: -1};
	const n = Math.floor((f - t0) / LAP);
	return {since: f - (t0 + n * LAP), n};
};

export const pointOn = (cx: number, cy: number, s: number, angle: number, extra = 0): Pt => ({
	x: cx + s * (R + extra) * Math.cos(rad(angle)),
	y: cy + s * (R + extra) * Math.sin(rad(angle)),
});

const NodeIcon: React.FC<{id: string; f: number}> = ({id, f}) => {
	const stroke = {stroke: C.text, strokeWidth: 7, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
	if (id === 'you')
		return (
			<svg viewBox="0 0 100 100" width="100%" height="100%">
				<path d="M26 34 L46 50 L26 66" {...stroke} />
				<rect x={54} y={62} width={22} height={7} fill={C.clay} opacity={Math.floor(f / 15) % 2 ? 0.2 : 1} />
			</svg>
		);
	if (id === 'tools')
		return (
			<svg viewBox="0 0 100 100" width="100%" height="100%">
				<g transform="translate(50 50)" {...stroke}>
					<circle r={16} />
					{Array.from({length: 8}).map((_, i) => (
						<line key={i} x1={0} y1={-24} x2={0} y2={-33} transform={`rotate(${i * 45})`} strokeWidth={9} />
					))}
				</g>
			</svg>
		);
	if (id === 'screen')
		return (
			<svg viewBox="0 0 100 100" width="100%" height="100%">
				<rect x={20} y={26} width={60} height={42} rx={6} {...stroke} />
				<path d="M40 80 H60" {...stroke} />
				<rect x={30} y={36} width={22} height={5} fill={C.clay} />
				<rect x={30} y={47} width={34} height={5} fill={C.dim} />
			</svg>
		);
	return <Spark size={66} rot={f * 1.5} />;
};

type Props = {
	f: number;
	cx: number;
	cy: number;
	s: number;
	hooks?: Hook[];
	orbitAt?: number | null;
	labels?: number; // 0..1 node labels
	hookLabels?: number; // 0..1 hook chips
	accentHook?: string; // hook drawn in the highlight color
	start?: number; // frame the ring appears
};

/** The Claude Code loop: a ring with four stops, doorways (hooks) and a dot that travels it. */
export const Loop: React.FC<Props> = ({f, cx, cy, s, hooks = [], orbitAt = 40, labels = 1, hookLabels = 1, accentHook, start = 0}) => {
	const at = (a: number, extra = 0) => pointOn(cx, cy, s, a, extra);
	const size = 2 * R * s;
	const ringO = ramp(f, start, start + 24);
	const theta = orbitAt === null ? 0 : -90 + (360 * (f - orbitAt)) / LAP;
	const orbiting = orbitAt !== null && f >= orbitAt;
	const stroke = Math.max(2, 3 * s);
	const dot = (a: number, d: number, o: number, key: string) => {
		const p = at(a);
		return <div key={key} style={{position: 'absolute', left: p.x - d / 2, top: p.y - d / 2, width: d, height: d, borderRadius: d, background: C.clay, opacity: o, boxShadow: o > 0.9 ? `0 0 ${d * 1.8}px ${C.clay}` : undefined}} />;
	};
	return (
		<>
			<div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, boxSizing: 'border-box', border: `${stroke}px solid ${C.line}`, borderRadius: '50%', background: C.panel, opacity: ringO}} />
			{NODES.map((n) => {
				const p = ramp(f, start + n.at, start + n.at + 18);
				if (p <= 0) return null;
				const pos = at(n.angle);
				const sz = 124 * s;
				const lx = Math.cos(rad(n.angle));
				const vertical = Math.abs(Math.sin(rad(n.angle))) > 0.5;
				const near = orbiting && Math.abs(wrap(theta - n.angle + 180) - 180) < 14;
				const out = vertical ? {x: pos.x + sz / 2 + 24 * s, y: pos.y} : at(n.angle, 118);
				return (
					<React.Fragment key={n.id}>
						<div
							style={{
								position: 'absolute',
								left: pos.x - sz / 2,
								top: pos.y - sz / 2,
								width: sz,
								height: sz,
								borderRadius: sz * 0.22,
								background: C.panel,
								border: `${stroke}px solid ${near ? C.clay : C.line}`,
								boxSizing: 'border-box',
								padding: sz * 0.1,
								scale: p,
								opacity: p,
								boxShadow: near ? `0 0 ${40 * s}px ${C.clay}66` : undefined,
							}}
						>
							<NodeIcon id={n.id} f={f} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: out.x,
								top: out.y,
								translate: `${lx < -0.5 ? '-100%' : '0%'} -50%`,
								textAlign: lx < -0.5 ? 'right' : 'left',
								fontFamily: SANS,
								opacity: ramp(f, start + n.at + 14, start + n.at + 34) * labels,
								whiteSpace: 'nowrap',
							}}
						>
							<div style={{fontWeight: 700, fontSize: 40 * Math.max(0.7, s), color: C.text}}>{n.name}</div>
							<div style={{fontWeight: 500, fontSize: 28 * Math.max(0.7, s), color: C.dim}}>{n.verb}</div>
						</div>
					</React.Fragment>
				);
			})}
			{hooks.map((h) => {
				const p = ramp(f, h.at, h.at + 14);
				if (p <= 0) return null;
				const pos = at(h.angle);
				const hi = orbitAt === null ? {since: Infinity} : hit(f, orbitAt, h.angle);
				const cos = Math.cos(rad(h.angle));
				const lp = at(h.angle, 62);
				const color = accentHook && h.name === accentHook ? '#ffffff' : C.clay;
				return (
					<React.Fragment key={h.name}>
						<div
							style={{
								position: 'absolute',
								left: pos.x - 28 * s,
								top: pos.y - 11 * s,
								width: 56 * s,
								height: 22 * s,
								rotate: `${h.angle + 90}deg`,
								background: C.bg,
								border: `${Math.max(2, 4 * s)}px solid ${color}`,
								borderRadius: 6 * s,
								boxSizing: 'border-box',
								scale: p,
								boxShadow: hi.since < 10 ? `0 0 ${36 * s}px ${color}` : undefined,
							}}
						/>
						{hi.since < 26 ? (
							<div
								style={{
									position: 'absolute',
									left: pos.x - (30 + hi.since * 3.4) * s,
									top: pos.y - (30 + hi.since * 3.4) * s,
									width: (60 + hi.since * 6.8) * s,
									height: (60 + hi.since * 6.8) * s,
									borderRadius: '50%',
									border: `${Math.max(2, 4 * s)}px solid ${color}`,
									opacity: 1 - hi.since / 26,
								}}
							/>
						) : null}
						<Chip text={h.name} x={lp.x} y={lp.y} align={cos > 0 ? 'left' : 'right'} color={color} opacity={ramp(f, h.at + 6, h.at + 24) * hookLabels} />
					</React.Fragment>
				);
			})}
			{orbiting ? [...Array(10)].map((_, i) => dot(theta - i * 5, Math.max(5, (i === 0 ? 30 : 24 - i * 1.6) * s), i === 0 ? 1 : (1 - i / 10) * 0.45, `d${i}`)) : null}
		</>
	);
};

export const mono = MONO;
export {lerp};
