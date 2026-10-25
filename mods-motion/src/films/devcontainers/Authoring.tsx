import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, Em, Shell, str} from '../../kit';
import {C, ramp} from '../../theme';
import {Prompt, Tag, Tick} from './parts';

const STEPS = [
	{cmd: '/devcontainers:init', at: 22, note: 'detected pnpm-lock.yaml'},
	{cmd: '/devcontainers:add-feature github-cli', at: 168, note: 'next: /devcontainers:rebuild'},
	{cmd: '/devcontainers:lint', at: 290, note: 'OK / WARN / FAIL per check'},
	{cmd: '/devcontainers:upgrade', at: 392, note: '--apply edits the tags'},
];
const ADD = 222;
const LINT = 318;
const UPG = 418;

const LH = 40;

type Line = {k: string; body: React.ReactNode; at: number; tag?: React.ReactNode; hl?: [number, number]};

export const Authoring: React.FC = () => {
	const f = useCurrentFrame();
	const step = STEPS.filter((s) => f >= s.at - 8).pop() ?? STEPS[0];
	const stepIn = ramp(f, step.at - 8, step.at);
	const ok = (i: number) => (
		<span style={{opacity: ramp(f, LINT + i * 10, LINT + i * 10 + 10) * (1 - ramp(f, UPG - 14, UPG - 4)), display: 'inline-flex', alignItems: 'center', gap: 6}}>
			<Tick size={30} p={ramp(f, LINT + i * 10, LINT + i * 10 + 12)} />
			<Tag text="OK" color="#8bd17c" />
		</span>
	);
	const up = (i: number) => <Tag text="tag vs latest" opacity={ramp(f, UPG + 6 + i * 10, UPG + 16 + i * 10)} />;
	const feat = (name: string) => str(`"ghcr.io/devcontainers/features/${name}"`);
	const lines: Line[] = [
		{k: 'o', body: '{', at: 60},
		{k: 'name', body: <>{'  '}{str('"name"')}: {str('"webapp-dev"')},</>, at: 68},
		{k: 'image', body: <>{'  '}{str('"image"')}: {str('"mcr.microsoft.com/devcontainers/javascript-node:1-22"')},</>, at: 76, tag: ok(0)},
		{k: 'feat', body: <>{'  '}{str('"features"')}: {'{'}</>, at: 84, tag: ok(1)},
		{k: 'cu', body: <>{'    '}{feat('common-utils:2')}: {'{}'},</>, at: 92, tag: up(0)},
		{k: 'git', body: <>{'    '}{feat('git:1')}: {'{}'}{f >= ADD ? ',' : ''}</>, at: 100, tag: up(1)},
		{k: 'gh', body: <>{'    '}{feat('github-cli:1')}: {'{}'}</>, at: ADD, tag: <>{f < LINT - 10 ? <Tag text="shorthand -> full ref" opacity={ramp(f, ADD + 14, ADD + 26) * (1 - ramp(f, LINT - 16, LINT - 8))} /> : up(2)}</>, hl: [ADD, LINT - 12]},
		{k: 'c', body: '  },', at: 108},
		{k: 'post', body: <>{'  '}{str('"postCreateCommand"')}: {str('"pnpm install --frozen-lockfile"')},</>, at: 116, tag: <>{f < LINT - 10 ? <Tag text="from pnpm-lock.yaml" opacity={ramp(f, 128, 140) * (1 - ramp(f, 160, 170))} /> : ok(2)}</>, hl: [128, 168]},
		{k: 'user', body: <>{'  '}{str('"remoteUser"')}: {str('"vscode"')}</>, at: 124, tag: ok(3)},
		{k: 'e', body: '}', at: 132},
	];

	return (
		<Shell n={2} q="HOW DO YOU WRITE ONE?">
			<div style={{position: 'absolute', left: 310, top: 128, opacity: stepIn * ramp(f, 6, 20)}}>
				<Prompt key={step.cmd} f={f} at={step.at} text={step.cmd} width={1300}>
					<span style={{marginLeft: 'auto', fontSize: 24, color: C.dim, opacity: ramp(f, step.at + step.cmd.length * 1.2 + 4, step.at + step.cmd.length * 1.2 + 16)}}>{step.note}</span>
				</Prompt>
			</div>

			<div style={{position: 'absolute', left: 310, top: 236, opacity: ramp(f, 54, 66)}}>
				<CodeCard title=".devcontainer/devcontainer.json" width={1300} size={26}>
					{lines.map((l) => {
						const p = ramp(f, l.at, l.at + 10);
						const grow = l.k === 'gh' ? ramp(f, ADD, ADD + 14) : 1;
						if (grow <= 0) return null;
						const hl = l.hl && f >= l.hl[0] && f < l.hl[1];
						return (
							<div key={l.k} style={{position: 'relative', height: LH * grow, lineHeight: `${LH}px`, opacity: p, overflow: 'hidden', background: hl ? '#d9775726' : 'transparent', margin: '0 -24px', padding: '0 24px'}}>
								{l.body}
								{l.tag ? <div style={{position: 'absolute', right: 20, top: 0, height: LH, display: 'flex', alignItems: 'center'}}>{l.tag}</div> : null}
							</div>
						);
					})}
				</CodeCard>
			</div>

			<Cap from={24} to={160}><Em>init</Em> reads the project and writes a config.</Cap>
			<Cap from={172} to={284}><Em>add-feature</Em> turns a short name into a pinned ref.</Cap>
			<Cap from={294} to={386}><Em>lint</Em> checks it against a best-practice list.</Cap>
			<Cap from={396} to={452}><Em>upgrade</Em> compares tags with the latest release.</Cap>
			<Cap from={456} to={506}>Writing the config needs no Docker.</Cap>
		</Shell>
	);
};
