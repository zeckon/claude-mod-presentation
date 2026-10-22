import React from 'react';
import {MONO} from '../theme';
import {hex, mix, Palette} from './palettes';

export type Mood = 'idle' | 'walk' | 'happy' | 'panic' | 'sleep';

export type StripState = {
	palette: Palette;
	mood?: Mood;
	tick?: number;
	dir?: string;
	git?: string | null;
	diff?: string | null;
	commit?: string | null;
	stash?: number;
	/** The MODE tile's word (`DEFAULT`, `AUTO`, ...); null leaves the tile out. */
	modeLabel?: string | null;
	model?: string;
	effort?: number | null; // 0..4, null = AUTO
	ctx?: number;
	cache?: string | null;
	tok?: number[];
	h5?: number | null;
	session?: string;
	/** Section ids switched off with /pixelbar-sections. */
	hidden?: readonly string[];
	/** Columns of the strip; items drop out by priority when it is too narrow. */
	cols?: number;
};

export const DEFAULT_HIDDEN = ['commit', '7d', 'last', 'agents', 'tools', 'edits', 'compacts', 'hint'];
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

const EFFORT_BARS = 5;

const effortItem = (effort: number | null): Item => {
	if (effort === null) return tile('effort', 'EFFORT', 4, plain('AUTO'), 2);
	return {
		id: 'effort',
		w: EFFORT_BARS + 4,
		priority: 2,
		render: (cw, k) => (
			<div style={{position: 'absolute', left: 0, top: 0, width: (EFFORT_BARS + 4) * cw, height: cw * 2}}>
				<div style={{position: 'absolute', left: cw * 0.5, right: cw * 0.5, top: 0, bottom: 0, background: k.C2}} />
				{Array.from({length: EFFORT_BARS}).map((_, i) => (
					<div
						key={i}
						style={{position: 'absolute', left: (2 + i) * cw, bottom: 0, width: cw - 1, height: ((i + 1) / 8) * cw * 2, background: i <= effort ? k.LIGHT : k.C3}}
					/>
				))}
			</div>
		),
	};
};

/** Claude and session tiles (from the left), and project tiles (packed at the right end). */
const buildItems = (s: StripState): {left: Item[]; right: Item[]} => {
	const right: Item[] = [tile('dir', 'DIR', (s.dir ?? 'mods-motion').length, plain(s.dir ?? 'mods-motion'), 1)];
	if (s.git !== null) right.push(tile('git', 'GIT', (s.git ?? 'main *2').length, plain(s.git ?? 'main *2'), 1.5));
	if (s.diff) right.push(tile('diff', 'DIFF', s.diff.length, plain(s.diff), 3));
	if (s.commit) right.push(tile('commit', 'COMMIT', s.commit.length, plain(s.commit), 4));
	if (s.stash) right.push(tile('stash', 'STASH', `${s.stash}`.length, plain(`${s.stash}`), 5));

	const left: Item[] = [];
	const mode = s.modeLabel === undefined ? 'DEFAULT' : s.modeLabel;
	if (mode !== null) left.push(tile('mode', 'MODE', mode.length, plain(mode), 1));
	left.push(tile('model', 'MODEL', (s.model ?? 'OPUS 5.5').length, plain(s.model ?? 'OPUS 5.5'), 2));
	left.push(effortItem(s.effort === undefined ? 2 : s.effort));
	const pct = s.ctx ?? 42;
	left.push(gauge('ctx', 'CTX', pct, 6, 80, 1, ` ${compact(Math.round(pct * 2000))}/200K`));
	if (s.cache) left.push(tile('cache', 'CACHE', s.cache.length, plain(s.cache), 4));
	if (s.tok?.length) {
		const bars = s.tok.slice(-12);
		const max = Math.max(1, ...bars);
		left.push({
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
	if (s.h5 !== null && s.h5 !== undefined) left.push(gauge('5h', '5H', s.h5, 6, 90, 4));
	left.push(tile('session', 'SESSION', (s.session ?? '1h12m 7T $1.23').length, plain(s.session ?? '1h12m 7T $1.23'), 3));
	return {left, right};
};

const X0 = 5;

/**
 * The row's items placed in cells: Claude and session tiles from the left,
 * project tiles packed against the right end, the least important dropped
 * (the rightmost of the lowest rank, across both groups) until they fit.
 */
export const stripLayout = (s: StripState, cols?: number) => {
	const hidden = new Set(s.hidden ?? DEFAULT_HIDDEN);
	const {left, right} = buildItems(s);
	const lf = left.filter((i) => !hidden.has(i.id));
	const rt = right.filter((i) => !hidden.has(i.id));
	const sum = (l: Item[]) => l.reduce((n, i) => n + i.w + 1, 0);
	const natural = X0 + sum(lf) + 3 + sum(rt);
	const total = cols ?? natural;
	let list = [...lf, ...rt];
	while (list.length > 1 && X0 + sum(list) > total) {
		const worst = list.reduce((a, b) => (b.priority >= a.priority ? b : a));
		list = list.filter((i) => i !== worst);
	}
	const keptLeft = lf.filter((i) => list.includes(i));
	const keptRight = rt.filter((i) => list.includes(i));
	let x = X0;
	const placed = keptLeft.map((item) => {
		const at = x;
		x += item.w + 1;
		return {item, x: at};
	});
	const used = x;
	let rx = total - sum(keptRight) + 1;
	const placedRight = keptRight.map((item) => {
		const at = rx;
		rx += item.w + 1;
		return {item, x: at};
	});
	return {placed: [...placed, ...placedRight], used, rightStart: keptRight.length ? total - sum(keptRight) + 1 : total, cols: total, natural, ids: list.map((i) => i.id)};
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
	const {placed, used, rightStart, cols} = stripLayout(state, state.cols);
	return (
		<div style={{position: 'relative', width: cols * cw, height: ch, background: k.BASE, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: used * cw,
					width: Math.max(0, rightStart - 1 - used) * cw,
					top: 0,
					bottom: 0,
					backgroundImage: `repeating-conic-gradient(${k.C1} 0% 25%, transparent 0% 50%)`,
					backgroundSize: `${cw}px ${ch / 2}px`,
					opacity: 0.8,
				}}
			/>
			{placed.map(({item, x}) => (
				<div key={item.id} style={{position: 'absolute', left: x * cw, top: 0}}>
					{item.render(cw, k)}
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
