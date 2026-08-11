import { useEffect, useRef, type ReactNode } from "react";

import { useScrollProgress } from "@/hooks/use-scroll-progress";

const UNINKED = [201, 197, 190]; // #C9C5BE — warm gray, barely there
const INKED = [45, 41, 38]; // #2D2926 — rich charcoal

/** Eases the ramp so ink arrives gradually rather than on a linear slope. */
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function inkStyle(progress: number, [start, end]: [number, number]) {
  const t = smoothstep(clamp((progress - start) / (end - start)));
  const rgb = UNINKED.map((from, i) => Math.round(from + (INKED[i] - from) * t));
  return {
    color: `rgb(${rgb.join(", ")})`,
    opacity: 0.4 + 0.6 * t,
    // Lighter than the 1px this used to carry: the face is finer and sits at a
    // smaller size, so the old blur read as smudged rather than as arriving.
    filter: `blur(${(0.55 * (1 - t)).toFixed(2)}px)`,
  };
}

/**
 * Scroll-reveal typography — the words ink themselves onto the page, line by
 * line, tied directly to scroll position. Reverses as you scroll back up.
 *
 * `tail` arrives after the last line has finished inking, in the same pinned
 * frame, so the date and countdown land as the closing beat of the sentence
 * rather than as a separate section a screen further down.
 */
export function ScrollReveal({
  lines,
  tail,
  onTail,
}: {
  lines: string[];
  tail?: ReactNode;
  /** Fires once, when the tail is essentially in view. */
  onTail?: () => void;
}) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>();
  const fired = useRef(false);

  // Lines share the first two thirds; the tail owns the last stretch, with a
  // pause between so the final line is read before anything else moves.
  const LINES_END = 0.62;
  const span = LINES_END / lines.length;
  const ramps: [number, number][] = lines.map((_, i) => [
    0.04 + i * span,
    0.04 + i * span + span * 0.78,
  ]);
  const tailAt = clamp((progress - 0.72) / 0.16);

  useEffect(() => {
    if (!fired.current && tailAt > 0.5) {
      fired.current = true;
      onTail?.();
    }
  }, [tailAt, onTail]);

  return (
    // Pulled up into the space the hero card vacates as it collapses, so the
    // lines rise into view while the card is still pinned rather than a screen
    // and a half later.
    <div
      ref={ref}
      className="relative z-0"
      // Both numbers were trimmed to close the gap after the countdown lands.
      // The frame unpins once the container's foot reaches it — at
      // height - 92dvh of scrolling — while the tail finishes inking at
      // tailEnd × (height - 100vh). The difference is scrolling during which
      // nothing moves, and it shrinks as the container shortens and the frame
      // grows.
      style={{ height: `${120 + lines.length * 28}vh`, marginTop: "-54vh" }}
    >
      <div className="sticky top-0 flex h-[92dvh] flex-col items-center justify-center px-[5%]">
        <p
          className="w-full text-center font-accent-soft"
          style={{
            fontSize: "clamp(1.85rem, 6.5vw + 0.7rem, 2.2rem)",
            fontStyle: "italic",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.14,
          }}
        >
          {lines.map((line, i) => (
            <span key={line} className="block" style={inkStyle(progress, ramps[i])}>
              {line}
            </span>
          ))}
        </p>

        {tail && (
          <div
            className="w-full"
            style={{
              opacity: smoothstep(tailAt),
              // Rises a little as it arrives. "none" at rest rather than
              // translateY(0): a transform makes this the containing block for
              // any fixed-position child.
              transform: tailAt >= 1 ? "none" : `translateY(${((1 - tailAt) * 26).toFixed(1)}px)`,
              pointerEvents: tailAt > 0.9 ? "auto" : "none",
            }}
          >
            {tail}
          </div>
        )}
      </div>
    </div>
  );
}
