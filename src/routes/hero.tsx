import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import couplePhoto from "@/assets/couple.jpg";
import navMark from "@/assets/monogram-mark.png";
import { COUPLE, WEDDING_DATE_RANGE } from "@/components/wedding/data";

/**
 * SCRATCH ROUTE — eight treatments for the hero, at full screen.
 *
 * These are about the look, not the choreography: each is shown at rest,
 * without the card's collapse on scroll. Whichever is chosen keeps the
 * existing behaviour — pinned to the top, foot rising as you scroll.
 *
 * Delete once one is picked.
 */
export const Route = createFileRoute("/hero")({
  validateSearch: (search: Record<string, unknown>) => ({
    h: typeof search.h === "string" ? search.h.toUpperCase() : "A",
  }),
  head: () => ({
    meta: [{ title: "Hero options" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: HeroOptions,
});

const SHADOW = "var(--shadow-paper)";
const NAMES = `${COUPLE.bride} & ${COUPLE.groom}`;

/** The dark wash that lets white type sit over the picture. */
function Scrim({ from = 44 }: { from?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background: `linear-gradient(180deg, transparent ${from}%, oklch(0.28 0.03 60 / 0.18) ${from + 22}%, oklch(0.22 0.03 60 / 0.5) 100%)`,
      }}
    />
  );
}

function Photo({ className = "" }: { className?: string }) {
  return (
    <img
      src={couplePhoto}
      alt={`${COUPLE.bride} and ${COUPLE.groom}`}
      className={`absolute inset-0 h-full w-full object-cover object-center ${className}`}
    />
  );
}

/** White names over the picture, with the rule and the scroll cue. */
function WhiteCaption({ size = "clamp(2.5rem, 12vw, 3.5rem)" }: { size?: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 px-[7%]" style={{ paddingBottom: "2.75rem" }}>
      <h1
        className="text-center font-display leading-[1.08] text-white italic"
        style={{ fontSize: size, fontWeight: 400, textShadow: "0 2px 18px oklch(0.24 0.03 60 / 0.4)" }}
      >
        {NAMES}
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
  );
}

/** Ink names on cream, for the treatments that put type off the picture. */
function InkCaption({ size = "clamp(2.2rem, 10.5vw, 3rem)" }: { size?: string }) {
  return (
    <>
      <h1
        className="text-center font-display leading-[1.08] text-ink-strong italic"
        style={{ fontSize: size, fontWeight: 400 }}
      >
        {NAMES}
      </h1>
      <p className="mt-3 text-center font-body text-[0.6rem] font-medium tracking-[0.28em] uppercase text-bronze-deep">
        {WEDDING_DATE_RANGE}
      </p>
    </>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      className="h-[100dvh] p-3"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
    >
      {children}
    </div>
  );
}

/* --------------------------------- options --------------------------------- */

/** A — what is live: full-bleed card, names over the foot. */
function AsIs() {
  return (
    <Frame>
      <div
        className="relative h-full w-full overflow-hidden rounded-[24px]"
        style={{ boxShadow: SHADOW }}
      >
        <Photo />
        <Scrim />
        <WhiteCaption />
      </div>
    </Frame>
  );
}

/** B — names on cream above, picture beneath. */
function NamesAbove() {
  return (
    <Frame>
      <div className="flex h-full flex-col">
        <div className="shrink-0 px-4 pt-6 pb-5">
          <InkCaption size="clamp(2rem, 9.5vw, 2.7rem)" />
        </div>
        <div
          className="relative min-h-0 flex-1 overflow-hidden rounded-[24px]"
          style={{ boxShadow: SHADOW }}
        >
          <Photo />
        </div>
      </div>
    </Frame>
  );
}

/** C — picture on top, a cream panel with the type beneath it. */
function Split() {
  return (
    <Frame>
      <div className="flex h-full flex-col">
        <div
          className="relative min-h-0 flex-1 overflow-hidden rounded-[24px]"
          style={{ boxShadow: SHADOW }}
        >
          <Photo />
        </div>
        <div className="shrink-0 px-4 pt-7 pb-3">
          <InkCaption size="clamp(2rem, 9.5vw, 2.7rem)" />
          <div className="mt-6 flex items-center justify-between">
            <span aria-hidden="true" className="font-body text-sm text-foreground/45">
              ↓
            </span>
            <span className="font-body text-[0.6rem] font-light tracking-[0.34em] text-foreground/55 uppercase">
              Scroll to Explore
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** D — matted, the way a print is framed, with the names inside the mat. */
function Matted() {
  return (
    <Frame>
      <div
        className="flex h-full flex-col rounded-[20px] px-4 pt-4 pb-6"
        style={{
          background: "color-mix(in oklab, var(--ivory) 88%, transparent)",
          border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
          boxShadow: SHADOW,
        }}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[12px]">
          <Photo />
        </div>
        <div className="shrink-0 pt-6">
          <InkCaption size="clamp(1.9rem, 9vw, 2.5rem)" />
        </div>
      </div>
    </Frame>
  );
}

/** E — the names centred over the picture, under an even wash. */
function Centred() {
  return (
    <Frame>
      <div
        className="relative h-full w-full overflow-hidden rounded-[24px]"
        style={{ boxShadow: SHADOW }}
      >
        <Photo />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "oklch(0.24 0.03 60 / 0.3)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <h1
            className="text-center font-display leading-[1.06] text-white italic"
            style={{
              fontSize: "clamp(2.6rem, 13vw, 3.8rem)",
              fontWeight: 400,
              textShadow: "0 2px 22px oklch(0.24 0.03 60 / 0.45)",
            }}
          >
            {NAMES}
          </h1>
          <span aria-hidden="true" className="mt-6 h-px w-16 bg-white/55" />
          <p className="mt-6 font-body text-[0.62rem] font-light tracking-[0.3em] uppercase text-white/80">
            {WEDDING_DATE_RANGE}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-8">
          <span className="font-body text-[0.58rem] font-light tracking-[0.34em] uppercase text-white/65">
            Scroll <span aria-hidden="true">↓</span>
          </span>
        </div>
      </div>
    </Frame>
  );
}

/** F — an arched crown, after the Charminar's own. */
function Arch() {
  return (
    <Frame>
      <div className="flex h-full flex-col">
        <div
          className="relative min-h-0 flex-1 overflow-hidden"
          style={{
            borderRadius: "50% 50% 20px 20px / 24% 24% 20px 20px",
            boxShadow: SHADOW,
          }}
        >
          <Photo />
        </div>
        <div className="shrink-0 pt-7 pb-2">
          <InkCaption size="clamp(2rem, 9.5vw, 2.7rem)" />
        </div>
      </div>
    </Frame>
  );
}

/** G — no card at all: the picture runs to the edges of the screen. */
function FullBleed() {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <Photo />
      <Scrim from={40} />
      <WhiteCaption size="clamp(2.7rem, 13vw, 3.8rem)" />
    </div>
  );
}

/** H — the couple's mark above their names, over the picture. */
function Monogram() {
  return (
    <Frame>
      <div
        className="relative h-full w-full overflow-hidden rounded-[24px]"
        style={{ boxShadow: SHADOW }}
      >
        <Photo />
        <Scrim from={38} />
        <div className="absolute inset-x-0 bottom-0 px-[7%]" style={{ paddingBottom: "2.75rem" }}>
          <img
            src={navMark}
            alt=""
            aria-hidden="true"
            className="mx-auto h-14 w-auto"
            style={{ filter: "brightness(0) invert(1) opacity(0.92)" }}
          />
          <h1
            className="mt-4 text-center font-display leading-[1.08] text-white italic"
            style={{
              fontSize: "clamp(2.3rem, 11vw, 3.2rem)",
              fontWeight: 400,
              textShadow: "0 2px 18px oklch(0.24 0.03 60 / 0.4)",
            }}
          >
            {NAMES}
          </h1>
          <p className="mt-4 text-center font-body text-[0.58rem] font-light tracking-[0.3em] uppercase text-white/70">
            {WEDDING_DATE_RANGE}
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* -------------------------------- switcher -------------------------------- */

const OPTIONS: { key: string; name: string; node: ReactNode }[] = [
  { key: "A", name: "As it is now", node: <AsIs /> },
  { key: "B", name: "Names above the picture", node: <NamesAbove /> },
  { key: "C", name: "Split — type on cream below", node: <Split /> },
  { key: "D", name: "Matted, like a framed print", node: <Matted /> },
  { key: "E", name: "Names centred over it", node: <Centred /> },
  { key: "F", name: "Arched crown", node: <Arch /> },
  { key: "G", name: "Full bleed, no card", node: <FullBleed /> },
  { key: "H", name: "Monogram lockup", node: <Monogram /> },
];

function HeroOptions() {
  const { h } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const found = OPTIONS.findIndex((o) => o.key === h);
  const i = found === -1 ? 0 : found;

  return (
    <main className="relative mx-auto w-full max-w-[26rem]">
      {OPTIONS[i].node}

      {/* At the top, not the foot. Most of these treatments put the names
          along the bottom edge, which is exactly what a switcher parked there
          covers up. */}
      <div
        className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-[26rem] flex-col items-center gap-2 px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.5rem)" }}
      >
        <div className="glass flex max-w-full flex-wrap justify-center gap-1 rounded-2xl p-1.5">
          {OPTIONS.map((o, idx) => (
            <button
              key={o.key}
              type="button"
              onClick={() => void navigate({ search: { h: o.key }, replace: true })}
              className="flex size-9 items-center justify-center rounded-full font-body text-[0.8rem]"
              style={{
                background: idx === i ? "var(--bronze)" : "transparent",
                color: idx === i ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {o.key}
            </button>
          ))}
        </div>
        <p className="glass rounded-full px-4 py-1.5 font-body text-[0.62rem] tracking-[0.14em] text-foreground/80 uppercase">
          {OPTIONS[i].key} · {OPTIONS[i].name}
        </p>
      </div>
    </main>
  );
}
