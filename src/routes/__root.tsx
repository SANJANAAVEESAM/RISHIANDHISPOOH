import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHost, getRequestProtocol } from "@tanstack/react-start/server";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { COUPLE_AMP, COUPLE_AND, SITE_URL } from "@/components/wedding/data";
import backdrop from "../assets/backdrop.jpg";

/**
 * The origin this page is actually being served from.
 *
 * Share previews need absolute URLs — a crawler has no page to resolve a
 * relative path against. Those URLs used to be built from a hardcoded
 * SITE_URL, which is how WhatsApp ended up showing the other couple this
 * project was forked from: the tag pointed at their live domain, so that is
 * the photograph it fetched. Reading the request instead means the preview is
 * correct on the real domain, on the vercel.app address and on every preview
 * deployment, with no constant to remember to change.
 *
 * The server half and its imports are stripped from the client bundle.
 */
const siteOrigin = createIsomorphicFn()
  .server(() => {
    try {
      // Vercel terminates TLS at the edge, so the origin server sees plain
      // HTTP — the forwarded headers are the only truthful source here.
      const host = getRequestHost({ xForwardedHost: true });
      if (!host) return SITE_URL;
      return `${getRequestProtocol({ xForwardedProto: true })}://${host}`;
    } catch {
      return SITE_URL;
    }
  })
  .client(() => window.location.origin);


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const origin = siteOrigin();
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: COUPLE_AMP },
      { name: "description", content: `The wedding of ${COUPLE_AMP}.` },
      { property: "og:title", content: COUPLE_AMP },
      { property: "og:description", content: `The wedding of ${COUPLE_AMP}.` },
      { property: "og:type", content: "website" },
      // Absolute, and a purpose-made 1200x630 card rather than the portrait
      // photograph — sharing apps crop 1.91:1, and a portrait loses their faces.
      { property: "og:image", content: `${origin}/share.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: COUPLE_AND },
      { property: "og:url", content: origin },
      { property: "og:site_name", content: COUPLE_AMP },
      { name: "twitter:image", content: `${origin}/share.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      // Unlisted rather than private — see public/robots.txt.
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Shown when a guest adds the invitation to their phone's home screen.
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Cormorant+Infant:ital,wght@0,300;0,400;1,300;1,400&family=Karla:wght@300;400;500;600;700&family=Parisienne&family=Pinyon+Script&display=swap",
      },
    ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        {/* Fixed backdrop behind every section. Negative z-index keeps it under
            the content but still above the body's cream, which is what the
            veil blends into. */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <img
            src={backdrop}
            alt=""
            width={800}
            height={900}
            className="h-full w-full object-cover object-center"
            style={{ opacity: 0.34 }}
          />
          {/* Warm wash so type stays readable over the busiest parts */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--background) 62%, transparent) 0%, color-mix(in oklab, var(--background) 34%, transparent) 42%, color-mix(in oklab, var(--background) 66%, transparent) 100%)",
            }}
          />
        </div>

        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
