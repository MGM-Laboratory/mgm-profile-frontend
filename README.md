# MGM Profile — Frontend

Next.js (App Router) UI for MGM Profile — the LinkedIn-style member directory
for MGM Laboratory. Three surfaces: public directory, private profile editor,
and admin console. **Light mode only.**

## Stack
- **Next.js 16** (App Router, TypeScript), **Tailwind v4**.
- **next-intl** (EN/ID, cookie-based, no routing segment).
- Auth.js (Keycloak OIDC), TanStack Query, React Hook Form + Zod, TipTap,
  Framer Motion, Radix UI, Lucide — added in their respective phases.

## Design system
Tokens from `DESIGN_SYSTEM.md` live in `app/globals.css` (`@theme`): brand
colors, ink/line scales, the type scale (`text-display-xl`, `text-h1`, …),
radii, soft shadows, and easings. Fonts: **Bricolage Grotesque** (display),
**Geist** (UI), **Geist Mono** — wired via `next/font` in `lib/fonts.ts`.

The geometric pattern is "the spice, not the meal": use `<PatternGrid>`
(`components/pattern.tsx`) in corners, dividers, empty states, and the 404 —
never as wallpaper.

## Develop
```sh
cp .env.example .env.local      # fill placeholders
pnpm install
pnpm dev                        # http://localhost:3000
```

## Checks
```sh
pnpm lint
pnpm format:check
pnpm build
pnpm test:e2e                   # Playwright (auto-starts a server)
```

## Layout
```
app/            routes (public directory, login, 404, …)
components/     UI primitives, pattern, logo, header, locale switcher
i18n/           next-intl config, request handler, locale cookie action
lib/            fonts, cn() utility
messages/       en.json, id.json (UI strings only)
e2e/            Playwright smoke tests
public/         patterns/, brand/logo.svg
```

## Internationalization
The active locale is stored in the `MGM_LOCALE` cookie and read server-side in
`i18n/request.ts`. The `LocaleSwitcher` calls a server action
(`i18n/actions.ts`) to change it. **UI strings only** — user-generated profile
content is never translated.
