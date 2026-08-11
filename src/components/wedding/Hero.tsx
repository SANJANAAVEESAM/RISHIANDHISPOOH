import couplePhoto from "@/assets/couple.jpg";
import { COUPLE } from "./data";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/** How much of its height the card gives up across the scroll, in percent. */
const COLLAPSE = 48;

/**
 * Scene 4 — full-bleed photo card on cream. It stays pinned to the top and
 * collapses in height as you scroll, the type riding its rising bottom edge,
 * until the cream page and the invitation line take over beneath it.
 */
export function Hero({ live }: { live: boolean }) {
  const [wrapRef, progress] = useScrollProgress<HTMLDivElement>();

  return (
    <div ref={wrapRef} id="home" className="relative h-[135vh]">
      {/* Sits above the next section, which is pulled up underneath it — the
          card stays opaque until it has collapsed out of the way. */}
      <div
        className="sticky top-0 z-10 flex h-[100dvh] items-center p-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <div
          className="relative w-full overflow-hidden rounded-[24px]"
          style={{
            // Not the full screen. A full-height card is an aspect of about
            // 0.48, and the drawing is 0.75 — filling that would have meant
            // throwing away a third of it or standing the couple in a well of
            // empty cream. At 78% the frame is close to the artwork's own.
            height: `${(78 - progress * COLLAPSE).toFixed(2)}%`,
            boxShadow: "var(--shadow-paper)",
            // The card's own field, and the same cream the drawing was
            // multiplied onto, so the artwork has no edge of its own.
            background: "var(--background)",
          }}
        >
          {/* Contained, not covering. This is a drawing, not a photograph:
              cropping it to fill would cut an arm or a foot on some phones,
              and against flat ground the space left over is invisible.
              Anchored to the top, with the foot of the box kept for the names.
              No slow zoom either — on flat line art it reads as a wobble. */}
          <img
            src={couplePhoto}
            alt={`An illustration of ${COUPLE.bride} and ${COUPLE.groom}`}
            width={820}
            height={1090}
            className="absolute inset-0 h-full w-full object-contain object-top"
            style={{ padding: "2% 3% 21%" }}
          />

          {/* Cream, not shade. The names below are ink on a pale field now, so
              the dark scrim that used to sit here would be a bruise across the
              foot of a white drawing. This only lifts the figures clear. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 52%, oklch(0.965 0.012 80 / 0.88) 78%, oklch(0.965 0.012 80) 100%)",
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0 px-[7%]"
            style={{
              paddingBottom: "2.75rem",
              opacity: live ? 1 : 0,
              transition: live ? "opacity 1100ms ease 250ms" : undefined,
            }}
          >
            {/* Ink, not white. The field under it is cream now — white type
                would simply be gone, and the shadow that used to carry it over
                sand has nothing to do here. */}
            <h1
              className="text-center font-display leading-[1.08] text-ink-strong italic"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 3.5rem)",
                // Explicit: the h1 rule's 600 has no italic cut here and would fake-bold.
                fontWeight: 400,
              }}
            >
              {COUPLE.bride} &amp; {COUPLE.groom}
            </h1>

            <div className="mt-7 h-px w-full bg-foreground/25" />

            <div className="mt-5 flex items-center justify-between">
              <span
                aria-hidden="true"
                className="animate-scroll-nudge font-body text-sm text-foreground/50"
              >
                ↓
              </span>
              <span className="font-body text-[0.62rem] font-light tracking-[0.34em] text-foreground/60 uppercase">
                Scroll to Explore
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
