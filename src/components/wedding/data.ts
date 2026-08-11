
export const COUPLE = { bride: "Pooja", groom: "Rithvick" };

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

export const WEDDING_DATE_RANGE = `August 15th – 27th, ${WEDDING_YEAR}`;

export const WHATSAPP_NUMBER = "18326686089";

/**
 * Where the invitation lives. Share previews need absolute URLs — a crawler
 * has no page context to resolve a relative path against, which is why no
 * photograph was appearing.
 */
export const SITE_URL = "https://thelavstory.com";


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
  { name: COUPLE.bride, tel: "+916301560814", display: "+91 63015 60814" },
  { name: COUPLE.groom, tel: "+918500603422", display: "+91 85006 03422" },
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

export type EventDay = {
  date: string;
  weekday: string;
  events: WeddingEvent[];
};

/** Three of the four celebrations share this venue. */
const VENUE_RUSTIC: Venue = {
          name: "Rustic Vogue",
          address: "Unnamed Road, Cheeriyal, Telangana 501303",
          mapsQuery: "Rustic Vogue, Cheeriyal, Telangana 501303",
        };

export const EVENT_DAYS: EventDay[] = [
  {
    date: "15 August",
    weekday: "Saturday",
    events: [
      {
        slug: "engagement",
        name: "Engagement",
        themeKey: "pellikuthuru",
        time: "9:00 AM",
        photosUrl: undefined,
        venue: {
          name: "Sree Vedha Banquet Hall",
          address: "Above Ratnadeep, Kothapet, Hyderabad",
          mapsQuery: "Sree Vedha Banquet Hall, Kothapet, Hyderabad",
        },
        start: IST(7, 15, 9, 0),
        end: IST(7, 15, 12, 0),
      },
    ],
  },
  {
    date: "19 August",
    weekday: "Wednesday",
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
          mapsQuery: "SBI Colony, Musarambagh, Hyderabad 500036",
        },
        start: IST(7, 23, 9, 0),
        end: IST(7, 23, 12, 0),
      },
    ],
  },
  {
    date: "27 August",
    weekday: "Thursday",
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

export const EVENTS: WeddingEvent[] = EVENT_DAYS.flatMap((day) => day.events);


export const FULL_WEDDING_CAL = {
  title: `${COUPLE.bride} & ${COUPLE.groom} — Wedding Celebrations`,
  description: `Celebrations for the wedding of ${COUPLE.bride} & ${COUPLE.groom}. Muhurtham on 27 August at 10:05 AM.`,
  location: "Hyderabad, Telangana",
  startUtc: IST(7, 15, 9, 0).toISOString(),
  endUtc: IST(7, 27, 14, 0).toISOString(),
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
