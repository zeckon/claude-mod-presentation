import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Cap, CodeCard, dimc, Em, Shell, typed} from '../../kit';
import {C, MONO, ramp, SANS} from '../../theme';

const NOLIG: React.CSSProperties = {fontVariantLigatures: 'none'};

const CMD = '/history:enable';
const OFF = '/history:disable';

export const Enable: React.FC = () => {
	const f = useCurrentFrame();
	const out1 = ramp(f, 50, 60);
	const out2 = ramp(f, 62, 72);
	const reg = ramp(f, 118, 140);
	const newLine = ramp(f, 140, 156);
	const name = ramp(f, 228, 250);
	const part = (a: number) => ramp(f, a, a + 14);
	const off = f >= 306;
	const struck = ramp(f, 336, 350);
	return (
		<Shell n={2} q="WHICH PROJECTS DOES IT RECORD?">
			<div style={{position: 'absolute', left: 96, top: 150, opacity: ramp(f, 4, 20)}}>
				<CodeCard style={NOLIG} title="~/workspace/myproject  claude" width={1728} size={28}>
					<span style={{color: C.clay}}>{'> '}</span>
					{off ? typed(OFF, f, 306, 1) : typed(CMD, f, 16, 1.4)}
					{'\n'}
					<span style={{opacity: off ? ramp(f, 326, 334) : out1}}>{off ? 'history: disabled for /Users/me/workspace/myproject' : 'history: enabled for /Users/me/workspace/myproject'}</span>
					{'\n'}
					<span style={{opacity: off ? ramp(f, 334, 342) : out2}}>{off ? 'history: shadow repo preserved at ~/.claude-history/myproject-a3f9b2.git' : 'history: shadow repo at ~/.claude-history/myproject-a3f9b2.git'}</span>
				</CodeCard>
			</div>

			<div style={{position: 'absolute', left: 96, top: 470, opacity: reg, translate: `0 ${(1 - reg) * 20}px`}}>
				<CodeCard style={NOLIG} title="~/.claude-history/enabled-paths" width={820} size={28}>
					{dimc('/Users/me/workspace/blog')}
					{'\n'}
					<span style={{opacity: newLine * (1 - 0.6 * struck), color: C.clay, textDecoration: struck > 0.5 ? 'line-through' : 'none', background: newLine > 0 && newLine < 1 ? '#d9775733' : 'transparent'}}>/Users/me/workspace/myproject</span>
				</CodeCard>
				<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 30, color: C.dim, marginTop: 22, width: 820, lineHeight: 1.35, opacity: ramp(f, 160, 180)}}>
					Both hooks read this list. Not on it? They exit quietly.
				</div>
			</div>

			<div style={{position: 'absolute', left: 1000, top: 470, width: 824, opacity: name, translate: `0 ${(1 - name) * 20}px`}}>
				<div style={{fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: C.dim}}>ONE SHADOW REPO PER FOLDER</div>
				<div style={{fontFamily: MONO, fontSize: 46, fontWeight: 700, marginTop: 30, whiteSpace: 'nowrap'}}>
					<span style={{color: C.text, opacity: part(236)}}>myproject</span>
					<span style={{color: C.dim, opacity: part(246)}}>-</span>
					<span style={{color: C.clay, opacity: part(250)}}>a3f9b2</span>
					<span style={{color: C.dim, opacity: part(258)}}>.git</span>
				</div>
				<div style={{display: 'flex', gap: 36, marginTop: 18, fontFamily: SANS, fontWeight: 500, fontSize: 26, color: C.dim, lineHeight: 1.3}}>
					<div style={{width: 250, opacity: part(240), borderTop: `3px solid ${C.text}`, paddingTop: 10}}>folder name</div>
					<div style={{width: 360, opacity: part(254), borderTop: `3px solid ${C.clay}`, paddingTop: 10}}>
						first 6 hex of <span style={{fontFamily: MONO, color: C.clay}}>sha1($PWD)</span>
					</div>
				</div>
			</div>

			<Cap from={10} to={110} size={56}>Installing records nothing. Each project <Em>opts in</Em>.</Cap>
			<Cap from={118} to={222} size={56}>Enabling adds the folder to one list.</Cap>
			<Cap from={230} to={300} size={56}>Same name, different path? Different repo.</Cap>
			<Cap from={312} to={384} size={56}>
				<Em>/history:disable</Em> stops capture. The repo is kept.
			</Cap>
		</Shell>
	);
};
