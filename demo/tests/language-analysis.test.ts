import test from "node:test";
import assert from "node:assert/strict";
import { Controller, addStudent } from "../server/controller";
import { buildLanguageSnapshot, detectorInstructions, LanguageService, validateLanguageOutput, fingerprint, type DetectorAdapter, languageJSONSchema } from "../server/language-analysis";
import { defaultStudentContext, detectorCategories } from "../src/language-analysis";
import { languageCases } from "../src/language-cases";
import { ProviderError } from "../server/provider";
import { task } from "../src/task";
const session=()=>new Controller(async()=>{throw new Error("Conversation model must not run");},[],{configured:true,modelId:"mock-only",generationSettings:{}}).create("live","policy");
const nextTick=()=>new Promise(r=>setTimeout(r,0));
const empty:DetectorAdapter=async()=>({proposal:{observations:[]},rawOutput:{mock:true},model:"mock-only",usage:null});
const sample=()=>({categoryId:"C06",title:"Agreement purpose differs",status:"difficulty",studentSpans:[{turnId:"turn-1",quote:languageCases.find(c=>c.id==="C06")!.example.studentText}],contextTurnIds:[],sourceSpans:[{paragraphId:"P2",quote:"agree among themselves to have neither"}],explanation:"The expressed purpose differs from the account.",uncertainty:"The cause is undetermined.",resolution:"current",repairSpans:[]});
test("exact contiguous student/source provenance rejects invented, stitched and guide-attributed quotations",()=>{
 const snap=buildLanguageSnapshot(session(),{kind:"case",caseId:"C06",variant:"example"});
 assert.equal(validateLanguageOutput({observations:[sample()]},snap).length,1);
 for(const change of [{studentSpans:[{turnId:"missing",quote:"x"}]},{studentSpans:[{turnId:"turn-1",quote:"In the passage ... other people."}]},{sourceSpans:[{paragraphId:"P2",quote:"invented"}]},{sourceSpans:[]},{contextTurnIds:["missing"]}])assert.throws(()=>validateLanguageOutput({observations:[{...sample(),...change}]},snap));
 snap.turns[0].role="assistant";assert.throws(()=>validateLanguageOutput({observations:[sample()]},snap),/exact student/);
});
test("C02 accepts exact question evidence; C15 cannot be promoted to a reasoning difficulty",()=>{
 const snap=buildLanguageSnapshot(session(),{kind:"case",caseId:"C02",variant:"example"});
 const o={...sample(),categoryId:"C02",studentSpans:[{turnId:"turn-1",quote:snap.turns[0].text}],sourceSpans:[{paragraphId:"question",quote:"such as safety or a good reputation"}]};
 assert.equal(validateLanguageOutput({observations:[o]},snap).length,1);
 assert.throws(()=>validateLanguageOutput({observations:[{...o,categoryId:"C15"}]},snap),/reasoning difficulty/);
});
test("blank/missing student text produces input status without a provider call or conversation mutation",async()=>{
 let calls=0;const s=session(),before=JSON.stringify(s),service=new LanguageService(async r=>{calls++;return empty(r);},"mock-only");
 const r=service.start(s,{kind:"conversation"},"empty",defaultStudentContext);
 assert.equal(r.state,"insufficient");assert.equal(calls,0);assert.equal(JSON.stringify(s),before);
 assert.throws(()=>addStudent(s,"   "));
});
test("all five category example/comparison snapshots omit authored guidance, case labels, and the other variant",()=>{
 for(const id of detectorCategories)for(const variant of ["example","comparison"] as const){
  const c=languageCases.find(c=>c.id===id)!,snap=buildLanguageSnapshot(session(),{kind:"case",caseId:id,variant}),raw=JSON.stringify(snap);
  assert.ok(raw.includes(c[variant].studentText));assert.ok(!raw.includes(c[variant].observation));assert.ok(!raw.includes(c.title));assert.ok(!raw.includes(c.watchFor));assert.ok(!raw.includes(c[variant==="example"?"comparison":"example"].studentText));
  assert.equal(snap.assignment.question,task.question);assert.deepEqual(snap.assignment.passages,task.passages);
 }
});
test("proficiency changes make no detector calls, do not change findings, and retain historical context",async()=>{
 let calls=0;const seen:unknown[]=[];const service=new LanguageService(async r=>{calls++;seen.push(r);return empty(r);},"mock-only"),s=session();addStudent(s,"I think justice matters.");
 const context={...defaultStudentContext,writing:2};service.setContext(s.id,context,1);
 const r=service.start(s,{kind:"conversation"},"one",context);await nextTick();
 const observations=JSON.stringify(r.observations);service.setContext(s.id,{...context,reading:5,writing:4},2);service.setContext(s.id,context,1);
 assert.equal(calls,1);assert.equal(JSON.stringify(r.observations),observations);assert.equal(r.contextAtRequest.writing,2);assert.equal(service.context(s.id).reading,5);
 assert.ok(!JSON.stringify(seen).includes('"writing"'));assert.ok(!JSON.stringify(seen).includes('"reading"'));assert.equal(service.list(s)[0].changed,false);
});
test("duplicate clicks, replay and pending case switches stay bound to their snapshots without follow-ups",async()=>{
 let release:(v:any)=>void=()=>{};let calls=0;const service=new LanguageService(()=>{calls++;return new Promise(r=>{release=r;});},"mock-only"),s=session(),before=JSON.stringify(s);
 const target={kind:"case" as const,caseId:"C06",variant:"example" as const};const r=service.start(s,target,"request",defaultStudentContext);
 assert.equal(service.start(s,target,"request",defaultStudentContext).id,r.id);
 assert.equal(service.start(s,target,"double-click",defaultStudentContext).id,r.id);
 assert.equal(service.list(s).filter(r=>r.target.kind==="case"&&r.target.variant==="comparison").length,0);
 release({proposal:{observations:[sample()]},rawOutput:{mock:true},model:"mock-only",usage:null});await nextTick();
 assert.equal(calls,1);assert.equal(r.state,"results");assert.equal(JSON.stringify(s),before);
 assert.equal(service.start(s,target,"request",defaultStudentContext).id,r.id);assert.equal(service.start(s,target,"double-click",defaultStudentContext).id,r.id);assert.equal(calls,1);
 assert.throws(()=>service.start(s,{...target,variant:"comparison"},"request",defaultStudentContext),/different analysis/);
});
test("conversation changes make earlier snapshots stale; input/provider failure is not a learner finding",async()=>{
 const s=session();addStudent(s,"Justice matters.");const service=new LanguageService(async()=>{throw new ProviderError("Quota exhausted",{},null,"mock-only",{status:429});},"mock-only");
 const r=service.start(s,{kind:"conversation"},"quota",defaultStudentContext);await nextTick();
 assert.equal(r.state,"failed");assert.equal(r.httpStatus,429);assert.deepEqual(r.observations,[]);
 addStudent(s,"I have a further thought.");assert.equal(service.list(s)[0].changed,true);assert.equal(r.snapshot.turns.length,1);
});
test("teacher decisions are separate, idempotent, session-bound and specific to one analysis",async()=>{
 const s=session(),service=new LanguageService(async()=>({proposal:{observations:[sample()]},rawOutput:{mock:true},model:"mock-only",usage:null}),"mock-only");
 const target={kind:"case" as const,caseId:"C06",variant:"example" as const};const r=service.start(s,target,"first",defaultStudentContext);await nextTick();const original=JSON.stringify(r.observations);
 const d={requestId:"edit",observationId:r.observations[0].id,action:"edited",wording:"Teacher interpretation",note:"Needs context"};service.review(s.id,r.id,d);service.review(s.id,r.id,d);
 assert.equal(r.decisions.length,1);assert.equal(JSON.stringify(r.observations),original);
 assert.throws(()=>service.review("other-session",r.id,d),/not found/);
 const next=service.start(s,target,"second",defaultStudentContext);await nextTick();assert.deepEqual(next.decisions,[]);assert.throws(()=>service.review(s.id,next.id,d),/Observation not found/);
});
test("repairs must cite separate later student evidence and cannot remain marked current",()=>{
 const snap=buildLanguageSnapshot(session(),{kind:"case",caseId:"C06",variant:"example"});snap.turns.push({id:"repair",role:"student",text:"I meant they agree not to hurt each other.",phase:"eliciting",timestamp:null});
 const repaired={...sample(),resolution:"repaired",repairSpans:[{turnId:"repair",quote:snap.turns[1].text}]};
 assert.equal(validateLanguageOutput({observations:[repaired]},snap)[0].resolution,"repaired");
 assert.throws(()=>validateLanguageOutput({observations:[{...repaired,resolution:"current"}]},snap));
 assert.throws(()=>validateLanguageOutput({observations:[{...repaired,repairSpans:repaired.studentSpans}]},snap));
});
test("safeguard fixtures preserve imperfect English, corrections, prior help, and unresolved ambiguity without guidance leakage",()=>{
 for(const id of ["C19","C21","C22","C10"]){const s=buildLanguageSnapshot(session(),{kind:"case",caseId:id,variant:"example"});const c=languageCases.find(c=>c.id===id)!;assert.ok(!JSON.stringify(s).includes(c.example.observation));assert.ok(s.turns.some(t=>t.role==="student"));}
 const help=buildLanguageSnapshot(session(),{kind:"case",caseId:"C22",variant:"example"});assert.ok(help.assistance.some(a=>a.category==="substantive"));assert.ok(help.assistance.every(a=>a.turnIndex>=0));
 assert.match(detectorInstructions,/NEVER proof of faulty reasoning/);assert.match(detectorInstructions,/later explicit revisions/);
});
test("settings and all supported examples retain task and detector instructions; unsupported patterns are not run",()=>{
 const s=session(),service=new LanguageService(empty,"mock-only");
 assert.throws(()=>service.start(s,{kind:"case",caseId:"C04",variant:"example"},"c04",defaultStudentContext),/not implemented/);
 const snap=buildLanguageSnapshot(s,{kind:"conversation"});service.setContext(s.id,{...defaultStudentContext,writing:6},1);assert.equal(fingerprint(snap),fingerprint(buildLanguageSnapshot(s,{kind:"conversation"})));
});

test("passage mismatch requires passage provenance; omitted later student context is rejected",()=>{
 const snap=buildLanguageSnapshot(session(),{kind:"case",caseId:"C06",variant:"example"});
 for(const categoryId of ["C06","C11"]) assert.throws(()=>validateLanguageOutput({observations:[{...sample(),categoryId,sourceSpans:[{paragraphId:"question",quote:"such as safety or a good reputation"}]}]},snap),/source paragraph/);
 snap.turns.push({id:"later",role:"student",text:"I correct that: the agreement is not to hurt one another.",phase:"eliciting",timestamp:null});
 assert.throws(()=>validateLanguageOutput({observations:[sample()]},snap),/later student context/);
 // Merely listing that turn still cannot establish semantic recognition of a repair.
 assert.equal(validateLanguageOutput({observations:[{...sample(),contextTurnIds:["later"]}]},snap).length,1);
});

test("provider schema omits expensive length bounds while local validation retains them",()=>{
 assert.doesNotMatch(JSON.stringify(languageJSONSchema),/maxItems|maxLength|minItems|minLength|\$schema/);
 const snap=buildLanguageSnapshot(session(),{kind:"case",caseId:"C06",variant:"example"});
 assert.throws(()=>validateLanguageOutput({observations:[{...sample(),title:"x".repeat(121)}]},snap),/contract/);
 assert.throws(()=>validateLanguageOutput({observations:[{...sample(),studentSpans:[]}]},snap),/contract/);
});
