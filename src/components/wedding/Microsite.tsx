import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  CONTACTS,
  COUPLE,
  COUPLE_AMP,
  DESIGNER,
  DESIGNER_URL,
  DETAIL_CARDS,
  type DetailIcon,
  EVENT_DAYS,
  EVENTS,
  FULL_WEDDING_CAL,
  GALLERY_FOLDERS,
  HOTELS,
  hotelHref,
  celebrationSpan,
  venueMapsHref,
  WELL_WISHERS,
  type WeddingEvent,
} from "./data";
import { AddToCalendar } from "./AddToCalendar";
import { Confetti } from "./Confetti";
import { Countdown } from "./Countdown";
import { DressCodeArt } from "./DressCodeArt";
import { FloatingNav } from "./FloatingNav";
import { Hero } from "./Hero";
import { Modal } from "./Modal";
import { MusicToggle } from "./MusicToggle";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";
import { ScrollReveal } from "./ScrollReveal";

/* ---------------------------------- shell ---------------------------------- */

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`w-full px-5 py-16 ${className}`}>
      <Reveal>{children}</Reveal>
    </section>
  );
}

/** Fixed botanical watermark that breathes in after the hero — background never "changes". */
function BotanicalWatermark() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setOpacity(Math.min(0.06, Math.max(0, (window.scrollY - window.innerHeight * 0.6) / window.innerHeight) * 0.06)),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 140"
      className="pointer-events-none fixed -right-16 -bottom-16 -z-10 w-[24rem]"
      style={{ opacity, transition: "opacity 300ms linear" }}
    >
      <g fill="none" stroke="var(--foreground)" strokeWidth="1">
        <path d="M18 126 C36 96 40 66 30 34" />
        <path d="M30 62 c-14 -2 -22 6 -24 16 c12 2 20 -6 24 -16" />
        <path d="M33 44 c12 -6 24 -2 28 8 c-12 4 -22 0 -28 -8" />
        <path d="M96 118 C104 96 118 84 132 80" />
        <path d="M112 96 c-2 -12 4 -20 14 -24 c2 10 -4 18 -14 24" />
      </g>
    </svg>
  );
}

/* -------------------------------- opening -------------------------------- */

/**
 * One sequence: the words ink themselves in as you scroll, and once the last
 * line has landed the date and countdown rise into the same frame.
 *
 * These were two sections before — the reveal, then a separate screen carrying
 * the date. Splitting them meant the sentence finished and then nothing
 * happened for a screen's worth of scrolling.
 */
function Opening() {
  const [celebrate, setCelebrate] = useState(false);

  return (
    // No overflow-hidden here: it would make the reveal's sticky frame stick to
    // this box rather than the viewport, so the lines would scroll away instead
    // of holding. Confetti clips itself, so nothing needs it.
    <section id="opening" className="relative w-full">
      {celebrate && <Confetti />}

      <ScrollReveal
        // Two lines, not four. Each inks on its own scroll ramp, so splitting a
        // short phrase across three of them stretched it out and left the eye
        // waiting between words.
        lines={["Our forever starts here", "We’d love for you to be there"]}
        onTail={() => {
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setCelebrate(true);
        }}
        tail={
          <div className="mt-10 flex flex-col items-center gap-8 text-center">
            {/* One line, always. Measured rather than guessed: set in
                Cormorant Garamond this string is 11.81 times its own font
                size, and the column it sits in is 90% of min(100vw, 26rem).
                7.2vw clears that on every width from 300px up, and the 1.9rem
                ceiling holds it once the column stops growing at 26rem. The
                8vw it used to carry could not fit on any phone. */}
            <p
              className="font-display leading-tight whitespace-nowrap text-foreground"
              style={{ fontSize: "clamp(1.35rem, 7.2vw, 1.9rem)" }}
            >
              {celebrationSpan()}
            </p>
            <div className="flex flex-col items-center gap-4">
              {/* A bare row of numerals does not say what it is counting to. */}
              <p className="font-body text-[0.58rem] font-medium tracking-[0.28em] uppercase text-bronze-deep">
                Counting down to the wedding day
              </p>
              <Countdown />
            </div>
          </div>
        }
      />
    </section>
  );
}


/* ------------------------------- invitation ------------------------------- */

/**
 * The formal invitation — the announcement itself, before the schedule.
 *
 * Kept as its own block rather than folded into the wedding's tile in the
 * timeline. The parents' lines are the point of it, and they need room to be
 * set the way a card sets them; squeezed into a 16rem tile alongside four
 * others they would read as small print.
 */
function Invitation() {
  const event = EVENTS.find((e) => e.invitation);
  if (!event?.invitation) return null;

  return (
    // Its own section rather than the shared one, for the top padding: this
    // follows the countdown, which is already held on a pinned screen of its
    // own, so another 4rem of air above it only widened a gap that was too
    // wide already.
    <section id="invitation" className="w-full px-5 pt-2 pb-16">
      <Reveal>
      {/* No panel. This block sits straight on the page — a pale card behind it
          read as another tile, and the invitation is not one of the tiles. The
          gold rule above is all the separation it needs. */}
      <div className="relative px-1 pt-4 text-center">
        <span
          aria-hidden="true"
          className="absolute inset-x-6 top-0 h-px"
          style={{ background: "var(--gradient-gold)" }}
        />

        {/* Wider than 15rem now that it is set larger, so "Wedding ceremony of"
            still holds a single line under 0.2em of tracking. */}
        <p className="mx-auto max-w-[18rem] font-body text-[0.8rem] leading-[1.7] font-semibold tracking-[0.2em] uppercase text-bronze-deep">
          {event.invitation.lead}
        </p>

        {event.invitation.parties.map((party, i) => (
          <div key={party.name} className={i === 0 ? "mt-7" : ""}>
            {i > 0 && (
              <p aria-hidden="true" className="my-6 font-script text-3xl text-bronze/70">
                &amp;
              </p>
            )}
            <p className="font-display text-[1.85rem] leading-tight font-semibold text-ink-strong">
              {party.name}
            </p>
            {party.parents && (
              // Darker than the muted tone the rest of the page's small type
              // uses. These are the families' names, not supporting detail,
              // and the muted grey put them a long way behind the couple's.
              <p className="mx-auto mt-2 max-w-[15rem] font-body text-[0.8rem] leading-relaxed text-foreground/85">
                {party.parents}
              </p>
            )}
          </div>
        ))}

        {/* Closes on the flourish. The date, time, venue and address that used
            to sit under it all appear on the wedding's own tile just below and
            in Venues, so repeating them here only slowed the announcement. */}
        <Ornament className="mt-9" />
      </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------- events ---------------------------------- */

/**
 * How far the artwork wash is pulled back behind the event cards. Applied as a
 * single multiplier rather than folded into each event's own cardOpacity, so
 * the values tuned against the artwork keep their relationship to one another.
 */
const WASH = 0.45;
/**
 * The celebrations, on a thread you travel along sideways.
 *
 * A horizontal run suits this schedule: five celebrations over two weeks read
 * as a journey rather than a list, and each gets a full screen's attention
 * instead of competing with the next one down.
 *
 * Scroll-snap does the work — no carousel library, no JavaScript. The track is
 * a plain overflow-x element, so it responds to a swipe, a trackpad, a shift-
 * scroll and a keyboard alike, and it degrades to an ordinary scroller if
 * snapping is unsupported.
 */
/**
 * The celebrations, on a thread you travel down.
 *
 * A spine suits this schedule better than the sideways track it replaces:
 * five celebrations over two weeks are a sequence, and a vertical line says so
 * without asking for a gesture. Everything is on the page at once — the swipe
 * kept four of the five hidden behind an interaction people miss.
 */
const NUMBER_WORDS = [
  "No", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];
const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

function EventsSection() {
  const stops = EVENT_DAYS.flatMap((day) => day.events.map((event) => ({ day, event })));
  // Which day's running order is open, by date. Held here rather than per row
  // so that opening one closes another.
  const [openDay, setOpenDay] = useState<string | null>(null);
  const active = EVENT_DAYS.find((d) => d.date === openDay);

  return (
    <section
      id="events"
      className="w-full py-16"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 3rem)" }}
    >
      <Reveal>
        <div className="px-6 text-center">
          <p className="font-body text-[0.6rem] font-medium tracking-[0.3em] uppercase text-bronze-deep">
            The celebrations unfold
          </p>
          <h2
            className="mt-3 font-display leading-none text-foreground"
            style={{ fontSize: "clamp(1.9rem, 8.6vw, 2.4rem)" }}
          >
            Event Lineup
          </h2>
          {/* A bare list of dates does not say what it is or how much of it
              there is. This does both in one line, before the thread starts.
              The count is counted, not typed: it said five until a sixth
              celebration was added, and nothing would have caught that. */}
          <p className="mx-auto mt-4 max-w-[19rem] font-body text-[0.82rem] leading-relaxed text-foreground/75">
            {countWord(stops.length)} celebrations across two weeks. Here is each
            one in order — when it begins, and where to find us.
          </p>
        </div>

        <div className="relative mt-10 pr-5 pl-12">
          {/* The thread. Inset from the ends so it starts and stops at the
              first and last dot rather than running off into nothing. */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[1.35rem] w-px"
            style={{ background: "color-mix(in oklab, var(--gold) 50%, transparent)" }}
          />

          {stops.map(({ day, event }) => {
            const directions = venueMapsHref(event.venue);
            return (
              // relative, or the dot resolves against the whole track and all
              // five land on the first row.
              <div key={event.slug} className="relative pb-9 last:pb-0">
                {/* The row is the containing block and the row starts at the
                    track's 3rem padding, so reaching the spine at 1.35rem means
                    going back 1.65rem rather than forward to it. */}
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
                  {day.weekday}, {day.date}
                </p>
                <h3 className="mt-1.5 font-display text-[1.5rem] leading-tight font-semibold text-ink-strong">
                  {event.name}
                </h3>
                <p className="font-display text-[1rem] text-muted-foreground">{event.time}</p>

                <div className="mt-3">
                  <p className="font-display text-[1.05rem] leading-tight text-ink-strong">
                    {event.venue.name}
                  </p>
                  {event.venue.address && (
                    <p className="mt-1 font-body text-[0.74rem] leading-snug text-muted-foreground">
                      {event.venue.address}
                    </p>
                  )}
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2.5">
                    {directions && (
                      <a
                        href={directions}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-body text-[0.58rem] font-medium tracking-[0.16em] uppercase text-bronze-deep underline underline-offset-4"
                      >
                        Directions <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    {day.schedule && (
                      // A chip rather than another underlined link. Sat beside
                      // Directions in the same style, nothing said one opened
                      // a sheet on the page and the other left for a map — and
                      // the one people would not think to look for was the one
                      // that looked like plain text.
                      <button
                        type="button"
                        onClick={() => setOpenDay(day.date)}
                        className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-body text-[0.58rem] font-semibold tracking-[0.16em] uppercase text-bronze-deep transition-transform active:scale-[0.98]"
                        style={{
                          background: "color-mix(in oklab, var(--gold) 20%, transparent)",
                          border: "1px solid color-mix(in oklab, var(--gold) 48%, transparent)",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="size-3.5 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7.2V12l3.1 1.9" />
                        </svg>
                        See the day&rsquo;s timeline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      <Modal
        open={active !== undefined}
        onClose={() => setOpenDay(null)}
        label={active ? `Timeline for ${active.date}` : "Timeline"}
      >
        {active && (
          <div className="pt-2 pb-4">
            <p className="text-center font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-bronze-deep">
              {active.weekday}, {active.date}
            </p>
            <h3 className="mt-3 text-center font-display text-[1.9rem] leading-tight text-foreground">
              {active.events.map((e) => e.name).join(" & ")}
            </h3>
            <Ornament className="mt-5 mb-7" />

            {/* A thread again, the same one the lineup uses, so the sheet reads
                as a closer look at the row it came from rather than a new idea. */}
            <div className="relative mx-auto max-w-[19rem] pl-9">
              <span
                aria-hidden="true"
                className="absolute top-2 bottom-2 left-[0.3rem] w-px"
                style={{ background: "color-mix(in oklab, var(--gold) 50%, transparent)" }}
              />
              {active.schedule?.map((item) => (
                <div key={item.time + item.what} className="relative pb-6 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute size-[9px] -translate-x-1/2 rounded-full"
                    style={{
                      left: "-2.95rem",
                      marginTop: "0.35rem",
                      background: "var(--gold)",
                      boxShadow: "0 0 0 4px var(--card, var(--background))",
                    }}
                  />
                  <p className="font-body text-[0.62rem] font-semibold tracking-[0.14em] uppercase text-bronze-deep">
                    {item.time}
                  </p>
                  <p className="mt-0.5 font-display text-[1.25rem] leading-tight text-ink-strong">
                    {item.what}
                  </p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-[18rem] text-center font-body text-[0.72rem] leading-relaxed text-muted-foreground">
              Timings are a guide — do come a little before if you can.
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}


/* ------------------------------ detail cards ------------------------------ */

const iconStroke = {
  fill: "none",
  stroke: "var(--gold)",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Gold line drawings, one per card — nothing photographic. */
const DETAIL_ICONS: Record<DetailIcon, ReactNode> = {
  bed: (
    <g {...iconStroke}>
      <path d="M4 26V8M4 26h40v-8a5 5 0 0 0-5-5H20v13" />
      <path d="M44 26v4M4 26v4" />
      <circle cx="12" cy="17" r="3.4" />
    </g>
  ),
  plane: (
    <g {...iconStroke}>
      <path d="M3 21l42-12M3 21l8 4 6-3M45 9l-9 15-5-9" />
      <path d="M17 22l4 7 3-5" />
    </g>
  ),
  camera: (
    <g {...iconStroke}>
      <path d="M4 13.5a2.5 2.5 0 0 1 2.5-2.5H13l2.6-3.6h16.8L35 11h6.5a2.5 2.5 0 0 1 2.5 2.5v14a2.5 2.5 0 0 1-2.5 2.5h-35A2.5 2.5 0 0 1 4 27.5v-14z" />
      <circle cx="24" cy="20.5" r="6.4" />
      <path d="M37.5 16h2.5" />
    </g>
  ),
  pin: (
    <g {...iconStroke}>
      <path d="M24 31.5s10.5-9.6 10.5-17.2a10.5 10.5 0 1 0-21 0C13.5 21.9 24 31.5 24 31.5z" />
      <circle cx="24" cy="14" r="4.1" />
    </g>
  ),
  calendar: (
    <g {...iconStroke}>
      <rect x="12" y="7" width="24" height="23" rx="3.5" />
      <path d="M12 14.5h24M18.5 4v6M29.5 4v6" />
      {/* Round caps turn these zero-length strokes into the date dots. */}
      <path d="M18.5 20h.01M24 20h.01M29.5 20h.01M18.5 25h.01M24 25h.01" strokeWidth="2" />
    </g>
  ),
};

function DetailIconArt({ icon, className = "h-10 w-auto" }: { icon: DetailIcon; className?: string }) {
  return (
    <svg viewBox="0 0 48 34" className={className} aria-hidden="true">
      {DETAIL_ICONS[icon]}
    </svg>
  );
}

/** The shared look of a details tile — a rectangle, icon in a soft gold disc. */
const TILE_CLASS =
  "relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl px-3 py-6 text-center transition-transform active:scale-[0.99]";
const TILE_STYLE = {
  background: "color-mix(in oklab, var(--ivory) 68%, transparent)",
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
  border: "1px solid color-mix(in oklab, var(--gold) 34%, transparent)",
  boxShadow: "0 10px 26px -16px oklch(0.32 0.03 60 / 0.4)",
} as const;

function TileFace({ card }: { card: (typeof DETAIL_CARDS)[number] }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--gradient-gold)" }}
      />
      {/* The disc is what makes these read as actions rather than headings. */}
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full"
        style={{ background: "color-mix(in oklab, var(--gold) 15%, transparent)" }}
      >
        <DetailIconArt icon={card.icon} className="h-6 w-auto" />
      </span>
      <span className="block font-display text-[1.18rem] leading-tight text-foreground">
        {card.title}
      </span>
      <span className="block font-body text-[0.7rem] leading-snug text-muted-foreground">
        {card.hint}
      </span>
    </>
  );
}

function DetailCards() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? DETAIL_CARDS[openIdx] : null;

  return (
    <>
      <Section id="details">
      <h2
        className="text-center font-display leading-none lowercase first-letter:uppercase text-foreground"
        style={{ fontSize: "clamp(2.1rem, 10vw, 2.6rem)" }}
      >
        additional details
      </h2>
      <Ornament className="mt-4 mb-8" />

      {/* Two up. The hints were shortened to suit — at half width "Directions
          to every celebration" ran to three lines under the title. */}
      <div className="grid grid-cols-2 gap-3.5">
        {DETAIL_CARDS.map((card, i) =>
          // Save the Date has nothing to read — it is the calendar chooser
          // itself, wearing the same tile as its neighbour.
          card.calendar ? (
            <AddToCalendar
              key={card.title}
              event={FULL_WEDDING_CAL}
              className={TILE_CLASS}
              style={TILE_STYLE}
            >
              <TileFace card={card} />
            </AddToCalendar>
          ) : (
            <button
              key={card.title}
              type="button"
              onClick={() => setOpenIdx(i)}
              className={TILE_CLASS}
              style={TILE_STYLE}
            >
              <TileFace card={card} />
              <span
                aria-hidden="true"
                className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-bronze/12 text-[0.75rem] text-bronze"
              >
                +
              </span>
            </button>
          ),
        )}
      </div>
      </Section>

      <Modal
        open={active !== null}
        onClose={() => setOpenIdx(null)}
        label={active?.title ?? "Details"}
        variant="full"
      >
        {active && (
          <div className="flex min-h-full flex-col pt-6 pb-4 text-center">
            <div className="my-auto w-full">
              <DetailIconArt icon={active.icon} className="mx-auto h-16 w-auto" />
              <h3 className="mt-6 font-display text-[2.1rem] leading-tight lowercase first-letter:uppercase text-foreground">
                {active.title}
              </h3>
              <Ornament className="mt-5 mb-7" />
              {/* Paragraphs are blank-line separated in the copy, and it now
                  runs long enough that centring every line would hurt to read. */}
              <p className="mx-auto max-w-[20rem] text-left font-body text-[0.95rem] leading-relaxed whitespace-pre-line text-muted-foreground">
                {active.body}
              </p>

              {active.venues && <VenueList />}
              {active.gallery && <GalleryList />}
              {active.hotels && <HotelList />}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/**
 * Every venue in running order, one row each, with directions.
 *
 * The venue is the row's subject rather than the event, so it carries the
 * weight — the event name sits above it as the label. Each row keeps its date:
 * a flat list reads more cleanly than day-grouped headings, but without the
 * date a guest cannot tell which venue belongs to which morning.
 */
function VenueList() {
  // Events sharing a venue collapse into one row — "Haldi & Mehendi" rather
  // than the same address twice. Driven by an explicit flag, not by matching
  // venue names: four venues currently read "To be announced", and matching on
  // that would merge celebrations that have nothing to do with each other.
  const rows: { dates: string[]; names: string[]; event: WeddingEvent }[] = [];
  EVENT_DAYS.forEach((day) =>
    day.events.forEach((event) => {
      const previous = rows[rows.length - 1];
      if (event.sharesVenueWithPrevious && previous) {
        previous.names.push(event.name);
        if (!previous.dates.includes(day.date)) previous.dates.push(day.date);
      } else {
        rows.push({ dates: [day.date], names: [event.name], event });
      }
    }),
  );

  return (
    <div className="mx-auto mt-9 max-w-[20rem] text-left">
      <p className="mb-1 font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-muted-foreground">
        Venues
      </p>

      {rows.map(({ dates, names, event }, i) => {
        const directions = venueMapsHref(event.venue);
        const label = names.join(" & ");
        return (
          <div
            key={event.slug}
            className="flex items-center justify-between gap-3 py-3.5"
            style={{
              borderTop:
                i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
            }}
          >
            <div className="min-w-0">
              {/* The date stays quiet so the bold event name reads as the label
                  for the venue below, rather than the two competing. */}
              <p className="font-body text-[0.58rem] tracking-[0.18em] uppercase text-muted-foreground">
                {dates.map((d) => d.replace(" October", " Oct")).join(" & ")}
                <span aria-hidden="true"> · </span>
                <span className="font-bold text-foreground/75">{label}</span>
              </p>

              {/* The venue is what this list is for, so it is the loudest line. */}
              <p
                className={
                  directions
                    ? "mt-1 font-display text-[1.15rem] leading-tight font-semibold text-ink-strong"
                    : "mt-1 font-display text-[1.1rem] leading-tight text-muted-foreground italic"
                }
              >
                {event.venue.name}
              </p>

              {event.venue.address && (
                <p className="mt-0.5 truncate font-body text-[0.74rem] leading-snug text-muted-foreground">
                  {event.venue.address}
                </p>
              )}
            </div>

            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                aria-label={`Directions to ${event.venue.name} for ${label}`}
                className="shrink-0 rounded-full px-3.5 py-2 font-body text-[0.62rem] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-90"
                style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
              >
                Map
              </a>
            ) : (
              <span className="shrink-0 font-body text-[0.56rem] tracking-[0.14em] uppercase text-muted-foreground/70">
                TBA
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Nearby hotels, each opening its own Google Maps place page. */
function HotelList() {
  return (
    <div className="mx-auto mt-8 max-w-[20rem] text-left">
      <p className="mb-1 font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-muted-foreground">
        Nearby hotels
      </p>

      {HOTELS.map((name, i) => (
        <a
          key={name}
          href={hotelHref(name)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 py-3.5"
          style={{
            borderTop:
              i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
          }}
        >
          <span className="min-w-0 font-display text-[1.08rem] leading-tight font-semibold text-ink-strong">
            {name}
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 rounded-full px-3.5 py-2 font-body text-[0.6rem] font-medium tracking-[0.14em] uppercase"
            style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
          >
            View
          </span>
        </a>
      ))}
    </div>
  );
}

/** One row per shared folder, in the order the celebrations happen. */
function GalleryList() {
  return (
    <div className="mx-auto mt-8 max-w-[20rem] text-left">
      <p className="mb-1 font-body text-[0.58rem] font-medium tracking-[0.26em] uppercase text-muted-foreground">
        Shared folders
      </p>

      {GALLERY_FOLDERS.map((folder, i) => (
        <div
          key={folder.url}
          className="flex items-center justify-between gap-3 py-3.5"
          style={{
            borderTop:
              i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
          }}
        >
          <p className="min-w-0 font-display text-[1.15rem] leading-tight font-semibold text-ink-strong">
            {folder.label}
          </p>

          <a
            href={folder.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the shared photo folder for ${folder.label}`}
            className="shrink-0 rounded-full px-3.5 py-2 font-body text-[0.62rem] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-90"
            style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
          >
            Open
          </a>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------- faqs ----------------------------------- */

function Faqs() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Section id="faqs" className="text-center">
      <h2
        className="font-display leading-none lowercase first-letter:uppercase text-foreground"
        style={{ fontSize: "clamp(2.4rem, 12vw, 3rem)" }}
      >
        questions?
      </h2>
      <p className="mx-auto mt-5 max-w-[20rem] font-body text-sm leading-relaxed text-muted-foreground">
        Anything at all about the celebrations — travel, timings, what to wear — just ask us.
      </p>
      <button
        type="button"
        onClick={() => setContactOpen(true)}
        className="mt-7 rounded-full bg-bronze px-7 py-3.5 font-body text-[0.64rem] font-medium tracking-[0.22em] uppercase text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        Reach out to {COUPLE.groom} or {COUPLE.bride}
      </button>
      </Section>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} label="Contact the couple">
        <div className="flex flex-col items-center gap-5 pt-3 pb-4 text-center">
          <p className="font-display text-2xl text-foreground">We'd love to hear from you</p>

          {/* Numbers first: most guests opening this want to call or message,
              and a tel: link dials straight from a phone. */}
          <div className="w-full">
            {CONTACTS.map((person, i) => (
              <div
                key={person.tel}
                className="flex items-center justify-between gap-3 py-3"
                style={{
                  borderTop:
                    i === 0 ? "none" : "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
                }}
              >
                <div className="text-left">
                  <p className="font-display text-[1.15rem] leading-tight font-semibold text-ink-strong">
                    {person.name}
                  </p>
                  <p className="font-body text-[0.78rem] text-muted-foreground">{person.display}</p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <a
                    href={`tel:${person.tel}`}
                    aria-label={`Call ${person.name}`}
                    className="rounded-full px-3.5 py-2 font-body text-[0.6rem] font-medium tracking-[0.14em] uppercase"
                    style={{ background: "var(--bronze)", color: "var(--primary-foreground)" }}
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${(person.whatsapp ?? person.tel).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Message ${person.name} on WhatsApp`}
                    className="rounded-full border px-3.5 py-2 font-body text-[0.6rem] font-medium tracking-[0.14em] uppercase text-bronze-deep"
                    style={{ borderColor: "color-mix(in oklab, var(--gold) 45%, transparent)" }}
                  >
                    Chat
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Modal>
    </>
  );
}

/* --------------------------------- microsite --------------------------------- */

export function Microsite({ live }: { live: boolean }) {
  return (
    <div className="relative">
      <BotanicalWatermark />
      <FloatingNav visible={live} />
      <MusicToggle />

      <main className="relative mx-auto w-full max-w-[26rem]">
        <Hero live={live} />

        <Opening />
        <Invitation />
        <EventsSection />
        <DetailCards />
        <Faqs />

        {/* Closing */}
        <section className="px-5 pt-6 pb-16 text-center">
          <Reveal>
            <p className="mx-auto max-w-[16rem] font-script text-3xl leading-snug text-foreground/90">
              We can't wait to celebrate with you
            </p>
            {/* The sign-off. Bold, and in the full ink rather than the muted
                tone — at this size, under this much letter-spacing, weight
                alone against a grey would not have read as emphasis. */}
            <p className="mt-8 font-body text-[0.68rem] font-bold tracking-[0.3em] uppercase text-ink-strong">
              {COUPLE_AMP}
            </p>

            {/* The elders' blessing, the way a printed card closes. Quieter
                than the couple's own sign-off above it, and separated by a
                rule so it reads as a second voice rather than a subtitle. */}
            <span
              aria-hidden="true"
              className="mx-auto mt-7 block h-px w-12"
              style={{ background: "var(--gradient-gold)" }}
            />
            <p className="mt-6 font-body text-[0.78rem] font-medium tracking-[0.1em] text-foreground/85">
              Best wishes from {WELL_WISHERS}
            </p>
          </Reveal>
        </section>

        {/* Designer credit, last thing on the page. Kept out of the closing
            block so it reads as a signature under the whole invitation rather
            than as part of the couple's sign-off. "Designed by" rather than
            "By": at the foot of a page the shorter form could mean written,
            hosted or organised. */}
        <footer className="flex items-center justify-center gap-3 px-5 pb-12">
          {/* Rules flank the line rather than sitting above it. They are flex
              items, so on a narrow phone they give way before the name wraps. */}
          <span
            aria-hidden="true"
            className="h-px w-8"
            style={{ background: "var(--gold)", opacity: 0.5 }}
          />
          {/* Only the name is the link, not the whole line — "Designed by" is
              not what a guest would tap. */}
          <p className="shrink-0 font-body text-[0.55rem] tracking-[0.24em] uppercase text-muted-foreground/60">
            Designed by{" "}
            <a
              href={DESIGNER_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={`${DESIGNER} on Instagram`}
              className="underline decoration-[color-mix(in_oklab,var(--gold)_60%,transparent)] underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              {DESIGNER}
              {/* The same arrow the venue addresses use, so by the time a guest
                  reaches the foot of the page they have already learnt it means
                  this leads somewhere. Outside nothing, so it stays underlined
                  with the name rather than trailing loose. */}
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
          <span
            aria-hidden="true"
            className="h-px w-8"
            style={{ background: "var(--gold)", opacity: 0.5 }}
          />
        </footer>
      </main>
    </div>
  );
}
