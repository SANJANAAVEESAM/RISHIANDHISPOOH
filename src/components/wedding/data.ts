
export const COUPLE = { bride: "Pooja", groom: "Rithvick" };

/**
 * The pair as it is written, everywhere it is written.
 *
 * Groom first, at the couple's request. Kept here rather than spelled out at
 * each of the fifteen places the two names appear together — the invitation,
 * the hero, the tab title, the share card, the calendar file — because an
 * order repeated that many times is an order that will eventually disagree
 * with itself.
 */
export const COUPLE_AMP = `${COUPLE.groom} & ${COUPLE.bride}`;
export const COUPLE_AND = `${COUPLE.groom} and ${COUPLE.bride}`;

/** ⚠️ Year is unconfirmed (reference doc said 2027) — change it here only. */
export const WEDDING_YEAR = 2026;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A wall-clock India time, as an instant.
 *
 * Every celebration is in Telangana, so times are IST — UTC+5:30, with no
 * daylight saving to account for. Written as an explicit offset rather than
 * arithmetic on UTC so the offset is reviewable. Month is zero-based, matching
 * Date.
 */
const IST = (month: number, day: number, hour: number, minute: number) =>
  new Date(`${WEDDING_YEAR}-${pad(month + 1)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+05:30`);

/** Muhurtham — 27 August, 10:05 AM IST. */
export const WEDDING_DATE = IST(7, 27, 10, 5);



export const WHATSAPP_NUMBER = "18326686089";

/**
 * Fallback origin only.
 *
 * Share previews are built from the host the page was actually served on —
 * see __root.tsx. This is used solely when there is no request to read one
 * from, which in practice means nothing a guest will ever see. Left here so
 * the tags always have something absolute to fall back to.
 */
export const SITE_URL = "https://rishiandhispooh.vercel.app";


/** Credited in the closing line. */
export const DESIGNER = "Sanjana Veesam";
export const DESIGNER_URL = "https://www.instagram.com/sanjanaa_vv/";

/**
 * Who to call. `tel` is the number that rings; `whatsapp` is only set when the
 * account lives on a different number, as Avyay's does — sending Chat to the
 * calling number would reach nobody.
 */
export const CONTACTS: {
  name: string;
  tel: string;
  display: string;
  whatsapp?: string;
}[] = [
  { name: COUPLE.groom, tel: "+918500603422", display: "+91 85006 03422" },
  { name: COUPLE.bride, tel: "+916301560814", display: "+91 63015 60814" },
];

import type { EventTheme } from "./eventThemes";

/**
 * Shared Drive folders guests add their own photos to. Haldi and Mehendi share
 * one, as supplied by the couple.
 *
 * Each folder must be shared so that anyone with the link can *contribute*, not
 * just view — otherwise the button leads guests to a wall.
 */
export const GALLERY_FOLDERS: { label: string; url: string }[] = [];

/**
 * A dress code the sheet can draw rather than merely state.
 *
 * `kind` selects the swatch row: a spread of hues for "solids", metallics for
 * "bling". Only the three events that actually have a code carry one.
 */
export type DressCode = {
  label: string;
  /** A single paragraph. Use `lines` instead when the guidance differs by guest. */
  note?: string;
  /** Guidance split by who it applies to, e.g. Men / Women. */
  lines?: { who: string; what: string }[];
  /** Optional inspiration thumbnails, shown in a row beneath the wording. */
  images?: string[];
};

export type Venue = {
  name: string;
  /** Street or area line shown under the venue name. */
  address?: string;
  /** A full Google Maps share link. Wins over mapsQuery when present. */
  mapsUrl?: string;
  /** Fallback: a search string. Directions stay hidden until one is set. */
  mapsQuery?: string;
};

export type WeddingEvent = {
  slug: string;
  name: string;
  theme?: string;
  /** Drives the accent and motif on the event's full-page details. */
  themeKey: EventTheme;
  time: string;
  dressCode?: DressCode;
  /** Shared folder for this celebration's photos. */
  photosUrl?: string;
  /** Held at the same place as the event above it, so they list as one. */
  sharesVenueWithPrevious?: boolean;
  /**
   * The formal invitation, shown above the details. Structured rather than one
   * run-on sentence so each family can be set on its own lines, the way an
   * invitation card would.
   */
  invitation?: {
    lead: string;
    parties: { name: string; parents: string }[];
  };
  /** TODO(content): Mehendi's dress code is an inspiration photo, not text —
   *  drop the image in src/assets and point this at it. */
  dressCodeImage?: string;
  /** Renders a "Followed by" link to the event above it. */
  followsPrevious?: boolean;
  venue: Venue;
  start: Date;
  end: Date;
};

/** One line of a day's running order. */
export type ScheduleItem = { time: string; what: string };

export type EventDay = {
  date: string;
  weekday: string;
  events: WeddingEvent[];
  /**
   * The hour-by-hour running order for the whole day, shown in a sheet from
   * any of that day's events. Only the two days that have one carry it — the
   * rest simply do not offer the link.
   */
  schedule?: ScheduleItem[];
};

/** Three of the four celebrations share this venue. */
const VENUE_RUSTIC: Venue = {
          name: "Rustic Vogue",
          address: "Unnamed Road, Cheeriyal, Telangana 501303",
          mapsQuery: "Rustic Vogue, Cheeriyal, Telangana 501303",
        };

export const EVENT_DAYS: EventDay[] = [
  {
    date: "19 August",
    weekday: "Wednesday",
    // Haldi and Sangeet share the day, so they share one running order.
    schedule: [
      { time: "9:00 AM", what: "Haldi" },
      { time: "1:00 PM", what: "Lunch" },
      { time: "7:00 PM", what: "Sangeet" },
    ],
    events: [
      {
        slug: "haldi",
        name: "Haldi",
        themeKey: "carnival",
        time: "9:00 AM",
        photosUrl: undefined,
        venue: VENUE_RUSTIC,
        start: IST(7, 19, 9, 0),
        end: IST(7, 19, 12, 0),
      },
      {
        slug: "sangeet",
        name: "Sangeet",
        themeKey: "masquerade",
        time: "7:00 PM",
        photosUrl: undefined,
        venue: VENUE_RUSTIC,
        start: IST(7, 19, 19, 0),
        end: IST(7, 19, 23, 0),
      },
    ],
  },
  {
    date: "23 August",
    weekday: "Sunday",
    events: [
      {
        slug: "pellikoduku",
        name: "Pellikoduku",
        themeKey: "pellikoduku",
        time: "9:00 AM",
        photosUrl: undefined,
        venue: {
          name: "Plot 53, SBI Colony",
          address: "Musarambagh, Hyderabad 500036",
          // A dropped pin at 17.375235, 78.519607, supplied by the family. The
          // name search resolved to the colony rather than the house, which on
          // a lane of unnumbered plots is not close enough to be useful.
          mapsUrl:
            "https://www.google.com/maps/place/17%C2%B022'30.8%22N+78%C2%B031'10.6%22E/@17.3752346,78.5170326,17z/data=!3m1!4b1!4m4!3m3!8m2!3d17.3752346!4d78.5196075?hl=en&entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D",
        },
        start: IST(7, 23, 9, 0),
        end: IST(7, 23, 12, 0),
      },
      {
        slug: "pellikuthuru",
        name: "Pellikuthuru",
        themeKey: "pellikuthuru",
        time: "11:00 AM",
        photosUrl: undefined,
        venue: {
          name: "Giridhar Apartment",
          mapsUrl: "https://maps.app.goo.gl/xnBTT7wsKTikNgHZA",
        },
        start: IST(7, 23, 11, 0),
        end: IST(7, 23, 14, 0),
      },
    ],
  },
  {
    date: "27 August",
    weekday: "Thursday",
    // The wedding day, as the family set it out.
    schedule: [
      { time: "7:00 – 8:00 AM", what: "Eduru Kollu" },
      { time: "8:30 AM", what: "Breakfast" },
      { time: "10:05 AM", what: "Jilakarra Bellam — Muhurtham" },
      { time: "10:05 – 10:45 AM", what: "Kanyadanam" },
      { time: "10:45 – 11:00 AM", what: "Thali" },
      { time: "12:00 PM", what: "Lunch" },
      { time: "1:00 – 4:00 PM", what: "Guest meet" },
    ],
    events: [
      {
        slug: "wedding",
        name: "Wedding Ceremony",
        themeKey: "telugu",
        time: "Muhurtham: 10:05 AM",
        photosUrl: undefined,
        invitation: {
          lead: "Wedding ceremony of",
          parties: [
            {
              name: "Rithvick Chitimilla",
              parents: "Eldest S/o Chitimilla Archana & Chitimilla Ramakrishna",
            },
            {
              name: "Pooja Erolla",
              parents: "Eldest D/o Late Erolla Anitha & Late Erolla Ravikanth",
            },
          ],
        },
        venue: VENUE_RUSTIC,
        start: IST(7, 27, 10, 5),
        end: IST(7, 27, 14, 0),
      },
    ],
  },
];

/**
 * Hotels near the celebrations. Linked by name rather than by a stored URL:
 * a Maps search resolves to the place page — address, photos, reviews and
 * booking links — and cannot rot the way a copied URL can.
 */
export const HOTELS: string[] = [];

export const hotelHref = (name: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;

/** Directions link, or null while the venue is still unconfirmed. */
export function venueMapsHref(venue: Venue): string | null {
  if (venue.mapsUrl) return venue.mapsUrl;
  if (venue.mapsQuery)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapsQuery)}`;
  return null;
}

/**
 * The span the celebrations cover, taken from the celebrations themselves.
 *
 * This used to be typed out. It said "From August 15th" and stayed saying it
 * after the engagement on the 15th was removed, which is exactly the kind of
 * quiet contradiction a guest notices and a developer does not.
 */
function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}

export function celebrationSpan(): string {
  const days = EVENT_DAYS.flatMap((d) => d.events.map((e) => e.start));
  if (!days.length) return "";
  const first = new Date(Math.min(...days.map((d) => d.getTime())));
  const last = new Date(Math.max(...days.map((d) => d.getTime())));
  const month = (d: Date) =>
    d.toLocaleString("en-GB", { month: "long", timeZone: "Asia/Kolkata" });
  const day = (d: Date) =>
    Number(d.toLocaleString("en-GB", { day: "numeric", timeZone: "Asia/Kolkata" }));
  const head = `From ${month(first)} ${ordinal(day(first))}`;
  const tail =
    month(first) === month(last)
      ? `${ordinal(day(last))}`
      : `${month(last)} ${ordinal(day(last))}`;
  return `${head} – ${tail}, ${WEDDING_YEAR}`;
}

export const EVENTS: WeddingEvent[] = EVENT_DAYS.flatMap((day) => day.events);


export const FULL_WEDDING_CAL = {
  title: `${COUPLE_AMP} — Wedding Celebrations`,
  description: `Celebrations for the wedding of ${COUPLE_AMP}. Muhurtham on 27 August at 10:05 AM.`,
  location: "Hyderabad, Telangana",
  // First and last of whatever the schedule actually contains.
  startUtc: new Date(Math.min(...EVENTS.map((e) => e.start.getTime()))).toISOString(),
  endUtc: new Date(Math.max(...EVENTS.map((e) => e.end.getTime()))).toISOString(),
};

export type DetailIcon = "bed" | "plane" | "camera" | "pin" | "calendar";

// TODO(content): hotel names, rates, booking codes and shuttle timings still
// need to be filled in by the couple — the copy below says so plainly rather
// than promising details that may not arrive.
export const DETAIL_CARDS: {
  title: string;
  icon: DetailIcon;
  /** The line under the title on the tile itself. */
  hint: string;
  body: string;
  venues?: boolean;
  gallery?: boolean;
  hotels?: boolean;
  /** Opens the calendar chooser instead of a details sheet. */
  calendar?: boolean;
}[] = [
  // TODO(content): accommodation, travel and a shared photo folder can each be
  // added back as a card once there is something true to put in them. The
  // machinery for all three is still in Microsite.tsx.
  {
    title: "Save the Date",
    icon: "calendar",
    hint: "Add to calendar",
    body: "",
    calendar: true,
  },
  {
    title: "Venues",
    icon: "pin",
    hint: "Directions & maps",
    body: "Where each celebration is held. Tap any address for directions.",
    venues: true,
  },
];
