import { useEffect, useRef, useState, type ReactNode } from "react";
import { CardSwap, type SwapCard } from "./components/ui/card-swap";
import { Seek } from "./components/ui/seek";

export function CardPicker({ title, intro, side, cards, onClose, children, footer }: {
  title: string; intro: string; side: "left" | "right"; cards: SwapCard[];
  onClose: () => void; children: (id: string) => ReactNode; footer?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(cards[0].id);
  const [query, setQuery] = useState("");
  const returnToPreview = useRef(false);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => { element?.close(); trigger?.focus(); };
  }, []);
  useEffect(() => {
    if (returnToPreview.current) {
      dialog.current?.scrollTo({top:0, behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
      returnToPreview.current = false;
    }
  }, [selected]);
  const filtered = cards.filter(card => `${card.id} ${card.title} ${card.category}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <dialog ref={dialog} className={`card-picker card-picker-${side}`} aria-labelledby={`picker-${side}-title`} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="picker-heading"><div><h2 id={`picker-${side}-title`}>{title}</h2></div><button className="picker-close" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}>×</button></header>
    <p className="picker-intro">{intro}</p>
    <div className="picker-layout"><CardSwap cards={cards} selectedId={selected} onSelect={setSelected}/><section className="picker-detail" aria-live="polite">{children(selected)}</section></div>
    <div className="picker-list-heading"><span>{query ? `${filtered.length} found` : "Choose a card"}</span><Seek onValueChange={setQuery} label={`Search ${title.toLowerCase()}`} /></div>
    <div className="picker-list" data-filtered={!!query.trim()} aria-label={`All ${title.toLowerCase()}`}>
      {filtered.map(card => <button key={card.id} title={card.title} aria-label={`${String(cards.indexOf(card) + 1).padStart(2,"0")} ${card.title}`} aria-pressed={selected === card.id} onClick={() => { returnToPreview.current = true; setSelected(card.id); }}><span>{String(cards.indexOf(card) + 1).padStart(2,"0")}</span>{!!query.trim() && <strong>{card.title}</strong>}</button>)}
      {!filtered.length && <p className="picker-empty">No matching cards. Try a different word.</p>}
    </div>
    {footer}
  </dialog>;
}
