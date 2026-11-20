import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

export type SwapCard = { id: string; title: string; category: string };
const slot = (k: number) => `translate3d(${k * 34}px, ${-k * 26}px, ${-k * 70}px) skewY(6deg)`;

/** Adapted from the supplied CardSwap: flat paint order, rubber drag, 600ms settle. */
export function CardSwap({ cards, selectedId, onSelect }: {
  cards: SwapCard[]; selectedId: string; onSelect: (id: string) => void;
}) {
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const unhook = useRef(() => {});
  const dragged = useRef(false);
  const keyboardSwap = useRef(false);
  const index = Math.max(0, cards.findIndex(c => c.id === selectedId));
  const order = [...cards.slice(index), ...cards.slice(0, index)];
  const settle = () => Object.values(els.current).forEach(el => {
    if (el) { el.style.transition = ""; el.style.transform = ""; }
  });
  useEffect(() => () => unhook.current(), []);
  useEffect(() => {
    unhook.current(); settle();
    if (keyboardSwap.current) { els.current[selectedId]?.focus(); keyboardSwap.current = false; }
  }, [selectedId]);
  const next = () => { settle(); if (order.length > 1) onSelect(order[1].id); };
  const grab = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    unhook.current();
    dragged.current = false;
    const el = event.currentTarget, start = performance.now();
    const x0 = event.clientX, y0 = event.clientY, pid = event.pointerId;
    let dx = 0, dy = 0;
    el.style.transition = "none";
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      dx = e.clientX - x0; dy = e.clientY - y0;
      dragged.current = Math.hypot(dx, dy) > 6;
      const x = 160 * Math.tanh(dx / 160), y = 160 * Math.tanh(dy / 160);
      el.style.transform = `${slot(0)} translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(x * .05).toFixed(2)}deg)`;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      unhook.current();
      const distance = Math.hypot(dx, dy);
      const quick = distance / Math.max(1, performance.now() - start) > .6;
      if (e.type !== "pointercancel" && (distance > 70 || (quick && distance > 24))) next();
      else settle();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    unhook.current = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      unhook.current = () => {};
    };
  };
  return <div className="card-swap-browser">
    <div className="csw"><div className="csw-stage">
      {cards.map((card, i) => {
        const k = order.findIndex(c => c.id === card.id), front = k === 0;
        return <button key={card.id} ref={el => { els.current[card.id] = el; }}
          className="csw-card" data-front={front || undefined} data-tone={i % 3}
          hidden={k > 3} tabIndex={front ? 0 : -1} aria-hidden={!front}
          aria-label={`${card.title}. Show next card`}
          style={{ zIndex: cards.length - k, "--t": slot(k) } as CSSProperties}
          onPointerDown={front ? grab : undefined}
          onClick={e => { if (front && (!dragged.current || e.detail === 0)) { keyboardSwap.current = e.detail === 0; next(); } dragged.current = false; }}>
          <img className="csw-photo" src="/images/humanities-background.png" alt="" draggable={false} style={{objectPosition:`${20 + i * 13 % 70}% center`}} />
          <span className="csw-number">{String(i + 1).padStart(2, "0")} / {cards.length}</span>
          <span className="csw-title">{card.title}</span>
          <span className="csw-tag">{card.category}</span>
        </button>;
      })}
    </div></div>
    <div className="card-swap-controls"><button aria-label="Previous card" onClick={() => onSelect(cards[(index - 1 + cards.length) % cards.length].id)}>←</button><span>{index + 1} of {cards.length} · tap or drag</span><button aria-label="Next card" onClick={next}>→</button></div>
  </div>;
}
