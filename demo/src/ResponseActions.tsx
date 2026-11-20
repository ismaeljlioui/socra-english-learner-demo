import { useEffect, useRef, useState } from "react";
import type { Session, Turn } from "./types";

function ActionIcon({ kind }: { kind: "listen" | "stop" | "copy" | "up" | "down" }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "listen" ? <><path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></> :
      kind === "stop" ? <rect x="6" y="6" width="12" height="12" rx="2"/> :
      kind === "copy" ? <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></> :
      <g transform={kind === "down" ? "rotate(180 12 12)" : undefined}><path d="M7 10v11H3V10h4Zm0 0 5-8c2 0 3 2 2 5l-1 3h6a2 2 0 0 1 2 2l-2 7a3 3 0 0 1-3 2H7"/></g>}
  </svg>;
}

// Narration uses only a device-local English voice; no audio API or network fallback.
export function useLocalNarration() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [audioNotice, setAudioNotice] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const update = () => setVoice(synth.getVoices().find(v => v.localService && /^en(?:[-_]|$)/i.test(v.lang)) ?? null);
    update();
    synth.addEventListener("voiceschanged", update);
    return () => { synth.removeEventListener("voiceschanged", update); utteranceRef.current = null; synth.cancel(); };
  }, []);
  function stop() {
    utteranceRef.current = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlayingId(null);
    setAudioNotice("");
  }
  function listen(turn: Turn) {
    if (!voice || !("speechSynthesis" in window)) {
      setAudioNotice("Listen is unavailable: this browser has no local English voice. You can still read or copy the response.");
      return;
    }
    const synth = window.speechSynthesis;
    const stopping = playingId === turn.id;
    utteranceRef.current = null;
    synth.cancel();
    setPlayingId(null);
    setAudioNotice("");
    if (stopping) return;
    const utterance = new SpeechSynthesisUtterance(turn.text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = .95;
    utteranceRef.current = utterance;
    setPlayingId(turn.id);
    const done = () => { if (utteranceRef.current === utterance) { utteranceRef.current = null; setPlayingId(null); } };
    utterance.onend = done;
    utterance.onerror = event => {
      if (utteranceRef.current !== utterance) return;
      done();
      if (!["canceled", "interrupted"].includes(event.error)) setAudioNotice("Audio could not play in this browser. The response is still available to read or copy.");
    };
    try { synth.speak(utterance); } catch { done(); setAudioNotice("Audio could not start in this browser."); }
  }
  return { playingId, listen, stop, audioNotice };
}

export function ResponseActions({ turn, feedback, disabled, playing, listen, onFeedback }: {
  turn: Turn; feedback?: Session["responseFeedback"][number]; disabled: boolean;
  playing: boolean; listen: () => void;
  onFeedback: (rating: "helpful" | "not_helpful" | null) => void;
}) {
  const [copyState, setCopyState] = useState("");
  useEffect(() => {
    if (!copyState) return;
    const timer = window.setTimeout(() => setCopyState(""), 3000);
    return () => window.clearTimeout(timer);
  }, [copyState]);
  async function copy() {
    try { await navigator.clipboard.writeText(turn.text); setCopyState("Copied"); }
    catch { setCopyState("Could not copy. Select the response text to copy it."); }
  }
  return <>
    <div className="response-actions" role="group" aria-label="Response actions">
      <button className="response-listen" onClick={listen} aria-pressed={playing} title="Read aloud using a voice on this device"><ActionIcon kind={playing ? "stop" : "listen"}/>{playing ? "Stop listening" : "Listen"}</button>
      <span className="response-action-divider" aria-hidden="true"/>
      <button disabled={disabled} aria-label="Helpful response" title="Helpful response" aria-pressed={feedback?.rating === "helpful"} onClick={() => onFeedback(feedback?.rating === "helpful" ? null : "helpful")}><ActionIcon kind="up"/></button>
      <button disabled={disabled} aria-label="Unhelpful response" title="Unhelpful response" aria-pressed={feedback?.rating === "not_helpful"} onClick={() => onFeedback(feedback?.rating === "not_helpful" ? null : "not_helpful")}><ActionIcon kind="down"/></button>
      <button aria-label="Copy response" title="Copy response" onClick={() => void copy()}><ActionIcon kind="copy"/></button>
    </div>
    <span className="response-action-status" role="status">{copyState || (feedback ? "Feedback saved for this session" : "")}</span>
  </>;
}
