import { mkdir, writeFile } from "node:fs/promises";
import { languageCases } from "../src/language-cases";
import { detectorCategories, defaultStudentContext, type LanguageAnalysis } from "../src/language-analysis";
const dir=new URL("../evaluations/",import.meta.url);await mkdir(dir,{recursive:true});
const prepared=[...detectorCategories.flatMap(id=>["example","comparison"].map(variant=>({id,variant,kind:"category pair"}))),...["C19","C21","C22","C10"].map(id=>({id,variant:"example",kind:"safeguard"}))].map(p=>{
 const c=languageCases.find(c=>c.id===p.id)!,v=c[p.variant as "example"|"comparison"];
 return {...p,transcript:[...v.prior,...(v.studentText?[{role:"student",text:v.studentText}]:[])],authoredExpectation:v.observation,watchFor:c.watchFor,execution:"prepared, not run",liveCategoryImplemented:detectorCategories.includes(p.id as any)};
});
await writeFile(new URL("language-check-plan.json",dir),JSON.stringify({notice:"Authored review expectations, not evaluation results. Guidance is never supplied to the detector.",checks:prepared},null,2));
console.log(`Prepared ${prepared.length} checks. No model call from preparation.`);
if(!process.argv.includes("--live-three"))process.exit(0);
const base="http://127.0.0.1:4317";
async function api(url:string,body?:unknown){const r=await fetch(base+url,body?{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:undefined);const v=await r.json();if(!r.ok)throw new Error(v.error??`HTTP ${r.status}`);return v;}
const config=await api("/api/config");
const report:{createdAt:string;model:string;analysisRequests:number;records:LanguageAnalysis[];stopReason:string|null;sessionId?:string;url?:string;notice:string}={createdAt:new Date().toISOString(),model:config.modelId,analysisRequests:0,records:[],stopReason:null,notice:"Bounded plan of three synthetic smoke requests. This is not real-student validation or an estimate of accuracy. No retry or model substitution."};
const file=new URL(`language-live-smoke-${new Date().toISOString().replaceAll(":","-")}.json`,dir);
console.log(`Saving actual results to ${file.pathname}`);
if(!config.configured){report.stopReason=config.configurationMessage??"Configuration unavailable";await writeFile(file,JSON.stringify(report,null,2));console.log(report.stopReason);process.exit(0);}
const session=await api("/api/sessions",{mode:"live",condition:"policy"});report.sessionId=session.id;report.url=`${base}/?session=${session.id}`;
const context={...defaultStudentContext,writing:2};await api("/api/language/context",{sessionId:session.id,context,revision:Date.now()});
for(const target of [{kind:"case",caseId:"C06",variant:"example"},{kind:"case",caseId:"C06",variant:"comparison"},{kind:"case",caseId:"C10",variant:"example"}]){
 try{
  report.analysisRequests++;
  let record:LanguageAnalysis=await api("/api/language/analyze",{sessionId:session.id,target,requestId:crypto.randomUUID(),context});
  const until=Date.now()+130000;
  while(record.state==="analyzing"&&Date.now()<until){await new Promise(r=>setTimeout(r,1000));const list=await api(`/api/language?sessionId=${session.id}`);record=list.analyses.find((r:LanguageAnalysis)=>r.id===record.id);}
  report.records.push(record);
  console.log(`${target.caseId} ${target.variant}: ${record.state}, ${record.observations.length} observations${record.error?`, ${record.error}`:""}`);
  if(record.state==="analyzing"||[400,401,403,404,429].includes(record.httpStatus??0)||/configuration|credentials|free.tier/i.test(record.error??"")){report.stopReason=record.error??"Timed out waiting; no retry.";break;}
 }catch(e){report.stopReason=(e as Error).message;break;}
 finally{await writeFile(file,JSON.stringify(report,null,2));}
}
console.log(JSON.stringify({analysisRequests:report.analysisRequests,stopReason:report.stopReason,url:report.url}));
