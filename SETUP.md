# Setting this up for a new couple

A copy of the Lasya & Avyay invitation. **Everything below still says Lasya &
Avyay and still shows their photographs** — work through this list before the
site goes anywhere public.

Nothing here needs code beyond editing text and swapping image files. If you
keep the filenames identical, no imports change.

---

## 1. Words

### `src/components/wedding/data.ts`
Almost all of it. In order down the file:

- `SITE_URL` — the new domain
- `COUPLE` — bride and groom first names
- `WEDDING_YEAR`, and every `ET(month, day, hour, minute)` call
  (month is zero-based: `9` is October)
- `WEDDING_DATE`, `WEDDING_DATE_RANGE`
- `WHATSAPP_NUMBER` — digits only, no `+`
- `CONTACT_EMAIL`
- `CONTACTS` — names, numbers, and `whatsapp` only where it differs from the
  number that rings
- `GALLERY_FOLDERS` — the new couple's shared Drive folders
- `EVENT_DAYS` — every event: name, theme, time, dress code, venue, photo folder
- The wedding event's `invitation` block — both families' names
- `HOTELS`
- `DETAIL_CARDS` — accommodation and travel copy
- `DESIGNER` / `DESIGNER_URL` — keep, unless someone else designed it

### `src/components/wedding/Microsite.tsx`
- `CHAPTERS` near the top — the three story chapters, their titles, body text,
  quotes and photo captions. **This is easy to miss**: it holds no names, so
  searching for the old couple will not find it.

### `src/routes/index.tsx` and `src/routes/__root.tsx`
- `TITLE` and `DESCRIPTION` — these are what shows in a shared link preview.

---

## 2. Pictures and sound

Swap the files, keep the names:

| File | What it is |
| --- | --- |
| `src/assets/couple.jpg` | The couple, used for the hero |
| `src/assets/monogram.png` | Their monogram — **transparent background** |
| `src/assets/backdrop.jpg` | The illustration behind the whole page |
| `src/assets/story-*.jpg` | The three story photographs |
| `src/assets/bg-*.jpg` | One artwork per celebration |
| `public/share.jpg` | 1200×630 link-preview card |
| `public/favicon.ico` | Browser tab icon |
| `public/apple-touch-icon.png` | Home-screen icon |
| `public/music/invitation.m4a` | The track |

`src/components/wedding/eventThemes.tsx` holds the per-event colours, artwork
crops (`cardPosition`, `cardOpacity`, `imagePosition`) and the wedding's
`contentStyle` offset. Those are tuned to *these* artworks — expect to retune
them once the new ones are in.

---

## 3. RSVPs

Each couple needs their own sheet, or replies land in the wrong place.

1. New Google Sheet, then Extensions → Apps Script
2. Paste `docs/rsvp-apps-script.gs`, change `NOTIFY` to the new couple's email
3. Run `setup` once, approve the permissions
4. Deploy → New deployment → Web app, **Execute as: Me**, **Access: Anyone**
5. Put the `/exec` URL in Vercel as `RSVP_WEBHOOK_URL`, then redeploy

Until that variable is set, the form tells guests plainly that it could not
save, rather than pretending it worked.

---

## 4. Going live

1. New GitHub repo, push this
2. New Vercel project → import it
3. **Root Directory**: leave empty — unlike the original, this project is at the
   repository root
4. Framework preset **Other**, build command `npm run build`
5. Add `RSVP_WEBHOOK_URL`, then redeploy
6. Add the domain, and add the `www.` form as a redirect

---

## 5. Before sharing the link

- [ ] No trace of the previous couple: `grep -ri "lasya\|avyay\|joginpally\|yennamaneni\|thelavstory" src public`
- [ ] Every photograph replaced
- [ ] `npx tsc --noEmit` clean, `npm run build` passes
- [ ] Test an RSVP end to end and check the row appears
- [ ] Check the link preview by sending it to yourself in a **new** chat —
      WhatsApp caches previews per URL and will not re-fetch

---

## Fixes that will not follow you

This is a copy, so nothing fixed in the original arrives here. Worth knowing
what the machinery already handles, so you do not think these are bugs:

- The opening screen and mute button act on pointer-down, so the **first** tap
  works — Safari otherwise waits to see if a double-tap is coming
- iOS ignores `HTMLMediaElement.volume`, so the fade goes through a Web Audio
  gain node there; that node is only ever connected once its context is
  confirmed running, because routing audio into a suspended context silences it
  with no way back (this is what made Android silent)
- `og:image` must be an absolute URL for link previews
- RSVP posts through a server function, not from the page, so the webhook URL
  stays private and there is no CORS to fight
