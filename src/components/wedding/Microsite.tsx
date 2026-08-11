import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  CONTACTS,
  COUPLE,
  DESIGNER,
  DESIGNER_URL,
  DETAIL_CARDS,
  type DetailIcon,
  EVENT_DAYS,
  FULL_WEDDING_CAL,
  GALLERY_FOLDERS,
  HOTELS,
  hotelHref,
  WEDDING_DATE_RANGE,
  WEDDING_YEAR,
  venueMapsHref,
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
            <p
              className="font-display leading-tight lowercase first-letter:uppercase text-foreground"
              style={{ fontSize: "clamp(1.8rem, 8vw, 2.15rem)" }}
            >
              {WEDDING_DATE_RANGE}
            </p>
            <Countdown />
          </div>
        }
      />
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
 * The celebrations, hung off a single thread.
 *
 * Everything is on the page — no tabs, no sheets to open. The events run across
 * two weeks with gaps between them, so a continuous line reads the sequence
 * better than separate cards did: the thread shows they belong to one
 * occasion, while each date stands on its own.
 *
 * The wedding's formal invitation sits above its own entry, as the printed card
 * has it.
 */
function EventsSection() {
  return (
    <section
      id="events"
      className="w-full px-6 py-16"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 3rem)" }}
    >
      <Reveal>
        <h2
          className="text-center font-display leading-none text-foreground"
          style={{ fontSize: "clamp(1.9rem, 8.6vw, 2.4rem)" }}
        >
          The Celebrations
        </h2>
        <Ornament className="mt-4 mb-10" />

        <div className="relative pl-9">
          {/* Inset from the dots so the line runs through their centres. */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px"
            style={{ background: "color-mix(in oklab, var(--gold) 55%, transparent)" }}
          />

          <div className="flex flex-col gap-9">
            {EVENT_DAYS.flatMap((day) =>
              day.events.map((event) => {
                const directions = venueMapsHref(event.venue);
                return (
                  <div key={event.slug} className="relative text-left">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-9 size-[15px] rounded-full"
                      style={{ background: "var(--gold)" }}
                    />

                    {event.invitation && (
                      <div className="mb-5">
                        <p className="font-body text-[0.8rem] leading-relaxed text-muted-foreground">
                          {event.invitation.lead}
                        </p>
                        {event.invitation.parties.map((party, i) => (
                          <div key={party.name}>
                            {i > 0 && (
                              <p className="my-1.5 font-display text-base italic text-muted-foreground">
                                and
                              </p>
                            )}
                            <p className="mt-1.5 font-display text-[1.3rem] leading-tight text-ink-strong">
                              {party.name}
                            </p>
                            {party.parents && (
                              <p className="mt-0.5 font-body text-[0.74rem] leading-relaxed text-muted-foreground">
                                {party.parents}
                              </p>
                            )}
                          </div>
                        ))}
                        <span
                          aria-hidden="true"
                          className="mt-5 block h-px w-12"
                          style={{ background: "var(--gold)", opacity: 0.55 }}
                        />
                      </div>
                    )}

                    <p className="font-body text-[0.58rem] font-medium tracking-[0.2em] uppercase text-bronze-deep">
                      {day.weekday}, {day.date} {WEDDING_YEAR} · {event.time}
                    </p>

                    <h3 className="mt-1.5 font-display text-[1.5rem] leading-tight font-semibold text-ink-strong">
                      {event.name}
                    </h3>

                    <p className="mt-1 font-body text-[0.84rem] text-muted-foreground">
                      {event.venue.name}
                    </p>
                    {event.venue.address && (
                      <p className="font-body text-[0.76rem] leading-snug text-muted-foreground/85">
                        {event.venue.address}
                      </p>
                    )}

                    {directions && (
                      <a
                        href={directions}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 font-body text-[0.6rem] font-medium tracking-[0.16em] uppercase text-bronze-deep underline underline-offset-4"
                      >
                        Directions <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {event.dressCode && (
                      <div className="mt-5">
                        <DressCodeArt dressCode={event.dressCode} />
                      </div>
                    )}

                    {event.photosUrl && (
                      <a
                        href={event.photosUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/45 bg-ivory px-5 py-2.5 font-body text-[0.6rem] font-medium tracking-[0.18em] uppercase text-bronze"
                      >
                        Share your photos
                      </a>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <AddToCalendar compact event={FULL_WEDDING_CAL} />
        </div>
      </Reveal>
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
};

function DetailIconArt({ icon, className = "h-10 w-auto" }: { icon: DetailIcon; className?: string }) {
  return (
    <svg viewBox="0 0 48 34" className={className} aria-hidden="true">
      {DETAIL_ICONS[icon]}
    </svg>
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

      {/* Two columns only when there is more than one card. A lone tile in a
          two-column grid sits at half width against nothing, which reads as a
          mistake; on its own it spans the full width as a rectangle. */}
      <div className={`grid gap-3.5 ${DETAIL_CARDS.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
        {DETAIL_CARDS.map((card, i) => (
          <button
            key={card.title}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="relative flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-7 text-center transition-transform active:scale-[0.99]"
            style={{
              background: "color-mix(in oklab, var(--ivory) 68%, transparent)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
              border: "1px solid color-mix(in oklab, var(--gold) 34%, transparent)",
              boxShadow: "0 10px 26px -16px oklch(0.32 0.03 60 / 0.4)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: "var(--gradient-gold)" }}
            />
            <DetailIconArt icon={card.icon} />
            <span className="block font-display text-[1.25rem] leading-tight lowercase first-letter:uppercase text-foreground">
              {card.title}
            </span>
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-bronze/12 text-[0.85rem] text-bronze"
            >
              +
            </span>
          </button>
        ))}
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
        Reach out to {COUPLE.bride} or {COUPLE.groom}
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
        <EventsSection />
        <DetailCards />
        <Faqs />

        {/* Closing */}
        <section className="px-5 pt-6 pb-16 text-center">
          <Reveal>
            <p className="mx-auto max-w-[16rem] font-script text-3xl leading-snug text-foreground/90">
              We can't wait to celebrate with you
            </p>
            <p className="mt-8 font-body text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground">
              {COUPLE.bride} & {COUPLE.groom}
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
