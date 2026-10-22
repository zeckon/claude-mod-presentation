import React from 'react';
import {MONO} from '../theme';
import {hex, mix, Palette} from './palettes';

export type Mood = 'idle' | 'walk' | 'happy' | 'panic' | 'sleep';

export type StripState = {
	palette: Palette;
	mood?: Mood;
	tick?: number;
	flash?: boolean;
	dir?: string;
	git?: string | null;
	diff?: string | null;
	commit?: string | null;
	stash?: number;
	mode?: boolean;
	model?: string;
	effort?: number | null; // 0..4
	ctx?: number;
	cache?: string | null;
	tok?: number[];
	h5?: number | null;
	session?: string;
	/** Section ids switched off with /pixelbar-sections. */
	hidden?: readonly string[];
	/** Terminal columns available; items drop out by priority when it is too narrow. */
	cols?: number;
	ctxBar?: number;
};

export const DEFAULT_HIDDEN = ['commit', '7d', 'last', 'agents', 'tools', 'edits', 'compacts', 'hint'];
const EFFORTS = ['LOW', 'MEDIUM', 'HIGH', 'XHIGH', 'MAX'];
const compact = (n: number) => (n < 1000 ? `${n}` : `${n < 1e6 ? (n / 1e3 < 10 ? (n / 1e3).toFixed(1) : Math.round(n / 1e3)) : Math.round(n / 1e6)}${n < 1e6 ? 'K' : 'M'}`.replace('.0K', 'K'));

type Item = {id: string; w: number; priority: number; render: (cw: number, k: Colors) => React.ReactNode};
type Colors = ReturnType<typeof colors>;

export const colors = (p: Palette) => ({
	BASE: hex(p.ground),
	C1: hex(mix(p.ground, p.tiles, 0.5)),
	C2: hex(p.tiles),
	C3: hex(mix(p.tiles, p.labels, 0.5)),
	C4: hex(p.labels),
	ACCENT: hex(p.accent),
	LIGHT: hex(p.values),
	ALERT: hex(p.alert),
	raw: p,
});

const font = (cw: number) => ({fontFamily: MONO, fontSize: cw / 0.6, lineHeight: `${cw * 2}px`, whiteSpace: 'pre' as const});

const tile = (id: string, label: string, valueLen: number, value: (k: Colors, cw: number) => React.ReactNode, priority: number): Item => ({
	id,
	w: label.length + valueLen + 5,
	priority,
	render: (cw, k) => (
		<div style={{position: 'absolute', left: 0, top: 0, width: (label.length + valueLen + 5) * cw, height: cw * 2}}>
			<div style={{position: 'absolute', left: cw * 0.5, right: cw * 0.5, top: 0, bottom: 0, background: k.C2}} />
			<div style={{position: 'absolute', left: cw, top: 0, color: k.C4, ...font(cw)}}>
				{` ${label} `}
				{value(k, cw)}
			</div>
		</div>
	),
});
const plain = (text: string) => (k: Colors) => <span style={{color: k.LIGHT}}>{`${text} `}</span>;

const gauge = (id: string, label: string, pct: number, bar: number, hotAt: number, priority: number, extra = ''): Item => {
	const text = ` ${Math.round(pct)}%${extra}`;
	const hot = pct >= hotAt;
	return {
		id,
		w: label.length + 1 + bar + text.length,
		priority,
		render: (cw, k) => {
			const ch = cw * 2;
			const filled = Math.round((Math.min(100, Math.max(0, pct)) / 100) * bar);
			return (
				<div style={{position: 'absolute', left: 0, top: 0, width: (label.length + 1 + bar + text.length) * cw, height: ch}}>
					<div style={{position: 'absolute', left: 0, top: 0, color: k.C4, ...font(cw)}}>{`${label} `}</div>
					{Array.from({length: bar}).map((_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: (label.length + 1 + i) * cw,
								bottom: ch * 0.125,
								width: cw - Math.max(1, cw * 0.06),
								height: ch * 0.75,
								background: i >= filled ? k.C1 : hot ? k.ALERT : hex(mix(mix(k.raw.tiles, k.raw.labels, 0.5), k.raw.accent, i / Math.max(1, bar - 1))),
							}}
						/>
					))}
					<div style={{position: 'absolute', left: (label.length + 1 + bar) * cw, top: 0, color: hot ? k.ALERT : k.LIGHT, ...font(cw)}}>{text}</div>
				</div>
			);
		},
	};
};

const buildItems = (s: StripState): {project: Item[]; claude: Item[]} => {
	const project: Item[] = [tile('dir', 'DIR', (s.dir ?? 'mods-motion').length, plain(s.dir ?? 'mods-motion'), 1)];
	if (s.git !== null) project.push(tile('git', 'GIT', (s.git ?? 'main *2').length, plain(s.git ?? 'main *2'), 1.5));
	if (s.diff) project.push(tile('diff', 'DIFF', s.diff.length, plain(s.diff), 3));
	if (s.commit) project.push(tile('commit', 'COMMIT', s.commit.length, plain(s.commit), 4));
	if (s.stash) project.push(tile('stash', 'STASH', `${s.stash}`.length, plain(`${s.stash}`), 5));

	const claude: Item[] = [];
	if (s.mode) claude.push(tile('mode', 'MODE', 7, plain('DEFAULT'), 1));
	claude.push(tile('model', 'MODEL', (s.model ?? 'OPUS 5.5').length, plain(s.model ?? 'OPUS 5.5'), 2));
	if (s.effort !== null) {
		const e = s.effort ?? 2;
		const word = EFFORTS[e];
		claude.push(
			tile('effort', 'EFFORT', 6 + word.length, (k, cw) => (
				<>
					<span style={{display: 'inline-block', position: 'relative', width: 5 * cw, height: cw * 2, verticalAlign: 'top'}}>
						{[0, 1, 2, 3, 4].map((i) => (
							<span key={i} style={{position: 'absolute', left: i * cw, top: 0, width: cw, height: cw * 2, background: k.LIGHT, opacity: i <= e ? 1 : 0.25}} />
						))}
					</span>
					<span style={{color: k.LIGHT}}>{` ${word} `}</span>
				</>
			), 2),
		);
	}
	const pct = s.ctx ?? 42;
	claude.push(gauge('ctx', 'CTX', pct, s.ctxBar ?? 10, 80, 1, ` ${compact(Math.round(pct * 2000))}/200K`));
	if (s.cache) claude.push(tile('cache', 'CACHE', s.cache.length, plain(s.cache), 4));
	if (s.tok?.length) {
		const bars = s.tok.slice(-12);
		const max = Math.max(1, ...bars);
		claude.push({
			id: 'tok',
			w: 4 + bars.length,
			priority: 4,
			render: (cw, k) => (
				<div style={{position: 'absolute', left: 0, top: 0, width: (4 + bars.length) * cw, height: cw * 2}}>
					<div style={{position: 'absolute', left: 0, top: 0, color: k.C4, ...font(cw)}}>{'TOK '}</div>
					{bars.map((v, i) => {
						const lvl = Math.min(7, Math.floor((v / max) * 7));
						return <div key={i} style={{position: 'absolute', left: (4 + i) * cw, bottom: 0, width: cw - 1, height: ((lvl + 1) / 8) * cw * 2, background: hex(mix(mix(k.raw.tiles, k.raw.labels, 0.5), k.raw.values, lvl / 7))}} />;
					})}
				</div>
			),
		});
	}
	if (s.h5 !== null && s.h5 !== undefined) claude.push(gauge('5h', '5H', s.h5, 6, 90, 4));
	claude.push(tile('session', 'SESSION', (s.session ?? '1h12m 7T $1.23').length, plain(s.session ?? '1h12m 7T $1.23'), 3));
	return {project, claude};
};

const X0 = 5;

/** The row's items, placed in cells, after the narrow-terminal drop-out. */
export const stripLayout = (s: StripState, cols?: number) => {
	const hidden = new Set(s.hidden ?? DEFAULT_HIDDEN);
	const {project, claude} = buildItems(s);
	const p = project.filter((i) => !hidden.has(i.id));
	const c = claude.filter((i) => !hidden.has(i.id));
	const divider: Item = {id: 'divider', w: 1, priority: 1, render: () => null};
	let list = p.length && c.length ? [...p, divider, ...c] : [...p, ...c];
	const width = (l: Item[]) => l.reduce((n, i) => n + i.w + 1, X0);
	const limit = cols ?? Infinity;
	while (list.length > 1 && width(list) > limit) {
		const worst = list.reduce((a, b) => (b.priority >= a.priority ? b : a));
		list = list.filter((i) => i !== worst);
	}
	let x = X0;
	const placed = list.map((item) => {
		const at = x;
		x += item.w + 1;
		return {item, x: at};
	});
	return {placed, used: x, ids: list.map((i) => i.id)};
};

const GRID: Record<string, number[][]> = {
	idle: [[1, 1, 1, 1], [1, 0, 0, 1]],
	step: [[1, 1, 1, 1], [0, 1, 1, 0]],
	hop: [[0, 1, 1, 0], [1, 1, 1, 1]],
	sleep: [[0, 0, 0, 0], [1, 1, 1, 1]],
};
export const walkerGrid = (mood: Mood, tick: number) => {
	const odd = tick % 2 === 1;
	if (mood === 'walk' || mood === 'panic') return odd ? GRID.step : GRID.idle;
	if (mood === 'happy') return odd ? GRID.idle : GRID.hop;
	return mood === 'sleep' ? GRID.sleep : GRID.idle;
};
export const walkerColor = (k: Colors, mood: Mood) =>
	mood === 'panic' ? k.ALERT : mood === 'walk' || mood === 'happy' ? k.ACCENT : mood === 'sleep' ? k.C3 : k.C4;

export const WalkerPixels: React.FC<{cw: number; mood: Mood; tick: number; palette: Palette}> = ({cw, mood, tick, palette}) => {
	const k = colors(palette);
	const grid = walkerGrid(mood, tick);
	const shake = mood === 'panic' && tick % 2 === 1 ? cw * 0.6 : 0;
	return (
		<div style={{position: 'relative', width: cw * 2, height: cw * 2, translate: `${shake}px 0`}}>
			{grid.map((row, r) =>
				row.map((on, c) =>
					on ? <div key={`${r}${c}`} style={{position: 'absolute', left: c * (cw / 2), top: r * cw, width: cw / 2, height: cw, background: walkerColor(k, mood)}} /> : null,
				),
			)}
		</div>
	);
};

export const Strip: React.FC<{cw: number; state: StripState}> = ({cw, state}) => {
	const k = colors(state.palette);
	const ch = cw * 2;
	const mood = state.mood ?? 'idle';
	const tick = state.tick ?? 0;
	const {placed, used} = stripLayout(state, state.cols);
	const cols = state.cols ?? used + 1;
	return (
		<div style={{position: 'relative', width: cols * cw, height: ch, background: k.BASE, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: used * cw,
					right: 0,
					top: 0,
					bottom: 0,
					backgroundImage: `repeating-conic-gradient(${k.C1} 0% 25%, transparent 0% 50%)`,
					backgroundSize: `${cw}px ${ch / 2}px`,
					opacity: 0.8,
				}}
			/>
			{placed.map(({item, x}) => (
				<div key={item.id} style={{position: 'absolute', left: x * cw, top: 0}}>
					{item.id === 'divider' ? (
						<div style={{position: 'absolute', left: cw / 2 - 1, top: 0, width: 2, height: ch, background: state.flash ? k.ACCENT : k.C3}} />
					) : (
						item.render(cw, k)
					)}
				</div>
			))}
			<div style={{position: 'absolute', left: cw, top: 0}}>
				<WalkerPixels cw={cw} mood={mood} tick={tick} palette={state.palette} />
			</div>
			{mood === 'happy' || mood === 'sleep' ? (
				<div style={{position: 'absolute', left: 3 * cw, top: 0, color: mood === 'happy' ? k.LIGHT : k.C4, ...font(cw)}}>
					{mood === 'happy' ? (tick % 2 ? '+' : '*') : tick % 2 ? 'Z' : 'z'}
				</div>
			) : null}
		</div>
	);
};
