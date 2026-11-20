import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { detectorCategories } from "./language-analysis";
import { caseStatusLabels, type LanguageCase } from "./language-cases";
import { task } from "./task";

export function LanguageCaseView({ caseData, onReturn, variant, setVariant, onAnalyze, active, controlsTarget }: {
  caseData: LanguageCase; onReturn: () => void;
  variant:"example"|"comparison"; setVariant:(v:"example"|"comparison")=>void;
  onAnalyze:()=>void; active:boolean; controlsTarget:HTMLElement|null;
}) {
  const current = caseData[variant];
  // Playback changes presentation only. The authored transcript and analysis snapshot stay intact.
  const messages = useMemo(() => [
    {role:"assistant" as const, text:task.question, label:"Guide · fixed task question", id:`${caseData.id}-${variant}-question`},
    ...current.prior.map((turn,index) => ({...turn, label:`${turn.role === "student" ? "Student" : "Guide"} · scripted turn ${index+1}${turn.assistance === "substantive" ? " · substantive help" : ""}`, id:`${caseData.id}-${variant}-prior-${index}`})),
    ...(current.studentText ? [{role:"student" as const, text:current.studentText, label:`Student · scripted turn ${current.prior.length+1}`, id:`${caseData.id}-${variant}-response`}] : []),
  ], [caseData.id, variant, current]);
  const [playback,setPlayback] = useState({shown:1,playing:true});
  const newest = useRef<HTMLElement>(null);
  const complete = playback.shown > messages.length;
  const playing = playback.playing && active && !complete;
  useEffect(() => {
    if (!playing) return;
    const text = messages[Math.min(playback.shown,messages.length)-1].text;
    const delay = Math.min(3600,Math.max(1600,700+text.split(/\s+/).length*45));
    const timer = window.setTimeout(() => setPlayback(p=>({...p,shown:Math.min(p.shown+1,messages.length+1)})),delay);
    return () => window.clearTimeout(timer);
  }, [playback, playing, messages]);
  useEffect(() => {
    if (active) newest.current?.scrollIntoView({block:"nearest",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});
  }, [playback.shown, active]);
  const controls = <div className="language-case-dock language-playback-controls" aria-label="Scripted playback controls">
    <div className="language-playback-status"><span className={playing?"playback-indicator playing":"playback-indicator"} aria-hidden="true"/><span>{complete?"Playback complete":playing?"Playing scripted conversation":"Playback paused"}</span><span>{Math.min(playback.shown,messages.length)} / {messages.length}</span></div>
    <div className="language-playback-buttons">
      {!complete&&<button className="playback-primary" onClick={()=>setPlayback(p=>({...p,playing:!p.playing}))}>{playback.playing?"Pause":"Resume"}</button>}
      {!complete&&<button onClick={()=>setPlayback(p=>({shown:Math.min(p.shown+1,messages.length+1),playing:false}))}>{playback.shown===messages.length?"Show review":"Next response"}</button>}
      <button onClick={()=>setPlayback({shown:1,playing:true})}>Replay</button>
      {complete&&<button className="playback-primary" onClick={onAnalyze}>Language observations ↗</button>}
    </div>
    <p>Authored example · not live AI</p>
  </div>;
  return <div className="language-case-view">
    <section className="studio-scenario-banner" aria-label="Language case">
      <span className="assistance-kicker">{caseData.id} · {caseData.group}</span>
      <h2>{caseData.title}</h2>
      <p>Scripted conversation · responses appear one at a time.</p>
      <div><button onClick={onReturn}>← Return to your conversation</button></div>
    </section>
    <div className="language-case-variants" role="group" aria-label="Case example selection">
      <button aria-pressed={variant === "example"} onClick={() => setVariant("example")}>Example</button>
      <button aria-pressed={variant === "comparison"} onClick={() => setVariant("comparison")}>Comparison</button>
    </div>
    <details className="language-case-context"><summary>Case context & limits</summary>
      <p>{caseData.focus}</p>
      <p>{variant === "example" ? caseData.context : "This is a separate, alternative transcript, not a continuation of the example."}</p>
      {caseData.scope === "not_elicited" && <p className="picker-warning">Not elicited by this task. This case checks when to withhold a flag.</p>}
      {!(detectorCategories as readonly string[]).includes(caseData.id)&&<p>Live detection for this pattern is not implemented.</p>}
    </details>
    <div className="studio-thread" role="log" aria-label={`${caseData.id} authored ${variant} transcript`} aria-live="polite" aria-relevant="additions">
      {messages.slice(0,playback.shown).map((turn,index) => <article ref={index===Math.min(playback.shown,messages.length)-1&&!complete?newest:undefined} key={turn.id} id={turn.id} className={`studio-message playback-message ${turn.role}`}>
        <small>{turn.role === "assistant"&&<span className="guide-avatar" aria-hidden="true"/>}{turn.label}</small>
        <p>{turn.text}</p>
      </article>)}
    </div>
    {complete&&<section ref={newest} className="language-case-observation playback-message" aria-label="Authored review guidance">
      {!current.studentText&&<div className="language-case-missing" role="note">Response text unavailable. This is a missing-input simulation, not a student's words.</div>}
      <span className="assistance-kicker">Authored expectation · not an AI result</span>
      <h3>{caseStatusLabels[current.status]}</h3>
      <p>{current.observation}</p>
      <p className="language-case-scope-note">For this pattern only, not a judgment of the whole answer. Needs educator review.</p>
      {caseData.scope === "not_elicited"&&<p className="picker-warning">The current task does not elicit this category.</p>}
      <details className="scenario-prefix"><summary>Evidence boundaries & research basis</summary>
        <p><strong>Watch for</strong>{caseData.watchFor}</p>
        {caseData.sourceIds.map(id => <p key={id}><strong>Source paragraph {id}</strong>{task.passages.find(p => p.id === id)!.text}</p>)}
        <p><strong>Research basis</strong>{caseData.basis}</p>
        <p>These cases are not official WIDA error codes or evidence of mistakes common to a proficiency level. The same task and response should receive the same observation regardless of the student's recorded level.</p>
      </details>
    </section>}
    {controlsTarget&&createPortal(controls,controlsTarget)}
  </div>;
}
