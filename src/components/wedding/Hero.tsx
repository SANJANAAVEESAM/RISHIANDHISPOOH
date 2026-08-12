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
            // Not the full screen. A full-height card is an aspect of about
            // 0.48 against the photograph's 0.75, which crops away a third of
            // its width. At 78% the frame is nearer what was shot.
            height: `${(78 - progress * COLLAPSE).toFixed(2)}%`,
            boxShadow: "var(--shadow-paper)",
          }}
        >
          {/* A photograph again, so it fills the frame. Centred: the couple sit
              in the middle of it, and the card's aspect varies enough between
              phones that any bias would favour one handset over another. */}
          <img
            src={couplePhoto}
            alt={`${COUPLE.bride} and ${COUPLE.groom}`}
            width={768}
            height={1024}
            className="animate-hero-zoom absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Enough shading under the type to hold white over a pale frame */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 44%, oklch(0.28 0.03 60 / 0.18) 66%, oklch(0.22 0.03 60 / 0.5) 100%)",
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
            <h1
              className="text-center font-display leading-[1.08] text-white italic"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 3.5rem)",
                // Explicit: the h1 rule's 600 has no italic cut here and would fake-bold.
                fontWeight: 400,
                textShadow: "0 2px 18px oklch(0.24 0.03 60 / 0.4)",
              }}
            >
              {COUPLE.bride} &amp; {COUPLE.groom}
            </h1>

            <div className="mt-7 h-px w-full bg-white/45" />

            <div className="mt-5 flex items-center justify-between">
              <span
                aria-hidden="true"
                className="animate-scroll-nudge font-body text-sm text-white/60"
              >
                ↓
              </span>
              <span className="font-body text-[0.62rem] font-light tracking-[0.34em] text-white/65 uppercase">
                Scroll to Explore
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
