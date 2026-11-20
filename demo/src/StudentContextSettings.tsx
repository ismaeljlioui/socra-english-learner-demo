import states from "./us-states.json";
import type { StudentContext } from "./language-analysis";
export function StudentContextSettings({value,onChange}:{value:StudentContext;onChange:(v:StudentContext)=>void}) {
  return <section className="student-context-settings" aria-label="Student context settings">
    <div><span className="assistance-kicker">Teacher-provided context · simulated profile</span><h2>Student context</h2><p>Choose an existing teacher-provided level. For demonstration, these selections represent a simulated student profile.</p></div>
    <div className="context-settings-grid"><div>
      <svg className="state-map" viewBox="0 0 975 610" aria-label="United States state selection: only Illinois is available" role="group">
        {states.map(s=><path key={s.id} d={s.d} className={s.id==="17"?"selected-state":"unavailable-state"} role={s.id==="17"?"button":undefined} tabIndex={s.id==="17"?0:undefined} aria-label={s.id==="17"?"Select Illinois":`${s.name}, unavailable`} aria-pressed={s.id==="17"?true:undefined} aria-disabled={s.id!=="17"?true:undefined} onClick={s.id==="17"?()=>onChange({...value,state:"Illinois",framework:"WIDA"}):undefined} onKeyDown={s.id==="17"?e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onChange({...value,state:"Illinois",framework:"WIDA"});}}:undefined}><title>{s.name}{s.id==="17"?" · selected":" · unavailable"}</title></path>)}
      </svg>
      <label>State<select value="Illinois" onChange={()=>onChange({...value,state:"Illinois",framework:"WIDA"})}>{states.filter(s=>s.id!=="11").sort((a,b)=>a.name.localeCompare(b.name)).map(s=><option key={s.id} value={s.name} disabled={s.id!=="17"}>{s.name}</option>)}</select></label>
      <p>Selected state: Illinois.<br/>Other states are not available in this prototype.</p>
    </div><div className="context-domain-fields"><strong>Framework: WIDA</strong>
      {(["writing","reading"] as const).map(domain=><label key={domain}>{domain === "writing"?"Writing":"Reading"} proficiency<select value={value[domain]??""} onChange={e=>onChange({...value,[domain]:e.target.value?Number(e.target.value):null})}><option value="">Not provided</option>{[1,2,3,4,5,6].map(level=><option key={level} value={level}>Level {level}</option>)}</select></label>)}
      <p>Grades 9–12 · provisional task assumption.</p><p className="muted">Broad demo selections, not official score entry or reclassification. Levels are never inferred and are withheld from AI analysis.</p>
    </div></div>
  </section>;
}
