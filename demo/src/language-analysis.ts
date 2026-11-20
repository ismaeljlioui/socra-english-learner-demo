import type { task } from "./task.js";
export const detectorCategories = ["C02", "C06", "C10", "C11", "C15"] as const;
export const languageStatusLabels = {strength:"Strength", difficulty:"Specific difficulty", unclear:"Unclear meaning", insufficient:"Insufficient evidence", limitation:"Input / assistance limitation"};
export type StudentContext = {state:"Illinois"; framework:"WIDA"; writing:number|null; reading:number|null};
export const defaultStudentContext: StudentContext = {state:"Illinois", framework:"WIDA", writing:null, reading:null};
export type AnalysisTarget = {kind:"conversation"} | {kind:"case"; caseId:string; variant:"example"|"comparison"};
export const targetKey = (t:AnalysisTarget) => t.kind === "conversation" ? "conversation" : `${t.caseId}:${t.variant}`;
export interface LanguageSnapshot {
  assignment: {id:string; version:string; context:string; question:string; passages:typeof task.passages};
  turns: {id:string; role:"student"|"assistant"; text:string; phase:string; timestamp:string|null}[];
  assistance: {id:string; turnId:string; category:string; status:string; text:string; turnIndex:number}[];
  inputFacts: string[];
}
export type LanguageSpan = {turnId:string; quote:string};
export interface LanguageObservation {
  id:string; categoryId:typeof detectorCategories[number]; title:string;
  status:keyof typeof languageStatusLabels; studentSpans:LanguageSpan[]; contextTurnIds:string[];
  sourceSpans:{paragraphId:"P1"|"P2"|"question";quote:string}[];
  explanation:string; uncertainty:string; resolution:"current"|"repaired"; repairSpans:LanguageSpan[];
  assistanceIds:string[];
}
export interface TeacherDecision {
  id:string; observationId:string; action:"confirmed"|"dismissed"|"edited"; wording:string; note:string; timestamp:string;
}
export interface LanguageAnalysis {
  id:string; sessionId:string; requestId:string; target:AnalysisTarget; snapshot:LanguageSnapshot; fingerprint:string;
  contextAtRequest:StudentContext; requestedAt:string; completedAt:string|null;
  state:"analyzing"|"results"|"none"|"insufficient"|"failed";
  observations:LanguageObservation[]; decisions:TeacherDecision[];
  error:string|null; httpStatus:number|null; model:string|null; promptVersion:string; rawOutput:unknown; usage:unknown;
  latencyMs:number; inputStatus:string|null; changed?:boolean;
}
