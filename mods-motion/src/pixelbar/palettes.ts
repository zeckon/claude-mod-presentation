export type Palette = {
	id: string;
	name: string;
	ground: number;
	tiles: number;
	labels: number;
	accent: number;
	values: number;
	alert: number;
};

// Copied from the pixelbar plugin (hooks/register.tsx).
export const PALETTES: readonly Palette[] = [
	{id: 'gameboy', name: 'Game Boy', ground: 0x0f380f, tiles: 0x306230, labels: 0x8bac0f, accent: 0x9bbc0f, values: 0xe0f8d0, alert: 0xff5050},
	{id: 'phosphor', name: 'Green phosphor', ground: 0x0b120c, tiles: 0x18301c, labels: 0x3f8f4c, accent: 0x39ff6a, values: 0xc8ffd2, alert: 0xffb000},
	{id: 'amber', name: 'Amber monitor', ground: 0x120c04, tiles: 0x2e1f08, labels: 0x9a6418, accent: 0xffb000, values: 0xffe2a8, alert: 0xff3b30},
	{id: 'slate', name: 'Cool slate', ground: 0x0e1116, tiles: 0x1f2733, labels: 0x5b6b82, accent: 0x7cc4ff, values: 0xdbe7f5, alert: 0xff6b5a},
	{id: 'clay', name: 'Clay', ground: 0x14100e, tiles: 0x3d2c24, labels: 0xa96a50, accent: 0xd97757, values: 0xf2cdbb, alert: 0xff5a36},
	{id: 'synthwave', name: 'Synthwave', ground: 0x140a1f, tiles: 0x2d1747, labels: 0x8a4fbf, accent: 0xff4fd8, values: 0xf3d9ff, alert: 0x2de2e6},
	{id: 'ocean', name: 'Ocean', ground: 0x071a1f, tiles: 0x0f3640, labels: 0x2a8a96, accent: 0x4fe0d0, values: 0xd4f7f2, alert: 0xff7a59},
	{id: 'ice', name: 'Ice', ground: 0x0c1418, tiles: 0x22343d, labels: 0x6f8f9c, accent: 0xbfe9ff, values: 0xf2fbff, alert: 0xff4d6d},
	{id: 'sepia', name: 'Sepia', ground: 0x17110b, tiles: 0x33261a, labels: 0x8c7254, accent: 0xd9b98c, values: 0xf5ead8, alert: 0xe0533d},
	{id: 'grayscale', name: 'Grayscale', ground: 0x0d0d0d, tiles: 0x262626, labels: 0x7a7a7a, accent: 0xe0e0e0, values: 0xffffff, alert: 0xff4040},
	{id: 'virtualboy', name: 'Virtual Boy', ground: 0x0a0000, tiles: 0x330000, labels: 0x8c0000, accent: 0xff2020, values: 0xffb3b3, alert: 0xffffff},
	{id: 'matrix', name: 'Matrix', ground: 0x000000, tiles: 0x002200, labels: 0x008f11, accent: 0x00ff41, values: 0xb8ffc8, alert: 0xff3b3b},
];

export const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;

export const mix = (a: number, b: number, t: number) => {
	const ch = (s: number) =>
		Math.round(((a >> s) & 0xff) * (1 - t) + ((b >> s) & 0xff) * t) << s;
	return ch(16) | ch(8) | ch(0);
};
