import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import couplePhoto from "@/assets/couple.jpg";
import { COUPLE } from "@/components/wedding/data";

/**
 * SCRATCH ROUTE — hero framing options, at the size they will actually be seen.
 *
 * A contact sheet on a laptop is not the same judgement as a card filling a
 * phone, and the crop changes with the screen: the frame is about 0.58 on a
 * tall handset and 0.71 on a short one, so the same object-position keeps
 * different parts of the picture. This shows the real card.
 *
 * Delete once a framing is chosen, along with public/opt-charminar.jpg.
 */
export const Route = createFileRoute("/hero")({
  head: () => ({
    meta: [{ title: "Hero options" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: HeroOptions,
});

type Option = {
  id: string;
  label: string;
  note: string;
  src: string;
  /** Percent of the screen the card fills. */
  height: number;
  position: string;
};

const CHARMINAR = "/opt-charminar.jpg";

const OPTIONS: Option[] = [
  { id: "1", label: "1", note: "Warm · centre — live now", src: couplePhoto, height: 78, position: "50% 50%" },
  { id: "2", label: "2", note: "Warm · faces higher", src: couplePhoto, height: 78, position: "46% 34%" },
  { id: "3", label: "3", note: "Warm · full height, closer", src: couplePhoto, height: 100, position: "48% 40%" },
  { id: "4", label: "4", note: "Charminar · centre", src: CHARMINAR, height: 78, position: "50% 50%" },
  { id: "5", label: "5", note: "Charminar · keeps the monument", src: CHARMINAR, height: 78, position: "62% 42%" },
  { id: "6", label: "6", note: "Charminar · full height", src: CHARMINAR, height: 100, position: "55% 40%" },
];

function HeroOptions() {
  const [idx, setIdx] = useState(0);
  const option = OPTIONS[idx];

  return (
    <main className="relative min-h-screen">
      <div
        className="flex w-full items-center p-3"
        style={{ height: "100dvh", paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <div
          className="relative w-full overflow-hidden rounded-[24px]"
          style={{ height: `${option.height}%`, boxShadow: "var(--shadow-paper)" }}
        >
          <img
            src={option.src}
            alt={`${COUPLE.bride} and ${COUPLE.groom}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: option.position }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 44%, oklch(0.28 0.03 60 / 0.18) 66%, oklch(0.22 0.03 60 / 0.5) 100%)",
            }}
          />

          <div className="absolute inset-x-0 bottom-0 px-[7%]" style={{ paddingBottom: "2.75rem" }}>
            <h1
              className="text-center font-display leading-[1.08] text-white italic"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 3.5rem)",
                fontWeight: 400,
                textShadow: "0 2px 18px oklch(0.24 0.03 60 / 0.4)",
              }}
            >
              {COUPLE.bride} &amp; {COUPLE.groom}
            </h1>
            <div className="mt-7 h-px w-full bg-white/45" />
            <div className="mt-5 flex items-center justify-between">
              <span aria-hidden="true" className="font-body text-sm text-white/60">
                ↓
              </span>
              <span className="font-body text-[0.62rem] font-light tracking-[0.34em] text-white/65 uppercase">
                Scroll to Explore
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The switcher floats over the card so the card keeps the whole screen —
          judging a hero against a shrunken preview is judging something else. */}
      <div
        className="fixed inset-x-0 bottom-0 flex flex-col items-center gap-2 px-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <p className="glass rounded-full px-4 py-1.5 font-body text-[0.62rem] tracking-[0.14em] text-foreground/80 uppercase">
          {option.note}
        </p>
        <div className="glass flex gap-1 rounded-full p-1.5">
          {OPTIONS.map((o, i) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setIdx(i)}
              className="flex size-9 items-center justify-center rounded-full font-body text-[0.8rem] transition-colors"
              style={{
                background: i === idx ? "var(--bronze)" : "transparent",
                color: i === idx ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
