import { useEffect, useRef, useState, type ReactNode } from "react";
import { PromptInput } from "./components/ui/ai-chat-input";
import { supportControls, task } from "./task";
import type { Session } from "./types";
import { ResponseActions, useLocalNarration } from "./ResponseActions";
import { AssistancePanel } from "./AssistancePanel";
import { ScenarioPanel } from "./ScenarioPanel";
import { languageCases, type LanguageCase } from "./language-cases";
import { LanguageCaseView } from "./LanguageCaseView";

export function ChatStudio({session, draft, setDraft, busy, responding, configured, model, source, configure, act, nextExample, showReview, exportRecord, activeCase, setActiveCase, caseVariant, setCaseVariant, onAnalyze, visible}: {
  visible:boolean;
  activeCase:LanguageCase|null; setActiveCase:(c:LanguageCase|null)=>void; caseVariant:"example"|"comparison"; setCaseVariant:(v:"example"|"comparison")=>void; onAnalyze:()=>void;
  session: Session; draft: string; setDraft: (value: string) => void;
  busy: boolean; responding: boolean; configured: boolean; model: string; source: ReactNode;
  configure: () => void; act: (operation: string, extra?: Record<string, unknown>) => Promise<void>;
  nextExample: boolean; showReview: () => void; exportRecord: () => void;
}) {
  const [caseControlsTarget,setCaseControlsTarget] = useState<HTMLDivElement|null>(null);
  const [playbackSelection,setPlaybackSelection] = useState(0);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [assistanceOpen, setAssistanceOpen] = useState(false);
  const [scenariosOpen, setScenariosOpen] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const narration = useLocalNarration();
  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = activeCase ? 0 : transcript.scrollHeight;
  }, [session.turns.length, session.phase, responding, activeCase]);
  const fixture = session.mode === "fixture";
  const finished = session.phase !== "eliciting";
  const stage = session.phase === "eliciting" ? 0 : session.phase === "final_response" ? 1 : session.phase === "review" ? 2 : 3;
  const requestSupport = (id: string) => {
    const control = supportControls.find(c => c.id === id);
    if (!control) return;
    setAssistanceOpen(false);
    setNotice("");
    void (fixture ? act("support", { actionId: id, preserveDraft: true }) : act("turn", { text: control.request, preserveDraft: true }));
  };
  return <section className={`gradient-studio ${activeCase || session.turns.length ? "with-messages" : "without-messages"}`} data-phase={session.phase} aria-label="Chat studio">
    <div className="studio-context">
      <span className={fixture || activeCase ? "" : "studio-live-label"}>{activeCase ? "Scripted playback · not live AI" : fixture ? "Scripted example · not live AI" : `Live AI · ${session.condition === "policy" ? "guided assessment" : "baseline"}`}</span>
      <button onClick={() => setSourceOpen(!sourceOpen)} aria-expanded={sourceOpen}>Passage & question ↗</button>
      <button onClick={configure}>{fixture ? configured ? "Switch to live AI" : "Live AI setup" : "Session settings"}</button>
    </div>
    {!activeCase && <ol className="studio-progress" aria-label="Conversation stages">
      {["Your ideas", "Final response", "Evidence review", "Learning note"].map((label, index) => <li key={label} data-reached={index <= stage} aria-current={index === stage ? "step" : undefined}><span className="studio-progress-track"/><span>{label}</span></li>)}
    </ol>}
    {assistanceOpen && <AssistancePanel onClose={() => setAssistanceOpen(false)} session={session} busy={busy} onRequest={requestSupport} showReview={showReview} openLearning={() => void act("learning")}/>}
    {scenariosOpen && <ScenarioPanel cases={languageCases} onClose={() => setScenariosOpen(false)} busy={busy || !!session.pending} onSelect={id => { setActiveCase(languageCases.find(c => c.id === id)!); setPlaybackSelection(n=>n+1); setScenariosOpen(false); setSourceOpen(false); narration.stop(); }}/>} 
    {sourceOpen && <aside className="studio-source-sheet"><button onClick={() => setSourceOpen(false)} aria-label="Close passage">Close ×</button>{source}</aside>}
    <div className="studio-workspace">
    <div ref={transcriptRef} className="studio-discussion">
      {activeCase ? <LanguageCaseView key={`${activeCase.id}:${caseVariant}:${playbackSelection}`} active={visible&&!sourceOpen&&!scenariosOpen&&!assistanceOpen} controlsTarget={caseControlsTarget} caseData={activeCase} variant={caseVariant} setVariant={setCaseVariant} onAnalyze={onAnalyze} onReturn={() => setActiveCase(null)}/> : <>
      <section className="studio-question-card" aria-labelledby="studio-question-heading">
        <div className="studio-question-heading">
          <span className="studio-question-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5.5C9 3.5 5 3.5 3 4.5v15c2-1 6-1 9 1 3-2 7-2 9-1v-15c-2-1-6-1-9 1Z"/><path d="M12 5.5v15"/></svg>
          </span>
          <h2 id="studio-question-heading">Your question</h2>
          <span className="studio-question-subject">Ethics</span>
        </div>
        <p className="studio-question-text">{task.question}</p>
        <div className="studio-question-footer">
          <span>Plato · Republic, Book II</span>
          <button onClick={() => setSourceOpen(true)} aria-expanded={sourceOpen}>Read passage <span aria-hidden="true">↗</span></button>
        </div>
      </section>
    {session.turns.length > 0 && <div className="studio-thread" role="log" aria-label="Conversation transcript" aria-live="polite">
      {session.turns.map(t => <article key={t.id} className={`studio-message ${t.role} ${t.phase === "learning" ? "post-help" : ""}`}><small>{t.tags.includes("authored_evaluation_prefix") ? `${t.role === "student" ? "Student" : "Guide"} · authored test setup` : t.tags.includes("authored_evaluation_input") ? "Student · authored test input" : t.role === "student" ? t.phase === "learning" ? "Your reflection · after content help" : t.tags.includes("final_response") ? fixture ? "Your final response · not interpreted" : "Your final response" : fixture ? "Student · scripted example" : "You" : <><span className="guide-avatar" aria-hidden="true"/>{t.actionId === "learning_note" ? "Learning note · authored content help" : `Conversation guide${fixture ? " · scripted" : ""}`}</>}</small><p>{t.text}</p>{t.role === "assistant" && <ResponseActions turn={t} feedback={session.responseFeedback?.find(f => f.turnId === t.id)} disabled={busy || !!session.pending} playing={narration.playingId === t.id} listen={() => narration.listen(t)} onFeedback={rating => void act("feedback", { feedback: {turnId:t.id, rating} })}/>}</article>)}
    </div>}
    {session.review && <section className="studio-completion-card" aria-label="Conversation completion"><span className="assistance-kicker">{session.phase === "learning" ? "A separate space to learn" : "This part is complete"}</span><h2>{session.phase === "learning" ? "Reflect, if you’d like." : "Your earlier responses are preserved."}</h2><p>{session.phase === "learning" ? "Your reflection is saved separately. It will not change the evidence from before the learning note." : "Review your exact words and support history, or open the optional learning note for content help."}</p>
      {fixture && session.turns.some(t => t.tags.includes("final_response") && t.tags.includes("needs_review")) && <p className="studio-custom-final-note">Your custom final response is saved but has not been interpreted. Authored observations apply only to the scripted turns.</p>}
      <div className="studio-completion-actions"><button onClick={showReview}>Evidence & support review ↗</button>{session.phase === "review" && <button disabled={busy || session.review.status !== "ready"} onClick={() => void act("learning")}>Open learning note</button>}<button onClick={exportRecord}>Export record</button></div>
      {session.review.status === "error" && <div className="studio-review-error"><p>The model review is unavailable. Retry the pending request above, or keep this record explicitly unreviewed.</p><button disabled={busy} onClick={() => void act("keep_unreviewed")}>Keep unreviewed record</button></div>}
    </section>}
    {responding && <div className="studio-thinking" role="status"><span className="thinking-dots" aria-hidden="true"><i/><i/><i/></span>{session.phase !== "eliciting" ? "Preparing your evidence review…" : "Considering your response…"}</div>}
    </>}
    </div>
    <div className="studio-chat-dock">
      <button className="studio-side-button studio-side-left" disabled={!!activeCase} onClick={() => setAssistanceOpen(true)} aria-label="Assistance" aria-haspopup="dialog"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/></svg><span className="studio-tool-tip">{activeCase ? "Return to your chat to request assistance" : "Assistance"}</span></button>
    <div className="studio-input-stage">
      {activeCase ? <div className="language-playback-target" ref={setCaseControlsTarget}/> : session.phase === "eliciting" ? <>
        <div className="reference-input">
          <PromptInput value={draft} onChange={setDraft} placeholder="Share your thinking…"
            models={[model]} efforts={["Default"]} disabled={busy || !!session.pending}
            onSubmit={async (message) => {
              if (fixture) { setNotice("This is a scripted example, not live AI. Open Live AI setup to send your own response."); return false; }
              setNotice(""); await act("turn", {text: message}); return false;
            }}/>
        </div>
        {notice && <p className="studio-input-notice" role="status">{notice}</p>}
        <div className="studio-shortcuts">
          {fixture && <button disabled={busy} onClick={() => void act(nextExample ? "advance" : "finish")}>{nextExample ? "Play scripted exchange" : "Finish example"}</button>}
          <button disabled={busy} onClick={() => void act("finish")}>Finish</button>
        </div>
      </> : session.phase === "final_response" ? <>
        <p className="studio-final-label">Your final response · optional</p>
        <div className="reference-input"><PromptInput value={draft} onChange={setDraft} placeholder="Your final response…" models={[model]} efforts={["Default"]} disabled={busy || !!session.pending} onSubmit={async message => {await act("finalize", {text:message}); return false;}}/></div>
        <div className="studio-shortcuts"><button disabled={busy} onClick={() => void act("finalize", {text:""})}>Use earlier responses</button><button disabled={busy || session.probes.length >= 3} onClick={() => void act("continue")}>Continue conversation</button></div>
      </> : session.phase === "learning" ? <>
        <p className="studio-final-label">Optional reflection · after content help</p>
        <div className="reference-input"><PromptInput value={draft} onChange={setDraft} placeholder="What would you add or reconsider?" models={[model]} efforts={["Default"]} disabled={busy} onSubmit={async message => {await act("reflection", {text:message}); return false;}}/></div>
        <div className="studio-shortcuts"><button onClick={showReview}>View unchanged earlier review</button></div>
      </> : <div className="studio-shortcuts"><button onClick={showReview}>Open evidence review ↗</button></div>}
      {!activeCase && narration.audioNotice && <p className="studio-input-notice" role="status">{narration.audioNotice}</p>}
      {!activeCase && !finished && <p className="studio-footnote">{fixture ? "Authored walkthrough · not live AI" : "AI can make mistakes · educational design is provisional"}</p>}
      {!activeCase && !fixture && <p className="studio-data-note">{session.phase === "learning" ? "Reflections stay in this local session and are not sent to the model." : "Sent to Google Gemini. Use synthetic text; free-tier chats may be used to improve Google’s products."}</p>}
    </div>
      <button className="studio-side-button studio-side-right" onClick={() => setScenariosOpen(true)} aria-label={`${languageCases.length} language cases`} aria-haspopup="dialog"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="7" width="13" height="14" rx="3"/><path d="M8 3h10a3 3 0 0 1 3 3v11M9 12h5M9 16h5"/></svg><span className="studio-tool-count" aria-hidden="true">{languageCases.length}</span><span className="studio-tool-tip">{languageCases.length} language cases</span></button>
    </div>
    </div>
  </section>;
}
