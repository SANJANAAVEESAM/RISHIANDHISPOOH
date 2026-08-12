import couplePhoto from "@/assets/couple.jpg";
import { COUPLE } from "./data";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/** How much of its height the hero gives up across the scroll, in percent. */
const COLLAPSE = 48;

/**
 * Scene 4 — the couple filling the screen, their names along the foot.
 *
 * The picture is softened by a blur and held under a light warm veil. It began
 * as a pale wash at a fifth opacity, which looked washed out, then went too far
 * the other way into something near black; this sits between, and the softening
 * does the work the darkness was doing.
 *
 * Pinned to the top and collapsing as you scroll, the names riding the rising
 * bottom edge, until the section below takes over.
 */
export function Hero({ live }: { live: boolean }) {
  const [wrapRef, progress] = useScrollProgress<HTMLDivElement>();

  return (
    <div ref={wrapRef} id="home" className="relative h-[135vh]">
      <div className="sticky top-0 z-10 h-[100dvh]">
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${(100 - progress * COLLAPSE).toFixed(2)}%`,
            // Opaque. The opening lines are pulled up underneath the hero and
            // are hidden only by whatever covers this box.
            background: "var(--background)",
          }}
        >
          <img
            src={couplePhoto}
            alt={`An illustrated portrait of ${COUPLE.bride} and ${COUPLE.groom}`}
            width={1000}
            height={1333}
            // Sharp. A blur was tried here to soften the ground under the
            // names and it softened the couple with it, which is the one thing
            // on this screen that should be in focus. The veil below does that
            // job instead.
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Light through the middle so the picture stays itself, drawn deeper
              at the foot where the names sit. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.2 0.03 55 / 0.34), oklch(0.2 0.03 55 / 0.14) 42%, oklch(0.2 0.03 55 / 0.28) 68%, oklch(0.18 0.03 55 / 0.6))",
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0 px-[7%]"
            style={{
              // Lifted, and now clearing the home indicator as well — the flat
              // 2.75rem it had sat under it on a modern phone.
              paddingBottom: "calc(env(safe-area-inset-bottom) + 3.75rem)",
              opacity: live ? 1 : 0,
              transition: live ? "opacity 1100ms ease 250ms" : undefined,
            }}
          >
            <h1
              className="text-center font-display leading-[1.08] whitespace-nowrap text-white italic"
              style={{
                fontSize: "clamp(2.1rem, 11vw, 3.3rem)",
                // Explicit: the h1 rule's 600 has no italic cut here and would fake-bold.
                fontWeight: 400,
                textShadow: "0 2px 18px oklch(0.24 0.03 60 / 0.4)",
              }}
            >
              {COUPLE.bride} &amp; {COUPLE.groom}
            </h1>

            {/* Fades out at both ends rather than stopping dead. A rule with
                hard ends reads as a border across the picture; this reads as
                a breath under the names. */}
            <div
              aria-hidden="true"
              className="mt-7 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.55) 22%, oklch(1 0 0 / 0.55) 78%, transparent)",
              }}
            />

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
