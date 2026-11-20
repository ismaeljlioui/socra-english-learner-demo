import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import { createRuntime, handleAPI, readBody, sameOrigin } from "../server/api.js";
import { DemoError } from "../server/controller.js";
import { restoreState, sealState } from "../server/hosted-state.js";

// Every invocation gets an isolated runtime. Authenticated, encrypted browser
// state lets the next request run on any instance, without trusting editable JSON.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const send=(data:unknown,status=200)=>{res.writeHead(status,{"Content-Type":"application/json","Cache-Control":"no-store"});res.end(JSON.stringify(data));};
  try {
    if(!sameOrigin(req)) throw new DemoError("Cross-origin requests are not allowed.",403);
    const url=new URL(req.url??"/api",`http://${req.headers.host??"localhost"}`);
    if(url.pathname==="/api"||url.pathname==="/api/index") {
      url.pathname=`/api/${url.searchParams.get("route")??""}`;
      url.searchParams.delete("route");req.url=url.pathname+url.search;
    }
    const runtime=createRuntime();
    if(req.method==="GET"&&url.pathname==="/api/config") return handleAPI(req,res,true,runtime);
    if(req.method!=="POST"||url.pathname!=="/api/transport") throw new DemoError("Use the demo interface to access this session API.",404);
    if(!req.headers["content-type"]?.startsWith("application/json")) throw new DemoError("JSON content is required.",415);
    const input=z.object({path:z.string().max(500),body:z.unknown().optional(),state:z.string().max(1_000_000).optional()}).strict().parse(await readBody(req,1_100_000));
    const target=new URL(input.path,"http://demo.local");
    if(target.origin!=="http://demo.local"||!/^\/api\/[a-z/-]+$/.test(target.pathname)||target.pathname==="/api/transport") throw new DemoError("Invalid API path.");
    if(input.state) restoreState(runtime,input.state);
    const inner=Object.assign(Object.create(req),{url:target.pathname+target.search,method:input.body===undefined?"GET":"POST",body:input.body});
    let status=200,data:unknown;
    const capture={writeHead(code:number){status=code;},end(value:string){data=JSON.parse(value);}} as ServerResponse;
    await handleAPI(inner,capture,true,runtime);
    const sessionId=[...runtime.controller.sessions.keys()][0];
    send({data,sessionId,state:sessionId?sealState(runtime):undefined},status);
  } catch(e) {
    send({error:e instanceof DemoError?e.message:e instanceof z.ZodError?"Invalid request fields.":"The hosted request could not be completed."},e instanceof DemoError?e.status:400);
  }
}
