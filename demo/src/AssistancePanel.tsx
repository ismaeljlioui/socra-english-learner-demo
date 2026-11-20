import { CardPicker } from "./CardPicker";
import { supportControls, supportLabels, task } from "./task";
import type { Session } from "./types";

export function AssistancePanel({ onClose, session, busy, onRequest, showReview, openLearning }: {
  onClose: () => void; session: Session; busy: boolean;
  onRequest: (id: string) => void; showReview: () => void; openLearning: () => void;
}) {
  const available = session.phase === "eliciting" && !busy && !session.pending && (!session.scenario || !!session.scenario.runRequestId);
  return <CardPicker title="Assistance" intro="Choose a little support for your thinking." side="left" cards={supportControls.map(c => ({id:c.id, title:c.label, category:c.group}))} onClose={onClose} footer={<details className="assistance-detail picker-more"><summary>Support history & options</summary>
    <details className="assistance-detail"><summary>How the guide follows your thinking</summary><p>If your meaning is unclear, the guide can ask you to explain it. It can ask up to three focused follow-up questions about the passage, your reason, or their connection. These are chosen from your responses, not from an assumed language level.</p><p>{task.instruction}</p></details>
    <details className="assistance-detail"><summary>Support history <span>{session.supportEvents.length}</span></summary>
      {session.supportEvents.length === 0 ? <p>No supports have been delivered yet.</p> : <ol className="assistance-history">{session.supportEvents.map(event => <li key={event.id}><strong>{supportLabels[event.actionId as keyof typeof supportLabels] ?? "Recorded support"}</strong><p>{session.turns.find(t => t.id === event.deliveredTurnId)?.text}</p>{event.status === "content_help_deferred" && <small>Request recorded; content explanation was not provided.</small>}</li>)}</ol>}
      <p>These are the delivered messages. Their educational suitability still needs review.</p>
    </details>
    <section className="assistance-after"><span className="assistance-kicker">After this conversation</span><h3>Review, then explore further.</h3><p>Finish and save your response to review the evidence and open the learning note. Reflections after that help stay separate from your earlier record.</p><div>
      <button disabled={!session.review} onClick={() => { onClose(); showReview(); }}>Evidence & support review</button>
      <button disabled={busy || session.review?.status !== "ready" || session.phase === "learning"} onClick={() => { onClose(); openLearning(); }}>Open learning note</button>
    </div></section>
    <p className="assistance-limit">Provisional text demo · No translation or speech input. Listen, copy, and feedback are available on guide responses.</p>
  </details>}>{id => {
    const control = supportControls.find(c => c.id === id)!;
    return <><span className="picker-category">{control.group}</span><h3>{control.label}</h3><p>{control.description}</p><blockquote>{control.request}</blockquote>
      <button className="picker-primary" disabled={!available} onClick={() => onRequest(control.id)}>Use this support <span aria-hidden="true">↗</span></button>
      <p className="picker-note">{session.mode === "fixture" ? "Scripted request · not live AI" : "Live request · keeps your draft"}</p>
      {!available && <p className="picker-note">{session.scenario && !session.scenario.runRequestId ? "Run the selected scenario before adding support requests." : busy || session.pending ? "Complete or retry the current request first." : "This part has ended. Your support history is below."}</p>}

    </>;
  }}</CardPicker>;
}
