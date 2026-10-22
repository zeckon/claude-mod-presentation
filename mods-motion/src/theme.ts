import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadPixel} from '@remotion/google-fonts/Silkscreen';
import {Easing, interpolate} from 'remotion';

export const SANS = loadInter('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;
export const PIXEL = loadPixel('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;

export const C = {
	bg: '#0b0d10',
	panel: '#12151a',
	line: '#2b313b',
	dim: '#6c7686',
	text: '#eceef2',
	clay: '#d97757',
};

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 to 1 between frames a and b. */
export const ramp = (f: number, a: number, b: number, easing = OUT) =>
	interpolate(f, [a, b], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Piecewise interpolation of number rows: [frame, ...values]. */
export const keys = (f: number, rows: number[][], easing = INOUT): number[] => {
	if (f <= rows[0][0]) return rows[0].slice(1);
	for (let i = 1; i < rows.length; i++) {
		if (f <= rows[i][0]) {
			const t = easing(
				(f - rows[i - 1][0]) / Math.max(1, rows[i][0] - rows[i - 1][0]),
			);
			return rows[i].slice(1).map((v, k) => lerp(rows[i - 1][k + 1], v, t));
		}
	}
	return rows[rows.length - 1].slice(1);
};
