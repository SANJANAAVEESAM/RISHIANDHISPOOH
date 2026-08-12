import couplePhoto from "@/assets/couple.jpg";
import { COUPLE_AMP, COUPLE_AND } from "./data";
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
 * Its foot dissolves rather than stopping: the picture is masked away over the
 * last stretch so it melts into the page instead of ending on a ruled line —
 * which is what the collapsing edge looked like on the way up.
 *
 * Pinned to the top and collapsing as you scroll, the names riding the rising
 * bottom edge, until the section below takes over.
 */
export function Hero({ live }: { live: boolean }) {
  const [wrapRef, progress] = useScrollProgress<HTMLDivElement>();

  return (
    <div ref={wrapRef} id="home" className="relative h-[135vh]">
      <div
        className="sticky top-0 z-10 h-[100dvh]"
        role="img"
        aria-label={`An illustrated portrait of ${COUPLE_AND}`}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${(100 - progress * COLLAPSE).toFixed(2)}%`,
            // Opaque. The opening lines are pulled up underneath the hero and
            // are hidden only by whatever covers this box.
            background: "var(--background)",
          }}
        >
          {/* The picture and its veil are masked together so they dissolve as
              one. Fading only the picture would leave the veil behind as a
              grey film over the cream, which is a worse edge than the hard one
              it replaces. The cream showing through is the box's own
              background, so there is nothing to keep in step with the page. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              maskImage: "linear-gradient(to bottom, #000 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 88%, transparent 100%)",
            }}
          >
            <img
              src={couplePhoto}
              alt=""
              width={1000}
              height={1333}
              // Sharp. A blur was tried across the whole picture and softened
              // the couple with it, which is the one thing on this screen that
              // should be in focus. Only the bottom edge is soft now.
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.2 0.03 55 / 0.2), oklch(0.2 0.03 55 / 0.06) 42%, oklch(0.2 0.03 55 / 0.2) 70%, oklch(0.18 0.03 55 / 0.5))",
              }}
            />
          </div>

          <div
            className="absolute inset-x-0 bottom-0 px-[7%]"
            style={{
              // Clear of the dissolve. The fade takes the bottom 12% of the
              // box, and white type inside it would be fading towards cream —
              // so the whole caption sits above where the fade begins.
              paddingBottom: "calc(env(safe-area-inset-bottom) + 16vh)",
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
              {COUPLE_AMP}
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
