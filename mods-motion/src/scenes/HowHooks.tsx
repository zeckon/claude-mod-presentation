import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, dimc, Em, kw, Shell, str} from '../kit';
import {Hook, Loop} from '../Loop';
import {C, MONO, ramp, SANS} from '../theme';

const HOOKS: Hook[] = [
	{name: 'prompt.submit', angle: -60, at: 150},
	{name: 'turn.start', angle: -28, at: 180},
	{name: 'tool.call', angle: 55, at: 210},
	{name: 'turn.complete', angle: 135, at: 240},
	{name: 'ui.render', angle: 225, at: 270},
];

export const HowHooks: React.FC = () => {
	const f = useCurrentFrame();
	const accent = f >= 450 ? 'ui.render' : undefined;
	const a = ramp(f, 300, 320) * (1 - ramp(f, 440, 456));
	const b = ramp(f, 450, 472);
	return (
		<Shell n={6} q="HOW CAN A PLUGIN DRAW THERE?">
			<Loop f={f} cx={600} cy={500} s={0.82} hooks={HOOKS} orbitAt={70} start={10} accentHook={accent} labels={ramp(f, 40, 70)} />

			<div style={{position: 'absolute', left: 1080, top: 250, opacity: a, translate: `0 ${(1 - ramp(f, 300, 330)) * 20}px`}}>
				<CodeCard title="a hook handler" width={780} size={25}>
					{kw('on')}({str("'turn.start'")}, {kw('async')} ($, e, next) {'=> {'}
					{'\n'}
					{dimc('  mood.isWorking = true')}
					{'\n'}
					<span style={{background: ramp(f, 360, 380) * (1 - ramp(f, 436, 446)) > 0 ? '#d9775744' : 'transparent'}}>{'  '}{kw('return')} next(e)</span>
					{'\n'}
					{'})'}
				</CodeCard>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.text, marginTop: 28, lineHeight: 1.35, opacity: ramp(f, 330, 350)}}>
					Subscribe to an event, run your code.
					<div style={{opacity: ramp(f, 380, 400), color: C.dim}}>
						<span style={{fontFamily: MONO, color: C.clay}}>next(e)</span> hands the event on, so Claude Code carries on.
					</div>
				</div>
			</div>

			<div style={{position: 'absolute', left: 1080, top: 250, opacity: b, translate: `0 ${(1 - b) * 20}px`}}>
				<CodeCard title="a hook that draws" width={780} size={25}>
					{kw('on')}({str("'ui.render'")},
					{'\n'}
					{'   { component: '}
					{str("'PromptHint'")}
					{' },'}
					{'\n'}
					{'   '}
					{kw('async')} ($, e, next) {'=> {'}
					{'\n'}
					{dimc('  // return a different picture')}
					{'\n'}
					{'})'}
				</CodeCard>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 34, color: C.text, marginTop: 28, lineHeight: 1.35, opacity: ramp(f, 490, 510)}}>
					Most hooks listen. <span style={{fontFamily: MONO, color: C.clay}}>ui.render</span> can replace part of the screen.
				</div>
			</div>

			<Cap from={20} to={130} size={54}>pixelbar is a <Em>mod</Em>: a plugin that hooks into Claude Code.</Cap>
			<Cap from={150} to={290} size={54}>Every step fires an <Em>event</Em>. Each one is a hook point.</Cap>
			<Cap from={330} to={440} size={54}>A mod subscribes with <Em>on(...)</Em>.</Cap>
			<Cap from={466} to={590} size={54}>One hook is special: it can <Em>draw</Em>.</Cap>
		</Shell>
	);
};
