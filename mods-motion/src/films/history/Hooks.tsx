import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, Em, Shell, str} from '../../kit';
import {Hook, Loop} from '../../Loop';
import {C, MONO, ramp, SANS} from '../../theme';

const NOLIG: React.CSSProperties = {fontVariantLigatures: 'none'};

const HOOKS: Hook[] = [
	{name: 'UserPromptSubmit', angle: -40, at: 110},
	{name: 'Stop', angle: 225, at: 140},
];

const PX = 1080;
const PY = 210;
const PW = 744;

type Step = {t: number; text: React.ReactNode};

/** A hook's script and what it does, one step at a time. */
const Steps: React.FC<{f: number; o: number; hook: string; script: string; steps: Step[]}> = ({f, o, hook, script, steps}) => (
	<div style={{position: 'absolute', left: PX, top: PY, width: PW, opacity: o, translate: `0 ${(1 - Math.min(1, o * 1.5)) * 20}px`}}>
		<div style={{fontFamily: MONO, fontSize: 32, color: C.clay, whiteSpace: 'nowrap', fontVariantLigatures: 'none'}}>
			{hook}
			<span style={{color: C.dim}}>{'  ->  '}</span>
			<span style={{color: C.text}}>{script}</span>
		</div>
		<div style={{marginTop: 30}}>
			{steps.map((s, i) => {
				const p = ramp(f, s.t, s.t + 14);
				return (
					<div key={i} style={{display: 'flex', gap: 22, alignItems: 'flex-start', marginBottom: 24, opacity: p, translate: `${(1 - p) * 24}px 0`}}>
						<div style={{flex: 'none', width: 44, height: 44, borderRadius: 10, border: `2px solid ${C.clay}`, color: C.clay, fontFamily: MONO, fontSize: 24, lineHeight: '40px', textAlign: 'center', boxSizing: 'border-box'}}>{i + 1}</div>
						<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.35, color: C.text}}>{s.text}</div>
					</div>
				);
			})}
		</div>
	</div>
);

const m = (t: string) => <span style={{fontFamily: MONO, fontSize: 27, color: C.clay, fontVariantLigatures: 'none'}}>{t}</span>;

export const Hooks: React.FC = () => {
	const f = useCurrentFrame();
	const a = ramp(f, 30, 50) * (1 - ramp(f, 168, 182));
	const b = ramp(f, 184, 200) * (1 - ramp(f, 330, 344));
	const c = ramp(f, 346, 362);
	const accent = f >= 184 && f < 344 ? 'UserPromptSubmit' : f >= 346 ? 'Stop' : undefined;
	return (
		<Shell n={3} q="HOW DOES IT PLUG INTO CLAUDE CODE?">
			<Loop f={f} cx={530} cy={490} s={0.75} hooks={HOOKS} orbitAt={60} start={6} accentHook={accent} labels={ramp(f, 30, 60)} />

			<div style={{position: 'absolute', left: PX, top: PY, opacity: a, translate: `0 ${(1 - ramp(f, 30, 60)) * 20}px`}}>
				<CodeCard style={NOLIG} title="hooks/hooks.json" width={PW} size={24}>
					{str('"UserPromptSubmit"')}: [{'{'}
					{'\n  '}
					{str('"type"')}: {str('"command"')},
					{'\n  '}
					{str('"command"')}: {str('"bash .../hook-init.sh"')}
					{'\n'}
					{'}]'},
					{'\n'}
					{str('"Stop"')}: [{'{'}
					{'\n  '}
					{str('"type"')}: {str('"command"')},
					{'\n  '}
					{str('"command"')}: {str('"bash .../hook-commit.sh"')}
					{'\n'}
					{'}]'}
				</CodeCard>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.dim, marginTop: 26, width: PW, lineHeight: 1.35, opacity: ramp(f, 70, 90)}}>
					Plain shell scripts. Claude Code runs them at two points in every turn.
				</div>
			</div>

			<Steps
				f={f}
				o={b}
				hook="UserPromptSubmit"
				script="hook-init.sh"
				steps={[
					{t: 200, text: <>Is this folder in {m('enabled-paths')}? If not, exit.</>},
					{t: 228, text: <>Create the shadow repo if it is missing.</>},
					{t: 256, text: <>Save the prompt to {m('.last-prompt-<session>')}, so parallel sessions never mix.</>},
				]}
			/>

			<Steps
				f={f}
				o={c}
				hook="Stop"
				script="hook-commit.sh"
				steps={[
					{t: 362, text: <>{m('git add --all')} on your folder.</>},
					{t: 390, text: <>Build the message: prompt plus transcript.</>},
					{t: 418, text: <>{m('git commit')}, even when no file changed.</>},
					{t: 446, text: <>Push in the background, if you turned that on.</>},
				]}
			/>

			<Cap from={16} to={170} size={54}>Two classic <Em>hooks</Em> on the Claude Code loop.</Cap>
			<Cap from={190} to={334} size={54}>You send a prompt: it is <Em>written down</Em>.</Cap>
			<Cap from={352} to={532} size={54}>Claude stops: the folder is <Em>committed</Em>.</Cap>
		</Shell>
	);
};
