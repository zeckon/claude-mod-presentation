import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, Em, Shell, typed} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';
import {CT, Prompt} from './parts';

const ON1 = 28;
const ON2 = 106;
const DONE1 = ON1 + 32;
const DONE2 = ON2 + 38;
const END = 214;

const HookCard: React.FC<{f: number; y: number; name: string; on: string; what: string; at: number}> = ({f, y, name, on, what, at}) => {
	const lit = ramp(f, at, at + 10);
	return (
		<div style={{position: 'absolute', left: 1040, top: y, width: 784, height: 150, boxSizing: 'border-box', padding: '20px 28px', borderRadius: 16, background: C.panel, border: `2px solid ${lit > 0.5 ? C.clay : C.line}`, boxShadow: lit > 0.5 && f < at + 20 ? `0 0 40px ${C.clay}66` : undefined}}>
			<div style={{fontFamily: MONO, fontSize: 30, color: C.clay}}>
				{name}
				<span style={{color: C.dim, fontSize: 24}}>{'  on '}{on}</span>
			</div>
			<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.text, marginTop: 12}}>{what}</div>
			<div style={{position: 'absolute', right: 26, top: 26, fontFamily: MONO, fontWeight: 700, fontSize: 26, padding: '4px 16px', borderRadius: 20, color: lit > 0.5 ? '#0b0d10' : C.dim, background: lit > 0.5 ? '#8bd17c' : 'transparent', border: `2px solid ${lit > 0.5 ? '#8bd17c' : C.line}`}}>{lit > 0.5 ? 'ON' : 'OFF'}</div>
		</div>
	);
};

export const OptIn: React.FC = () => {
	const f = useCurrentFrame();
	const a = 1 - ramp(f, END - 14, END);
	const end = ramp(f, END + 4, END + 34);
	const cmd = f < ON2 - 8 ? '/devcontainers:sandbox-on' : '/devcontainers:autorebuild-on';
	const cmdAt = f < ON2 - 8 ? ON1 : ON2;
	const row = (t: string, at: number, opts: {hl?: boolean; dim?: boolean; note?: string} = {}) => (
		<div style={{opacity: ramp(f, at, at + 10), color: opts.dim ? C.dim : C.text, background: opts.hl && f < at + 40 ? '#d9775726' : 'transparent', margin: '0 -14px', padding: '0 14px', borderRadius: 8, translate: `${(1 - ramp(f, at, at + 14)) * -16}px 0`}}>
			{t}
			{opts.note ? <span style={{fontFamily: SANS, fontSize: 26, color: C.dim}}>{opts.note}</span> : null}
		</div>
	);
	return (
		<Shell n={6} q="IS ANY OF THIS ON BY DEFAULT?">
			<div style={{position: 'absolute', inset: 0, opacity: a}}>
				<div style={{position: 'absolute', left: 96, top: 150, opacity: ramp(f, ON1 - 10, ON1)}}>
					<Prompt key={cmd} f={f} at={cmdAt} text={cmd} size={30} width={820} />
				</div>
				<div style={{position: 'absolute', left: 110, top: 290, fontFamily: MONO, fontSize: 30, lineHeight: '64px', color: C.text, whiteSpace: 'pre', opacity: ramp(f, 6, 20)}}>
					<div style={{color: C.clay, fontWeight: 700}}>~/.claude-devcontainers/</div>
					{row('`-- webapp-3f9a1c/', DONE1)}
					{row('    |-- workspace-root', DONE1 + 6)}
					{row('    |-- sandbox-enabled', DONE1 + 12, {hl: true})}
					{row('    |-- sandbox-service', DONE1 + 22, {dim: true, note: '  if --service'})}
					{row('    `-- autorebuild-enabled', DONE2 + 4, {hl: true})}
				</div>
				<div style={{position: 'absolute', left: 110, top: 700, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: C.dim, opacity: ramp(f, DONE1 + 30, DONE1 + 44)}}>
					webapp = folder name, 3f9a1c = short hash of its path
				</div>
				<div style={{opacity: ramp(f, 4, 20)}}>
					<HookCard f={f} y={290} name="PreToolUse" on="Bash" what="sandbox: route Bash into the container" at={DONE1 + 12} />
					<HookCard f={f} y={480} name="PostToolUse" on="Edit | Write | MultiEdit" what="auto-rebuild on config edits" at={DONE2 + 4} />
				</div>
			</div>

			{f >= END - 4 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', opacity: end, translate: `0 ${(1 - end) * 20}px`}}>
					<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 140, color: CT, lineHeight: 1}}>devcontainers</div>
					<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 58, color: C.text, margin: '30px 0 40px'}}>
						Dev containers, run <Em>from Claude Code</Em>.
					</div>
					{['/plugin marketplace add zeckon/claude-plugins', '/plugin install devcontainers@zeckon-claude-plugins'].map((line, i) => (
						<div key={line} style={{fontFamily: MONO, fontSize: 34, color: C.text, background: C.panel, border: `2px solid ${C.line}`, borderRadius: 12, padding: '14px 28px', margin: '14px auto', width: 1200, textAlign: 'left', whiteSpace: 'pre'}}>
							<span style={{color: C.clay}}>{'> '}</span>
							{typed(line, f, END + 30 + i * 50, 1)}
						</div>
					))}
				</div>
			) : null}

			<Cap from={4} to={DONE1 - 2} size={54}>Out of the box, both hooks <Em>do nothing</Em>.</Cap>
			<Cap from={DONE1 + 4} to={DONE2 - 4} size={54}>Turning one on writes a <Em>flag file</Em>.</Cap>
			<Cap from={DONE2 + 4} to={END - 8} size={54}>One folder per workspace, outside your repo.</Cap>
		</Shell>
	);
};
