import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { criteria, states, task, type Criterion } from "./task";
import type {
  Condition,
  Dialogue,
  Mode,
  Session,
  SupportEvent,
  Evidence,
} from "./types";
import { HumanitiesDashboard } from "./HumanitiesDashboard";
import "./styles.css";
import { StudentContextSettings } from "./StudentContextSettings";
import { LanguageObservations, languageAPI } from "./LanguageObservations";
import { defaultStudentContext, type StudentContext, type AnalysisTarget } from "./language-analysis";
import { languageCases, type LanguageCase } from "./language-cases";
import "./language-observations.css";
import { ChatStudio } from "./ChatStudio";
import "./dashboard-theme.css";
import "./card-picker.css";
import "./prompt-utilities.css";

type Config = {
  configured: boolean;
  credentialsConfigured: boolean;
  freeTierVerified: boolean;
  configurationMessage: string | null;
  modelId: string | null;
  generationSettings: Record<string, unknown>;
  dialogues: Dialogue[];
};
const human = (text: string) => text.replaceAll("_", " ");
const requestId = () => crypto.randomUUID();
async function api<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(
    url,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : undefined,
  );
  const data = await response.json();
  if (!response.ok)
    throw Object.assign(new Error(data.error ?? "Request failed."), {
      httpStatus: response.status,
    });
  return data;
}
function download(value: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Icon({ kind = "book", size = 20 }: { kind?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {kind === "book" ? (
        <>
          <path d="M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z" />
          <path d="M12 6v15" />
        </>
      ) : kind === "arrow" ? (
        <>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </>
      ) : kind === "download" ? (
        <>
          <path d="M12 3v12m-4-4 4 4 4-4M5 16v5h14v-5" />
        </>
      ) : kind === "check" ? (
        <path d="m5 12 4 4L19 6" />
      ) : kind === "lock" ? (
        <>
          <rect x="6" y="10" width="12" height="11" rx="2" />
          <path d="M9 10V6a3 3 0 0 1 6 0v4" />
        </>
      ) : (
        <>
          <path d="M4 7h16M4 17h16" />
          <circle cx="9" cy="7" r="3" fill="currentColor" />
          <circle cx="15" cy="17" r="3" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
function TaskPanel() {
  return (
    <aside className="task-panel" aria-label="Task and source passage">
      <div className="eyebrow">01 / Read & consider</div>
      <h2>A question of justice.</h2>
      <p className="context">{task.context}</p>
      <div className="source-heading">
        <span>The source</span>
        <span>Republic, Book II</span>
      </div>
      <div className="passages">
        {task.passages.map((p) => (
          <div className="passage" key={p.id}>
            <span className="passage-label">{p.id}</span>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
      <a
        className="attribution"
        href={task.sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        Plato · 358e–359a · Jowett translation ↗
      </a>
      <div className="question-card">
        <span className="eyebrow">Your question</span>
        <p>{task.question}</p>
      </div>
      <p className="adaptation">
        Adapted from the topic of Socra’s public ethics demo. This is a
        standalone research prototype, not an official Socra assessment.
      </p>
      <details className="assumptions">
        <summary>Provisional task assumptions</summary>
        <p>
          Grades 9–12 is a desk-testing assumption. Task fit, rubric, support
          permissions, and clarification equivalence await educator review. This
          activity cannot establish English proficiency, general ability,
          fairness, or learning gains. Speech is outside this version.
        </p>
      </details>
    </aside>
  );
}
function App() {
  const [config, setConfig] = useState<Config | null>(null),
    [session, setSession] = useState<Session | null>(null);
  const [page,setPage] = useState<"chat"|"language">("chat");
  const [activeCase,setActiveCase] = useState<LanguageCase|null>(null);
  const [caseVariant,setCaseVariant] = useState<"example"|"comparison">("example");
  const [studentContext,setStudentContext] = useState<StudentContext>(()=>{
    try {const v=JSON.parse(localStorage.getItem("humanities-student-context")??"null");if(v&&v.state==="Illinois"&&v.framework==="WIDA"&&[null,1,2,3,4,5,6].includes(v.writing)&&[null,1,2,3,4,5,6].includes(v.reading))return v;}catch{}
    return {...defaultStudentContext};
  });
  const contextRevision=useRef(Date.now());
  const [contextError,setContextError]=useState("");
  useEffect(()=>{
    localStorage.setItem("humanities-student-context",JSON.stringify(studentContext));
    if(session) void languageAPI("/api/language/context",{sessionId:session.id,context:studentContext,revision:++contextRevision.current}).then(()=>setContextError("")).catch(()=>setContextError("Student context could not be saved. Export will try saving it again."));
  },[studentContext,session?.id]);
  const analysisTarget:AnalysisTarget=activeCase?{kind:"case",caseId:activeCase.id,variant:caseVariant}:{kind:"conversation"};
  function chooseTarget(t:AnalysisTarget) {setActiveCase(t.kind==="case"?languageCases.find(c=>c.id===t.caseId)??null:null);setCaseVariant(t.kind==="case"?t.variant:"example");}
  const [reviewOpen, setReviewOpen] = useState(false);
  const [controls, setControls] = useState(false),
    [working, setBusy] = useState(false),
    [activeOperation, setActiveOperation] = useState(""),
    [error, setError] = useState(""),
    [draft, setDraft] = useState("");
  const [mode, setMode] = useState<Mode>("live"),
    [condition, setCondition] = useState<Condition>("policy"),
    [fixtureId, setFixtureId] = useState("D1"),
    [json, setJson] = useState<unknown | null>(null);
  const [transport, setTransport] = useState<Record<string, unknown> | null>(
    null,
  );
  const busy = working || !!transport;
  const errorNotice = useRef<HTMLDivElement>(null);
  const init = useRef(false);
  useEffect(() => {
    if (init.current) return;
    init.current = true;
    void (async () => {
      try {
        const c = await api<Config>("/api/config");
        setConfig(c);
        const resumeId=new URLSearchParams(window.location.search).get("session");
        if (resumeId) {
          const resumed=await api<Session>(`/api/session?sessionId=${encodeURIComponent(resumeId)}`);
          const stored=await languageAPI<{currentContext:StudentContext}>(`/api/language?sessionId=${encodeURIComponent(resumeId)}`);
          setStudentContext(stored.currentContext);setSession(resumed);setMode(resumed.mode);
        } else if (c.configured) setSession(
          await api<Session>("/api/sessions", {
            mode: "live",
            condition: "policy",
          }),
        );
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, []);
  useEffect(() => {
    if (error || session?.error) errorNotice.current?.focus();
  }, [error, session?.error, session?.attempts.length]);
  async function start() {
    setBusy(true);
    setError("");
    try {
      const s = await api<Session>("/api/sessions", {
        mode,
        condition,
        fixtureId: mode === "fixture" ? fixtureId : undefined,
      });
      setSession(s);
      setActiveCase(null); setCaseVariant("example"); setPage("chat");
      setReviewOpen(false);
      setDraft("");
      setControls(false);
      setJson(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function performAction(envelope: Record<string, unknown>) {
    setBusy(true);
    setActiveOperation(String(envelope.operation));
    setError("");
    try {
      const { preserveDraft, ...request } = envelope;
      const s = await api<Session>(envelope.operation === "scenario" ? "/api/scenario-run" : "/api/action", envelope.operation === "scenario" ? {sessionId: request.sessionId, requestId: request.requestId} : request);
      setSession(s);
      setTransport(null);
      if (envelope.operation !== "feedback") {
        if (!preserveDraft && ["turn", "finalize", "reflection"].includes(String(envelope.operation))) setDraft("");

      }
    } catch (e) {
      const status = (e as Error & { httpStatus?: number }).httpStatus;
      if (!status || status === 409) setTransport(envelope);
      else setTransport(null);
      setError(
        !status
          ? "The local server response was not received. Retry the same request to avoid duplicating a turn."
          : (e as Error).message,
      );
    } finally {
      setBusy(false);
      setActiveOperation("");
    }
  }
  async function act(operation: string, extra: Record<string, unknown> = {}) {
    if (!session || transport) return;
    await performAction({
      sessionId: session.id,
      operation,
      requestId: requestId(),
      ...extra,
    });
  }
  async function exported(inspect = false) {
    if (!session) return;
    try {
      await languageAPI("/api/language/context",{sessionId:session.id,context:studentContext,revision:++contextRevision.current});
      const data = await api(`/api/export?sessionId=${session.id}`);
      if (inspect) setJson(data);
      else
        download(
          data,
          `humanities-${session.fixtureId ?? session.condition}-${session.id.slice(0, 8)}.json`,
        );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const dialogue = config?.dialogues.find((d) => d.id === session?.fixtureId),
    next = dialogue?.steps[session?.fixtureIndex ?? 0];
  const frozen = !!session?.review;
  return (
    <>
      <HumanitiesDashboard page={page} onPageChange={setPage} controlsOpen={controls} toggleControls={() => setControls(!controls)}>
      <section className={`humanities-page ${page==="chat"?"modern-chat":"observations-workspace"}`} aria-label="Humanities workspace">
        {controls && (
          <section className="research-controls" aria-label="Research controls">
            <button className="controls-close" aria-label="Close research controls" onClick={() => setControls(false)}>×</button>
            <StudentContextSettings value={studentContext} onChange={setStudentContext}/>
            {contextError&&<p role="alert">{contextError}</p>}
            <div>
              <span className="eyebrow">Session setup</span>
              <h2>Explore the support policy</h2>
              <p className="muted">
                A new condition starts a fresh session. Export the current
                record before leaving; it is not saved to disk.
              </p>
            </div>
            <div className="setup-fields">
              <label>
                Mode
                <select
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as Mode);
                    if (e.target.value === "fixture") setCondition("policy");
                  }}
                >
                  <option value="fixture">Scripted walkthrough</option>
                  <option value="live">
                    Live Gemini {config?.configured ? "" : "— setup required"}
                  </option>
                </select>
              </label>
              <label>
                Condition
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                >
                  <option value="policy">
                    Proposed policy · fixed messages
                  </option>
                  <option value="baseline" disabled={mode === "fixture"}>
                    Strong baseline · model wording
                  </option>
                </select>
              </label>
              <label>
                Authored example
                <select
                  value={fixtureId}
                  disabled={mode === "live"}
                  onChange={(e) => setFixtureId(e.target.value)}
                >
                  {config?.dialogues.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} · {d.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="primary"
                disabled={busy || (mode === "live" && !config?.configured)}
                onClick={() => void start()}
              >
                Start fresh session <Icon kind="arrow" size={16} />
              </button>
            </div>
            <details className="configuration">
              <summary>Live configuration & research record</summary>
              <p>
                {config?.configured
                  ? `Configured Gemini model: ${config.modelId}. Live responses send the assessment transcript to Google.`
                  : (config?.configurationMessage ?? "Loading Gemini configuration…")}
              </p>
              <code>
                GEMINI_MODEL={config?.modelId}
                <br />
                npm run check:gemini
              </code>
              <p>
                The same configured model and generation settings serve both
                conditions. The API key stays on the server. Generation requires a saved
                operator confirmation of the project’s Free tier and this model’s free-tier
                eligibility. No automatic retries, billing changes, or model fallback.
                This is not a fresh billing check; reconfirm after any project, key, model, or billing-tier change.
                Google may use free-tier inputs and outputs to improve its products;
                use synthetic text for this demo. Scripted walkthroughs create no live results.
              </p>
              <div className="button-row">
                <button onClick={() => void exported()}>
                  Export session JSON
                </button>
                <button onClick={() => void exported(true)}>
                  Inspect JSON
                </button>
              </div>
            </details>
          </section>
        )}
        <div className="page-title">
          <div>
            <div className="eyebrow">A humanities conversation</div>
            <h1>{task.title}</h1>
          </div>
          <div className="session-caption">
            <span className="mini-label">Text-first exploration</span>
            <span>One passage. Your own reasoning.</span>
          </div>
        </div>
        {(error || session?.error) && (
          <div className="error-box" role="alert" ref={errorNotice} tabIndex={-1}>
            <strong>{error || session?.error}</strong>
            <p>
              No scripted response is substituted for a live failure. Recorded
              turns stay in the session.
            </p>
            {transport && (
              <button
                disabled={working}
                onClick={() => void performAction(transport)}
              >
                Retry same request
              </button>
            )}
            {session?.pending && (
              <div className="button-row">
                <button disabled={busy} onClick={() => void act("retry")}>
                  Retry pending request
                </button>
                {!frozen && (
                  <button disabled={busy} onClick={() => void act("finish")}>
                    Finish with recorded responses
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {config && !session ? (
          <section className="live-setup-card" aria-label="Live AI setup">
            <span className="eyebrow">Live AI</span><h2>Let’s connect your conversation.</h2>
            <p>{config.configurationMessage ?? "The session could not start. Open session settings to try again."}</p>
            <button onClick={() => setControls(true)}>Open session settings</button>
            <p className="muted">Scripted walkthroughs are also available in session settings and are clearly labeled.</p>
          </section>
        ) : !config || !session ? (
          <div className="loading" role="status">
            Opening the local demo…
          </div>
        ) : (
          <div hidden={page!=="chat"}><ChatStudio visible={page==="chat"&&!controls} key={session.id} activeCase={activeCase} setActiveCase={c=>{setActiveCase(c);setCaseVariant("example");}} caseVariant={caseVariant} setCaseVariant={setCaseVariant} onAnalyze={()=>setPage("language")} session={session} draft={draft} setDraft={setDraft} busy={busy} responding={busy && ["turn", "retry", "finalize"].includes(activeOperation)} configured={config.configured} model={session.modelId ?? config.modelId ?? "Gemini"} source={<TaskPanel />} configure={() => setControls(true)} act={act} nextExample={!!next} showReview={() => setReviewOpen(true)} exportRecord={() => void exported()}/></div>
        )}
        {session&&<div hidden={page!=="language"}><LanguageObservations key={session.id} session={session} context={studentContext} target={analysisTarget} onTarget={chooseTarget} openChat={()=>setPage("chat")} configure={()=>setControls(true)} exportRecord={()=>void exported()}/></div>}
        {reviewOpen && session?.review && <RecordDialog close={() => setReviewOpen(false)}><Review session={session} busy={busy} act={act} exportRecord={() => void exported()}/></RecordDialog>}
        <footer>
          <span>Humanities Lab / Local research demo</span>
          <span>Inspect the conversation. Preserve the uncertainty.</span>
          <span>No grades · No proficiency labels</span>
        </footer>
      </section>
      </HumanitiesDashboard>
      {json !== null && <JsonViewer value={json} close={() => setJson(null)} />}
    </>
  );
}
function RecordDialog({ close, children }: { close: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => { element?.close(); trigger?.focus(); };
  }, []);
  return <dialog ref={ref} className="record-dialog" aria-label="Conversation record" onCancel={close}><button className="record-close" autoFocus onClick={close}>← Back to chat</button>{children}</dialog>;
}
function JsonViewer({ value, close }: { value: unknown; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} className="json-dialog" onCancel={close}>
      <div className="section-header">
        <h2>Exported research record</h2>
        <button autoFocus onClick={close}>
          Close
        </button>
      </div>
      <pre tabIndex={0}>{JSON.stringify(value, null, 2)}</pre>
    </dialog>
  );
}
function Correction({
  target,
  kind,
  busy,
  act,
}: {
  target: Evidence | SupportEvent;
  kind: "evidence" | "support";
  busy: boolean;
  act: (op: string, extra?: Record<string, unknown>) => Promise<void>;
}) {
  const [open, setOpen] = useState(false),
    [category, setCategory] = useState(
      kind === "evidence" ? (target as Evidence).state : "unreviewed",
    ),
    [note, setNote] = useState(""),
    [reviewer, setReviewer] = useState("");
  return (
    <div className="correction">
      <button
        className="text-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {" "}
        {open ? "Close correction" : "Add reviewer correction"} ↗
      </button>
      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void act("revision", {
              revision: {
                targetType: kind,
                targetId: target.id,
                category,
                note,
                reviewer,
              },
            }).then(() => {
              setOpen(false);
              setNote("");
            });
          }}
        >
          <label>
            Reviewer name / role
            <input
              required
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              maxLength={120}
            />
          </label>
          <label>
            {kind === "evidence"
              ? "Revised evidence state"
              : "Observed support category"}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {(kind === "evidence"
                ? states
                : [
                    "unreviewed",
                    "access",
                    "administrative",
                    "meaning_repair",
                    "targeted_probe",
                    "general_elicitation",
                    "content_assistance",
                    "uncertain",
                  ]
              ).map((s) => (
                <option value={s} key={s}>
                  {human(s)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Reason for correction
            <textarea
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={4000}
            />
          </label>
          <button disabled={busy} className="primary small">
            Save separate correction
          </button>
        </form>
      )}
    </div>
  );
}
function Review({
  session: s,
  busy,
  act,
  exportRecord,
}: {
  session: Session;
  busy: boolean;
  act: (op: string, extra?: Record<string, unknown>) => Promise<void>;
  exportRecord: () => void;
}) {
  const [reflection, setReflection] = useState("");
  const r = s.review!;
  const [focus, setFocus] = useState<string | null>(null);
  const sourceTurn = s.turns.find((t) => t.id === focus);
  useEffect(() => {
    if (focus)
      document
        .getElementById("cited-student-turn")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focus]);
  function provenance(ids: string[]) {
    if (!ids.length) return "No recorded support before this response";
    return `${ids.length} prior support ${ids.length === 1 ? "event" : "events"} · ${[
      ...new Set(
        ids.map((id) => {
          const e = s.supportEvents.find((e) => e.id === id)!;
          return (
            [...s.revisions]
              .reverse()
              .find((v) => v.targetType === "support" && v.targetId === id)
              ?.category ?? e.plannedCategory
          );
        }),
      ),
    ]
      .map(human)
      .join(", ")}`;
  }
  return (
    <section className="review-page">
      <div className="review-hero">
        <div>
          <span className="eyebrow">The record, with its context</span>
          <h2>Evidence before interpretation.</h2>
          <p>
            {s.mode === "fixture"
              ? "Scripted example — not live AI. These interpretations are authored, provisional examples."
              : r.origin === "no_model_review"
                ? "Final model review unavailable. This frozen record is explicitly unreviewed; earlier suggestions are provisional."
                : "Provisional model suggestions. Exact quotes are checked; interpretation still needs human review."}
          </p>
        </div>
        <button onClick={exportRecord}>
          <Icon kind="download" size={17} />
          Export record
        </button>
      </div>
      <div className="freeze-bar">
        <Icon kind="lock" size={17} />
        <strong>Pre-help record frozen</strong>
        <span>
          {
            s.turns.filter(
              (t) => t.role === "student" && t.phase !== "learning",
            ).length
          }{" "}
          student turns · {s.probes.length} targeted probes ·{" "}
          {s.finalSkipped
            ? "Final response skipped"
            : "Final response recorded"}
        </span>
        <span>No grade or overall score</span>
      </div>
      {r.status !== "ready" && (
        <div className="notice-panel">
          <h3>
            {r.status === "error"
              ? "The model review could not be completed."
              : "Preparing the review…"}
          </h3>
          <p>
            Earlier suggestions below are not a completed final review. The
            frozen transcript and cutoff remain intact.
          </p>
          <div className="button-row">
            <button onClick={() => void act("retry")} disabled={busy}>
              Retry evidence review
            </button>
            {r.status === "error" && (
              <button
                onClick={() => void act("keep_unreviewed")}
                disabled={busy}
              >
                Keep unreviewed record
              </button>
            )}
          </div>
        </div>
      )}
      <div className="criteria-grid">
        {(Object.keys(criteria) as Criterion[]).map((c) => (
          <article className="criterion-card" key={c}>
            <div className="criterion-top">
              <span>{c}</span>
              <Icon kind="book" size={18} />
            </div>
            <h3>{criteria[c].title}</h3>
            {r.evidence
              .filter((e) => e.criterionId === c)
              .map((e) => (
                <div className="evidence-item" key={e.id}>
                  <span className={`evidence-state ${e.state}`}>
                    {human(e.state)}
                  </span>
                  {e.quote ? (
                    <>
                      <blockquote>“{e.quote}”</blockquote>
                      <button
                        className="evidence-link"
                        onClick={() => setFocus(e.studentTurnId)}
                      >
                        View exact student turn ↗
                      </button>
                    </>
                  ) : (
                    <p className="muted">No cited student evidence.</p>
                  )}
                  <p>{e.explanation}</p>
                  {e.unresolvedIssue && (
                    <p className="unresolved">
                      Open interpretation: {e.unresolvedIssue}
                    </p>
                  )}
                  <div className="provenance">
                    <Icon kind="lock" size={12} />
                    {e.studentTurnId
                      ? provenance(e.supportEventIds)
                      : "No cited response; see the support timeline."}
                  </div>
                  <Correction
                    kind="evidence"
                    target={e}
                    busy={busy}
                    act={act}
                  />
                  {s.revisions
                    .filter((v) => v.targetId === e.id)
                    .map((v) => (
                      <p key={v.id} className="revision-note">
                        <strong>
                          {v.reviewer} · {human(v.category)}
                        </strong>
                        <br />
                        {v.note}
                      </p>
                    ))}
                </div>
              ))}
          </article>
        ))}
      </div>
      {sourceTurn && (
        <div
          id="cited-student-turn"
          className="source-inspector"
          role="region"
          aria-label="Cited student turn"
        >
          <div className="section-header">
            <h3>Exact student words</h3>
            <button onClick={() => setFocus(null)}>Close quote</button>
          </div>
          <p>{sourceTurn.text}</p>
          <small>
            {human(sourceTurn.phase)} ·{" "}
            {provenance(sourceTurn.precedingSupportEventIds)}
          </small>
        </div>
      )}
      <div className="review-lower">
        <section className="support-review">
          <div className="section-header">
            <div>
              <span className="eyebrow">Assistance stays visible</span>
              <h3>Support timeline</h3>
            </div>
            <span className="count-pill">{s.supportEvents.length} events</span>
          </div>
          <p className="muted">
            Planned categories are design intentions. They do not prove that a
            message preserved meaning or avoided answer leakage.
          </p>
          {!s.supportEvents.length && <p>No support was delivered.</p>}
          {s.supportEvents.map((e, index) => (
            <article className="support-event" key={e.id}>
              <span className="timeline-number">{index + 1}</span>
              <div>
                <div className="event-heading">
                  <strong>{human(e.actionId)}</strong>
                  <span className="subtle-pill">
                    Planned: {human(e.plannedCategory)}
                  </span>
                </div>
                <p>{s.turns.find((t) => t.id === e.deliveredTurnId)?.text}</p>
                <small>
                  Reviewer status:{" "}
                  {human(
                    [...s.revisions].reverse().find((v) => v.targetId === e.id)
                      ?.category ?? e.reviewerCategory,
                  )}
                  {e.status === "content_help_deferred"
                    ? " · Unmet content-help request"
                    : ""}
                </small>
                <Correction kind="support" target={e} busy={busy} act={act} />
                {s.revisions
                  .filter((v) => v.targetId === e.id)
                  .map((v) => (
                    <p key={v.id} className="revision-note">
                      {v.reviewer}: {v.note}
                    </p>
                  ))}
              </div>
            </article>
          ))}
        </section>
        <aside className="review-notes">
          <span className="eyebrow">Keep the questions open</span>
          <h3>Uncertainty & boundaries</h3>
          <ul>
            {[...r.unresolvedQuestions, ...r.notes].map((n, i) => (
              <li key={i}>{n}</li>
            ))}
            <li>
              This record describes this interaction only. It does not establish
              mastery, English proficiency, fairness, or a learning gain.
            </li>
            <li>
              Educator review is still required for the task, C1–C3, allowed
              supports, and probe limits.
            </li>
          </ul>
          {r.unmetSupportRequestIds.length > 0 && (
            <div className="unmet-note">
              <strong>
                {r.unmetSupportRequestIds.length} unmet support request
              </strong>
              <p>
                Concept help was deferred. The learning note may not fully
                resolve the requested vocabulary; this remains an access
                limitation.
              </p>
            </div>
          )}
          <div className="learning-card">
            <Icon kind="book" />
            <h3>A separate learning note</h3>
            <p>
              Substantive help opens after the assessment record is frozen.
              Reflections will not change the earlier review.
            </p>
            {s.phase === "review" ? (
              <button
                disabled={busy || r.status !== "ready"}
                className="primary"
                onClick={() => void act("learning")}
              >
                Open learning note <Icon kind="arrow" size={16} />
              </button>
            ) : (
              <>
                <span className="evidence-state partial">
                  Substantive content assistance
                </span>
                <p className="learning-text">{task.learningNote}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void act("reflection", { text: reflection }).then(() =>
                      setReflection(""),
                    );
                  }}
                >
                  <label htmlFor="reflection">
                    Optional post-help reflection
                  </label>
                  <textarea
                    id="reflection"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    maxLength={8000}
                  />
                  <button disabled={busy || !reflection.trim()}>
                    Save separate reflection
                  </button>
                </form>
                {s.reflectionIds.map((id) => (
                  <blockquote key={id}>
                    {s.turns.find((t) => t.id === id)?.text}
                    <small>
                      Post-content-assistance · not used in pre-help review
                    </small>
                  </blockquote>
                ))}
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
