import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import {
  EVENT_DAYS,
  venueMapsHref,
  type EventDay,
  type WeddingEvent,
} from "@/components/wedding/data";

/**
 * SCRATCH ROUTE — eight layouts for the celebrations, on a real phone.
 *
 * Delete once one is chosen.
 */
export const Route = createFileRoute("/celebrations")({
  // The choice lives in the URL, so a layout can be linked to rather than
  // described — "look at ?l=E" beats "the fifth one".
  validateSearch: (search: Record<string, unknown>) => ({
    l: typeof search.l === "string" ? search.l.toUpperCase() : "A",
  }),
  head: () => ({
    meta: [{ title: "Celebration layouts" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Layouts,
});

type Stop = { day: EventDay; event: WeddingEvent };

const STOPS: Stop[] = EVENT_DAYS.flatMap((day) => day.events.map((event) => ({ day, event })));

/* ------------------------------ shared bits ------------------------------ */

const CARD = {
  background: "color-mix(in oklab, var(--ivory) 72%, transparent)",
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
  border: "1px solid color-mix(in oklab, var(--gold) 34%, transparent)",
  boxShadow: "0 12px 30px -18px oklch(0.32 0.03 60 / 0.45)",
} as const;

const HAIRLINE = "color-mix(in oklab, var(--gold) 34%, transparent)";

function Heading() {
  return (
    <div className="px-6 text-center">
      <p className="font-body text-[0.6rem] font-medium tracking-[0.3em] uppercase text-bronze-deep">
        The celebrations unfold
      </p>
      <h2
        className="mt-3 font-display leading-none text-foreground"
        style={{ fontSize: "clamp(1.9rem, 8.6vw, 2.4rem)" }}
      >
        What to expect
      </h2>
    </div>
  );
}

function Directions({ event, className = "" }: { event: WeddingEvent; className?: string }) {
  const href = venueMapsHref(event.venue);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 font-body text-[0.58rem] font-medium tracking-[0.16em] uppercase text-bronze-deep underline underline-offset-4 ${className}`}
    >
      Directions <span aria-hidden="true">↗</span>
    </a>
  );
}

function Venue({ event, center = true }: { event: WeddingEvent; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="font-display text-[1.05rem] leading-tight text-ink-strong">{event.venue.name}</p>
      {event.venue.address && (
        <p className="mt-1 font-body text-[0.74rem] leading-snug text-muted-foreground">
          {event.venue.address}
        </p>
      )}
      <Directions event={event} className="mt-3" />
    </div>
  );
}

const dateLine = (day: EventDay) => `${day.weekday}, ${day.date}`;
const ordinal = (i: number) => String(i + 1).padStart(2, "0");

/* --------------------------------- A: swipe -------------------------------- */

function Swipe() {
  return (
    <>
      <Heading />
      <div
        className="no-scrollbar mt-10 overflow-x-auto overflow-y-hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex w-max items-stretch gap-4 px-6">
          {STOPS.map(({ day, event }, i) => (
            <article
              key={event.slug}
              className="relative flex w-[16.5rem] shrink-0 flex-col overflow-hidden rounded-[20px] px-5 pt-8 pb-6 text-center"
              style={{ ...CARD, scrollSnapAlign: "center" }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "var(--gradient-gold)" }}
              />
              <span
                aria-hidden="true"
                className="absolute top-3 right-4 font-body text-[0.55rem] tracking-[0.16em] text-bronze-deep/55"
              >
                {ordinal(i)}
              </span>
              <p className="font-body text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep">
                {dateLine(day)}
              </p>
              <h3 className="mt-2 font-display text-[1.55rem] leading-tight font-semibold text-ink-strong">
                {event.name}
              </h3>
              <p className="mt-1 font-display text-[1.05rem] text-muted-foreground">{event.time}</p>
              <div className="mt-auto pt-6">
                <span
                  aria-hidden="true"
                  className="mx-auto mb-5 block h-px w-10"
                  style={{ background: "color-mix(in oklab, var(--gold) 55%, transparent)" }}
                />
                <Venue event={event} />
              </div>
            </article>
          ))}
        </div>
      </div>
      <p className="mt-7 px-6 text-center font-body text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground/70">
        <span aria-hidden="true">←</span> Swipe through the days <span aria-hidden="true">→</span>
      </p>
    </>
  );
}

/* ------------------------------- B: spine ------------------------------- */

function Spine() {
  return (
    <>
      <Heading />
      <div className="relative mt-10 pl-12">
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[1.35rem] w-px"
          style={{ background: "color-mix(in oklab, var(--gold) 50%, transparent)" }}
        />
        {STOPS.map(({ day, event }, i) => (
          // relative, or the dot resolves against the whole track and every
          // one of them lands on the first row.
          <div key={event.slug} className="relative pb-9">
            {/* The row is the containing block, and the row starts at the
                track's 3rem padding — so reaching the spine at 1.35rem means
                going back 1.65rem, not forward to it. */}
            <span
              aria-hidden="true"
              className="absolute size-[11px] -translate-x-1/2 rounded-full"
              style={{
                left: "-1.65rem",
                background: "var(--gold)",
                marginTop: "0.4rem",
                boxShadow: "0 0 0 4px var(--background)",
              }}
            />
            <p className="font-body text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep">
              {dateLine(day)}
            </p>
            <h3 className="mt-1.5 font-display text-[1.5rem] leading-tight font-semibold text-ink-strong">
              {event.name}
            </h3>
            <p className="font-display text-[1rem] text-muted-foreground">{event.time}</p>
            <div className="mt-3">
              <Venue event={event} center={false} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------------------- C: alternating ---------------------------- */

function Alternating() {
  return (
    <>
      <Heading />
      <div className="relative mt-10">
        <span
          aria-hidden="true"
          className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2"
          style={{ background: "color-mix(in oklab, var(--gold) 50%, transparent)" }}
        />
        {STOPS.map(({ day, event }, i) => {
          const left = i % 2 === 0;
          return (
            <div key={event.slug} className="relative pb-8">
              <span
                aria-hidden="true"
                className="absolute left-1/2 size-[10px] -translate-x-1/2 rounded-full"
                style={{
                  background: "var(--gold)",
                  marginTop: "0.35rem",
                  boxShadow: "0 0 0 4px var(--background)",
                }}
              />
              <div className={left ? "pr-[55%] text-right" : "ml-[55%] text-left"}>
                {/* The weekday is dropped on this one. Alternating columns are
                    45% of a phone, and "Wednesday, 19 August" under 0.14em of
                    tracking runs straight off the edge. */}
                <p className="font-body text-[0.58rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase text-bronze-deep">
                  {day.date}
                </p>
                <h3 className="mt-1 font-display text-[1.25rem] leading-tight font-semibold text-ink-strong">
                  {event.name}
                </h3>
                <p className="font-display text-[0.95rem] text-muted-foreground">{event.time}</p>
                <p className="mt-1.5 font-body text-[0.72rem] leading-snug text-muted-foreground">
                  {event.venue.name}
                </p>
                <Directions event={event} className="mt-2" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------ D: stacked ------------------------------ */

function Stacked() {
  return (
    <>
      <Heading />
      <div className="mt-10 flex flex-col gap-4 px-5">
        {STOPS.map(({ day, event }, i) => (
          <article
            key={event.slug}
            className="relative overflow-hidden rounded-[20px] px-6 py-7 text-center"
            style={CARD}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--gradient-gold)" }}
            />
            <span
              aria-hidden="true"
              className="absolute top-3 right-4 font-body text-[0.55rem] tracking-[0.16em] text-bronze-deep/55"
            >
              {ordinal(i)}
            </span>
            <p className="font-body text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep">
              {dateLine(day)}
            </p>
            <h3 className="mt-2 font-display text-[1.6rem] leading-tight font-semibold text-ink-strong">
              {event.name}
            </h3>
            <p className="mt-0.5 font-display text-[1.05rem] text-muted-foreground">{event.time}</p>
            <span
              aria-hidden="true"
              className="mx-auto my-4 block h-px w-10"
              style={{ background: "color-mix(in oklab, var(--gold) 55%, transparent)" }}
            />
            <Venue event={event} />
          </article>
        ))}
      </div>
    </>
  );
}

/* ------------------------------ E: editorial ----------------------------- */

function Editorial() {
  return (
    <>
      <Heading />
      <div className="mt-10 px-5">
        {STOPS.map(({ day, event }, i) => (
          <div
            key={event.slug}
            className="flex gap-4 py-6"
            style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}` }}
          >
            <span
              aria-hidden="true"
              className="shrink-0 font-display text-[2.1rem] leading-none text-bronze/35"
            >
              {ordinal(i)}
            </span>
            <div className="min-w-0 flex-1">
              {/* The date sits above the name rather than opposite it. Set on
                  the same line, a tracked date and "Wedding Ceremony" together
                  are wider than a phone, and something has to give. */}
              <p className="font-body text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep">
                {dateLine(day)}
              </p>
              <h3 className="mt-1 font-display text-[1.5rem] leading-tight font-semibold text-ink-strong">
                {event.name}
              </h3>
              <p className="font-display text-[1rem] text-muted-foreground">{event.time}</p>
              <p className="mt-2 font-body text-[0.76rem] leading-snug text-foreground/80">
                {event.venue.name}
              </p>
              {event.venue.address && (
                <p className="font-body text-[0.72rem] leading-snug text-muted-foreground">
                  {event.venue.address}
                </p>
              )}
              <Directions event={event} className="mt-2" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------ F: accordion ----------------------------- */

function Accordion() {
  const [open, setOpen] = useState<string | null>(STOPS[0]?.event.slug ?? null);

  return (
    <>
      <Heading />
      <div className="mt-10 px-5">
        {STOPS.map(({ day, event }, i) => {
          const isOpen = open === event.slug;
          return (
            <div key={event.slug} style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}` }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : event.slug)}
                className="flex w-full items-center justify-between gap-3 py-5 text-left"
              >
                <span className="min-w-0">
                  <span className="block font-body text-[0.62rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep">
                    {dateLine(day)}
                  </span>
                  <span className="mt-1 block font-display text-[1.45rem] leading-tight font-semibold text-ink-strong">
                    {event.name}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-body text-[1.1rem] text-bronze transition-transform"
                  style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all"
                style={{
                  maxHeight: isOpen ? "14rem" : 0,
                  opacity: isOpen ? 1 : 0,
                  transitionDuration: "320ms",
                }}
              >
                <div className="pb-6">
                  <p className="font-display text-[1.05rem] text-muted-foreground">{event.time}</p>
                  <div className="mt-2">
                    <Venue event={event} center={false} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------- G: agenda ------------------------------- */

function Agenda() {
  return (
    <>
      <Heading />
      <div className="mt-10 px-5">
        {EVENT_DAYS.map((day, i) => (
          <div key={day.date} className={i === 0 ? "" : "mt-9"}>
            <div className="flex items-center gap-3">
              <span className="font-display text-[1.7rem] leading-none text-ink-strong">
                {day.date.split(" ")[0]}
              </span>
              <span className="font-body text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-bronze-deep">
                {day.date.split(" ").slice(1).join(" ")}
                <span aria-hidden="true"> · </span>
                {day.weekday}
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1"
                style={{ background: HAIRLINE }}
              />
            </div>

            {day.events.map((event) => (
              <div key={event.slug} className="mt-4 pl-1">
                <div className="flex items-baseline gap-2.5">
                  <h3 className="font-display text-[1.35rem] leading-tight font-semibold text-ink-strong">
                    {event.name}
                  </h3>
                  <span className="font-display text-[0.95rem] text-muted-foreground">
                    {event.time}
                  </span>
                </div>
                <p className="mt-1 font-body text-[0.76rem] leading-snug text-foreground/80">
                  {event.venue.name}
                  {event.venue.address ? ` · ${event.venue.address}` : ""}
                </p>
                <Directions event={event} className="mt-1.5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------- H: stubs -------------------------------- */

function Stubs() {
  return (
    <>
      <Heading />
      <div className="mt-10 flex flex-col gap-4 px-5">
        {STOPS.map(({ day, event }) => {
          const [dayNum, ...monthRest] = day.date.split(" ");
          return (
            <article
              key={event.slug}
              className="relative flex overflow-hidden rounded-[18px]"
              style={CARD}
            >
              {/* The stub */}
              <div
                className="flex w-[5.6rem] shrink-0 flex-col items-center justify-center py-6"
                style={{ background: "color-mix(in oklab, var(--gold) 13%, transparent)" }}
              >
                <span className="font-display text-[1.9rem] leading-none text-ink-strong">
                  {dayNum}
                </span>
                <span className="mt-1 font-body text-[0.55rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep">
                  {monthRest.join(" ").slice(0, 3)}
                </span>
                <span className="mt-0.5 font-body text-[0.52rem] tracking-[0.12em] uppercase text-muted-foreground">
                  {day.weekday.slice(0, 3)}
                </span>
              </div>

              {/* The perforation */}
              <span
                aria-hidden="true"
                className="w-px shrink-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, ${HAIRLINE} 0 5px, transparent 5px 10px)`,
                }}
              />

              <div className="min-w-0 flex-1 px-4 py-5">
                <h3 className="font-display text-[1.4rem] leading-tight font-semibold text-ink-strong">
                  {event.name}
                </h3>
                <p className="font-display text-[0.98rem] text-muted-foreground">{event.time}</p>
                <p className="mt-2 font-body text-[0.74rem] leading-snug text-foreground/80">
                  {event.venue.name}
                </p>
                <Directions event={event} className="mt-1.5" />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

/* -------------------------------- switcher -------------------------------- */

const LAYOUTS: { key: string; name: string; node: ReactNode }[] = [
  { key: "A", name: "Swipe tiles — live now", node: <Swipe /> },
  { key: "B", name: "Timeline with a spine", node: <Spine /> },
  { key: "C", name: "Alternating timeline", node: <Alternating /> },
  { key: "D", name: "Stacked cards", node: <Stacked /> },
  { key: "E", name: "Editorial index", node: <Editorial /> },
  { key: "F", name: "Accordion", node: <Accordion /> },
  { key: "G", name: "Grouped by day", node: <Agenda /> },
  { key: "H", name: "Ticket stubs", node: <Stubs /> },
];

function Layouts() {
  const { l } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const found = LAYOUTS.findIndex((x) => x.key === l);
  const i = found === -1 ? 0 : found;

  return (
    <main className="relative mx-auto w-full max-w-[26rem]">
      <div className="pt-14" style={{ paddingBottom: "13rem" }}>
        {LAYOUTS[i].node}
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[26rem] flex-col items-center gap-2 px-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <p className="glass rounded-full px-4 py-1.5 font-body text-[0.62rem] tracking-[0.14em] text-foreground/80 uppercase">
          {LAYOUTS[i].key} · {LAYOUTS[i].name}
        </p>
        <div className="glass flex gap-1 rounded-full p-1.5">
          {LAYOUTS.map((l2, idx) => (
            <button
              key={l2.key}
              type="button"
              onClick={() => {
                void navigate({ search: { l: l2.key }, replace: true });
                window.scrollTo({ top: 0 });
              }}
              className="flex size-8 items-center justify-center rounded-full font-body text-[0.75rem]"
              style={{
                background: idx === i ? "var(--bronze)" : "transparent",
                color: idx === i ? "var(--primary-foreground)" : "var(--foreground)",
              }}
            >
              {l2.key}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
