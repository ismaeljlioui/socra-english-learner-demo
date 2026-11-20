/** Offline browser verification only. No .env, Gemini request, or production fixture import. */
import { createServer } from "node:http";
import { Controller, exportSession } from "../server/controller";
import { LanguageService } from "../server/language-analysis";
import { defaultStudentContext, type LanguageSnapshot } from "../src/language-analysis";
import dialogues from "../data/dialogues.json";
import type { Dialogue } from "../src/types";
const controller=new Controller(async()=>{throw new Error("No live calls in UI fixture");},dialogues as Dialogue[],{configured:false,modelId:"mock-ui-only",generationSettings:{}});
const session=controller.create("fixture","policy","D1");
function mock(snapshot:LanguageSnapshot){
 const student=snapshot.turns.filter(t=>t.role==="student"),last=student.at(-1)!;
 const mismatch=last.text.includes("do more injustice"),ambiguous=last.text==="He disagrees with him.";
 return {observations:[{categoryId:ambiguous?"C10":"C06",title:`Mock UI fixture: ${ambiguous?"Reference remains unresolved":mismatch?"Purpose differs from the source":"Meaning is recoverable"}`,status:ambiguous?"unclear":mismatch?"difficulty":"strength",studentSpans:[{turnId:last.id,quote:last.text}],contextTurnIds:student.slice(0,-1).map(t=>t.id),sourceSpans:ambiguous?[]:[{paragraphId:"P2",quote:"agree among themselves to have neither"}],explanation:ambiguous?"The two pronouns do not distinguish Glaucon from Socrates.":mismatch?"The stated purpose differs from the source's mutual agreement.":"The relation between avoiding harm and mutual agreement is understandable despite grammar differences.",uncertainty:"Hand-authored software fixture, not a Gemini result. Interpretation still needs teacher review.",resolution:"current",repairSpans:[]}]};
}
const language=new LanguageService(async request=>{await new Promise(r=>setTimeout(r,1500));return {proposal:mock(request.data),rawOutput:{mock:true},model:"mock-ui-only",usage:null};},"mock-ui-only");
const server=createServer(async(req,res)=>{
 const url=new URL(req.url!,"http://127.0.0.1:4318");
 const send=(v:unknown,status=200)=>{res.writeHead(status,{"Content-Type":"application/json"});res.end(JSON.stringify(v));};
 try{
  if(url.pathname.startsWith("/api/")){
   let raw="";for await(const chunk of req)raw+=chunk;const b=raw?JSON.parse(raw):{};
   if(url.pathname==="/api/config")return send({configured:false,credentialsConfigured:false,freeTierVerified:false,configurationMessage:"Offline mock UI test",modelId:"mock-ui-only",generationSettings:{},dialogues});
   if(url.pathname==="/api/session")return send(session);
   if(url.pathname==="/api/language")return send(language.export(session));
   if(url.pathname==="/api/language/context")return send(language.setContext(session.id,b.context,b.revision));
   if(url.pathname==="/api/language/analyze")return send(language.start(session,b.target,b.requestId,b.context),202);
   if(url.pathname==="/api/language/review")return send(language.review(session.id,b.analysisId,b.decision));
   if(url.pathname==="/api/export")return send({...exportSession(session),language:language.export(session),testOnly:"MOCK UI TEST, no Gemini calls"});
   if(url.pathname==="/api/action")return send(await controller.mutate(session.id,b.operation,b));
   return send({error:"Unsupported offline test action"},400);
  }
  const upstream=await fetch(`http://127.0.0.1:4317${url.pathname}${url.search}`);
  let bytes=Buffer.from(await upstream.arrayBuffer());const type=upstream.headers.get("content-type")??"application/octet-stream";
  if(type.includes("text/html"))bytes=Buffer.from(bytes.toString().replace("<body>",'<body><div style="position:fixed;bottom:0;left:0;right:0;z-index:999999;padding:8px;text-align:center;background:#f6df8f;color:#332b16;font:13px sans-serif">OFFLINE MOCK UI VERIFICATION · all observations are hand-authored fixtures · no live AI</div>'));
  res.writeHead(upstream.status,{"Content-Type":type});res.end(bytes);
 }catch(e){send({error:(e as Error).message},400);}
});
server.listen(4318,"127.0.0.1",()=>console.log(`Offline test UI: http://127.0.0.1:4318/?session=${session.id}`));
