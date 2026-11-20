import { CardPicker } from "./CardPicker";
import { caseStatusLabels, type LanguageCase } from "./language-cases";

export function ScenarioPanel({ cases, onClose, onSelect, busy }: {
  cases: LanguageCase[]; onClose: () => void; onSelect: (id: string) => void;
  busy: boolean;
}) {
  return <CardPicker title={`${cases.length} language cases`} intro="Explore a pattern, its evidence, and a comparison. Authored examples, not AI findings." side="right" cards={cases.map(c => ({id:c.id, title:c.title, category:c.group}))} onClose={onClose}>
    {id => {
      const c = cases.find(c => c.id === id)!;
      return <><span className="picker-category">{c.id} · {c.group}</span><h3>{c.title}</h3><p>{c.focus}</p>
        {c.example.studentText ? <blockquote>{c.example.studentText}</blockquote> : <p className="picker-warning">No response text is available in this example.</p>}
        {c.scope === "not_elicited" && <p className="picker-warning">This task does not elicit this category. The case checks that no difficulty is invented.</p>}
        <details className="scenario-prefix"><summary>What to look for</summary>
          <p><strong>Context</strong>{c.context}</p>
          {c.example.prior.length > 0 && <div><p><strong>Earlier turns · authored</strong></p>{c.example.prior.map((turn,i) => <p key={i}><strong>{turn.role === "student" ? "Student" : "Guide"}{turn.assistance === "substantive" ? " · supplied content" : ""}</strong>{turn.text}</p>)}</div>}
          <p><strong>{caseStatusLabels[c.example.status]} · proposed observation</strong>{c.example.observation}</p>
          <p><strong>Watch for</strong>{c.watchFor}</p>
          <p><strong>Research basis</strong>{c.basis}</p>
        </details>
        <button className="picker-primary" disabled={busy} onClick={() => onSelect(id)}>Play example <span aria-hidden="true">↗</span></button>
        <p className="picker-note">Plays response by response · no AI call · keeps your chat and draft.</p>
      </>;
    }}
  </CardPicker>;
}
