import { useEffect, useRef, useState } from "react";
import { languageCases } from "./language-cases";
import { detectorCategories, languageStatusLabels, targetKey, type AnalysisTarget, type LanguageAnalysis, type LanguageObservation, type StudentContext } from "./language-analysis";
import type { Session } from "./types";
export async function languageAPI<T>(url:string,body?:unknown):Promise<T> {
  const r=await fetch(url,body?{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:undefined);
  const v=await r.json();if(!r.ok)throw new Error(v.error??"The local request failed.");return v;
}
const level=(n:number|null)=>n===null?"Not provided":`Level ${n}`;
function ObservationCard({o,record,onDecision,onEvidence}:{o:LanguageObservation;record:LanguageAnalysis;onDecision:(id:string,action:string,wording:string,note:string)=>Promise<void>;onEvidence:()=>void}) {
  const [editing,setEditing]=useState(false),[wording,setWording]=useState(o.explanation),[note,setNote]=useState(""),[saving,setSaving]=useState(false),[error,setError]=useState("");
  const decision=[...record.decisions].reverse().find(d=>d.observationId===o.id);
  async function save(action:string) {setSaving(true);setError("");try{await onDecision(o.id,action,wording,note);setEditing(false);}catch(e){setError((e as Error).message);}finally{setSaving(false);}}
  return <article className="language-observation-card">
    <div className="observation-tags"><span>{o.categoryId} · {languageStatusLabels[o.status]}</span><span>{o.resolution==="repaired"?"Repaired later in this transcript":decision?`Teacher ${decision.action}`:"Awaiting teacher review"}</span></div>
    <h3>{o.title}</h3>{o.studentSpans.map((s,i)=><blockquote key={i}>“{s.quote}” <small>Student · {s.turnId}</small></blockquote>)}
    <p><strong>AI suggestion:</strong> {o.explanation}</p><p className="observation-uncertainty"><strong>Uncertain:</strong> {o.uncertainty}</p>
    {o.repairSpans.map((s,i)=><blockquote className="repair-evidence" key={i}>Later student repair: “{s.quote}”</blockquote>)}
    {decision&&<div className="teacher-decision"><strong>Teacher {decision.action}</strong>{decision.action==="edited"&&<p>{decision.wording}</p>}{decision.note&&<p>{decision.note}</p>}<small>The original AI suggestion remains above.</small></div>}
    <details><summary>Source, context & assistance</summary>
      {o.sourceSpans.map((s,i)=><blockquote key={i}>{s.paragraphId==="question"?"Task question":s.paragraphId}: “{s.quote}”</blockquote>)}
      {o.contextTurnIds.map(id=><p key={id}><strong>{record.snapshot.turns.find(t=>t.id===id)?.role} · {id}</strong> {record.snapshot.turns.find(t=>t.id===id)?.text}</p>)}
      {o.assistanceIds.length?o.assistanceIds.map(id=>{const a=record.snapshot.assistance.find(a=>a.id===id)!;return <p key={id}><strong>Earlier support · {a.category}</strong> {a.text} <small>({a.status})</small></p>;}):<p>No recorded assistance before the cited response.</p>}
      <p>Assistance records conditions; it does not imply a penalty or prove copying.</p>
    </details>
    <div className="observation-actions"><button onClick={onEvidence}>View evidence</button><button disabled={saving} onClick={()=>void save("confirmed")}>Confirm</button><button disabled={saving} onClick={()=>void save("dismissed")}>Dismiss</button><button disabled={saving} onClick={()=>setEditing(!editing)}>Edit suggestion</button></div>
    {editing&&<form onSubmit={e=>{e.preventDefault();void save("edited");}}><label>Teacher wording<textarea value={wording} onChange={e=>setWording(e.target.value)} required maxLength={3000}/></label><label>Review note<textarea value={note} onChange={e=>setNote(e.target.value)} maxLength={3000}/></label><button disabled={saving}>Save teacher edit</button></form>}
    {error&&<p role="alert">{error}</p>}
  </article>;
}
export function LanguageObservations({session,context,target,onTarget,openChat,configure,exportRecord}:{session:Session;context:StudentContext;target:AnalysisTarget;onTarget:(t:AnalysisTarget)=>void;openChat:()=>void;configure:()=>void;exportRecord:()=>void}) {
  const [records,setRecords]=useState<LanguageAnalysis[]>([]),[selectedRun,setSelectedRun]=useState(""),[error,setError]=useState(""),[sending,setSending]=useState(false),[focus,setFocus]=useState<LanguageObservation|null>(null),[transport,setTransport]=useState<{sessionId:string;target:AnalysisTarget;requestId:string;context:StudentContext}|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [requestError,setRequestError]=useState("");
  const lock=useRef(false),evidenceRef=useRef<HTMLDivElement>(null);
  const key=targetKey(target),supported=target.kind==="conversation"||(detectorCategories as readonly string[]).includes(target.caseId);
  useEffect(()=>{let active=true;const read=()=>languageAPI<{analyses:LanguageAnalysis[]}>(`/api/language?sessionId=${session.id}`).then(v=>{if(active){setRecords(v.analyses);setLoaded(true);setError("");}}).catch(e=>{if(active)setError(e.message);});void read();const timer=setInterval(()=>void read(),1500);return()=>{active=false;clearInterval(timer);};},[session.id]);
  useEffect(()=>{setFocus(null);setSelectedRun("");},[key]);
  useEffect(()=>{if(focus){const anchor=evidenceRef.current?.querySelector<HTMLElement>(".highlighted-evidence")??evidenceRef.current;anchor?.scrollIntoView({block:"center",behavior:"smooth"});anchor?.focus();}},[focus]);
  const runs=records.filter(r=>targetKey(r.target)===key),r=runs.find(r=>r.id===selectedRun)??runs.at(-1);
  const pending=r?.state==="analyzing";
  async function analyze(retry=false) {
    if(lock.current||pending)return;lock.current=true;setSending(true);setRequestError("");
    const body=retry&&transport?transport:{sessionId:session.id,target,requestId:crypto.randomUUID(),context};
    try{const value=await languageAPI<LanguageAnalysis>("/api/language/analyze",body);setRecords(prev=>[...prev.filter(r=>r.id!==value.id),value]);setSelectedRun(value.id);setTransport(null);setFocus(null);}catch(e){setRequestError((e as Error).message);setTransport(body);}finally{lock.current=false;setSending(false);}
  }
  async function decision(id:string,action:string,wording:string,note:string){if(!r)return;const v=await languageAPI<LanguageAnalysis>("/api/language/review",{sessionId:session.id,analysisId:r.id,decision:{requestId:crypto.randomUUID(),observationId:id,action,wording,note}});setRecords(prev=>prev.map(item=>item.id===v.id?{...v,changed:item.changed}:item));}
  const caseData=target.kind==="case"?languageCases.find(c=>c.id===target.caseId):null;
  return <section className="language-observations-page" aria-label="Language observations">
    <header className="observations-heading"><div><span className="assistance-kicker">Teacher view · existing conversation only</span><h1>Language observations</h1><p>Evidence to inspect, not a diagnosis. Analysis never adds student questions or changes the conversation.</p></div><button onClick={openChat}>Back to conversation</button></header>
    <div className="teacher-context-summary"><div><strong>Illinois · WIDA</strong><span>Writing: {level(context.writing)} · Reading: {level(context.reading)}</span><small>Teacher-provided context · simulated profile · withheld from AI</small></div><button onClick={configure}>Edit student context</button></div>
    <div className="analysis-controls"><label>Conversation to inspect<select value={target.kind==="conversation"?"conversation":target.caseId} onChange={e=>onTarget(e.target.value==="conversation"?{kind:"conversation"}:{kind:"case",caseId:e.target.value,variant:"example"})}><option value="conversation">Current conversation</option>{languageCases.map(c=><option key={c.id} value={c.id}>{c.id} · {c.title}</option>)}</select></label>{target.kind==="case"&&<label>Separate transcript<select value={target.variant} onChange={e=>onTarget({...target,variant:e.target.value as "example"|"comparison"})}><option value="example">Authored example</option><option value="comparison">Separate comparison</option></select></label>}
      <button className="picker-primary" disabled={!loaded||!supported||sending||pending||!!transport} onClick={()=>void analyze()}>{pending||sending?"Analyzing…":"Analyze conversation"}</button><button onClick={exportRecord}>Export record</button></div>
    <p className="analysis-privacy">Explicit live request to Google Gemini; use synthetic text. No automatic reruns. Grades 9–12 · provisional task assumption.</p>
    {caseData&&<details className="authored-expectation"><summary>Authored expectation · not an AI result</summary><p>{caseData[target.kind==="case"?target.variant:"example"].observation}</p><p>{caseData.watchFor}</p></details>}
    {!supported&&<p className="analysis-state">Live detection for this pattern is not implemented. {caseData?.scope==="not_elicited"?"The current task does not adequately elicit this category.":"The authored example and comparison remain available in Chat studio."}</p>}
    {error&&<div className="analysis-state error" role="alert">{error}</div>}
    {transport&&<div className="analysis-state error" role="alert">Request for {targetKey(transport.target)} could not be confirmed: {requestError} The saved request stays attached to that transcript. <button disabled={sending} onClick={()=>void analyze(true)}>Retry same analysis request</button></div>}
    {!loaded&&<p role="status">Loading saved analysis records…</p>}
    {runs.length>1&&<label className="analysis-run-choice">Analysis history<select value={r?.id} onChange={e=>{setSelectedRun(e.target.value);setFocus(null);}}>{[...runs].reverse().map((run,i)=><option key={run.id} value={run.id}>Run {runs.length-i} · {new Date(run.requestedAt).toLocaleTimeString()} · {run.state}</option>)}</select></label>}
    {!r&&supported&&loaded&&<p className="analysis-state">Not analyzed. Choose Analyze conversation when the existing text is ready.</p>}
    {r&&<>
      {r.changed&&<p className="analysis-state stale">Conversation changed since this analysis. These observations and decisions belong to the earlier snapshot.</p>}
      {(r.contextAtRequest.writing!==context.writing||r.contextAtRequest.reading!==context.reading)&&<p className="analysis-context-note">Context when requested: Writing {level(r.contextAtRequest.writing)} · Reading {level(r.contextAtRequest.reading)}. Changing settings does not change findings or send a request.</p>}
      <div className={`analysis-state${r.state==="failed"?" error":""}`} role="status">{r.state==="analyzing"?"Analyzing the saved transcript snapshot…":r.state==="failed"?`Analysis failed. ${r.error}`:r.state==="insufficient"?`Insufficient input. ${r.inputStatus}`:r.state==="none"?"No supported observations were returned. This is not proof of mastery.":`Results available · ${r.observations.length} suggestions: ${r.observations.filter(o=>o.status==="strength").length} strengths, ${r.observations.filter(o=>o.status!=="strength"&&o.resolution==="current").length} other current observations, ${r.observations.filter(o=>o.resolution==="repaired").length} repaired observations.`}</div>
      {r.state==="results"&&<p className="analysis-privacy">AI-generated suggestions requiring teacher review. Exact quotes were checked; interpretation may still be wrong. Categories are proposed, not official WIDA codes.</p>}
      {r.observations.map(o=><ObservationCard key={`${r.id}:${o.id}`} o={o} record={r} onDecision={decision} onEvidence={()=>setFocus(o)}/>)}
      {focus&&<div className="analysis-evidence" ref={evidenceRef} tabIndex={-1} aria-label="Highlighted evidence in analysis snapshot"><div className="observations-heading"><h2>Evidence in the saved conversation</h2><button onClick={()=>setFocus(null)}>Close evidence</button></div>{r.snapshot.turns.map(t=>{const spans=[...focus.studentSpans,...focus.repairSpans].filter(s=>s.turnId===t.id);return <article key={t.id} tabIndex={spans.length?-1:undefined} className={spans.length?"highlighted-evidence":""}><small>{t.role==="student"?"Student":"Guide"} · {t.id}</small><p>{highlightSpans(t.text,spans.map(s=>s.quote))}</p></article>;})}<p>Snapshot captured {new Date(r.requestedAt).toLocaleString()}. The live conversation was not changed.</p></div>}
    </>}
  </section>;
}

function highlightSpans(text:string,quotes:string[]) {
  const ranges=quotes.map(q=>({start:text.indexOf(q),end:text.indexOf(q)+q.length})).filter(r=>r.start>=0).sort((a,b)=>a.start-b.start);
  const merged:{start:number;end:number}[]=[];
  for(const r of ranges){const last=merged.at(-1);if(last&&r.start<=last.end)last.end=Math.max(last.end,r.end);else merged.push({...r});}
  let cursor=0;const parts:(string|React.ReactElement)[]=[];
  for(const r of merged){parts.push(text.slice(cursor,r.start),<mark key={r.start}>{text.slice(r.start,r.end)}</mark>);cursor=r.end;}
  parts.push(text.slice(cursor));return parts;
}
