# Closure Receipt

> Turn your breakup into a receipt. Share it, download it, and move on.

**Branch:** `polish/closure-2026` — Viral-ready polish update

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📋 What's New in polish/closure-2026

This branch contains a comprehensive polish update with the following improvements:

### ✨ High-Impact Fixes
- **Hero redesign**: Three-line headline structure (6.5rem on desktop)
- **Breakup word animation**: Subtle -2° rotation with underline
- **CTA hover**: Scale 1.06 animation at 120ms
- **Mascot interaction**: Blinks/glances on CTA hover

### 🖼️ OG Image Endpoint
- **`/api/og?slug={slug}`**: Dynamic SVG OG images (1200×630)
- Includes verdict, subtitle, receipt number, and mascot
- Proper caching headers

### 📄 PDF Font Embedding
- Poppins ExtraBold embedded in PDF exports
- Print styles ensure proper font rendering
- Helper utilities in `/lib/pdf-fonts.ts`

### 📊 Analytics Instrumentation
- Event tracking interface (swap GA4/Mixpanel easily)
- Opt-out via `?analytics=0` or `localStorage.optOutAnalytics`
- Events: `page_view_*`, `receipt_created`, `pdf_downloaded`, `share_clicked`

### 🔒 Security & Ethics
- Rate limiting (standard: 10/min, strict: 1/min + 10/day)
- Content moderation on "last words" field
- Report API at `/api/report`
- Privacy tip shown in form

### ♿ Accessibility
- Slider value announcements via `aria-live`
- Proper `aria-label` on all interactive elements
- `prefers-reduced-motion` support
- Focus trap improvements

### 🎯 Copy Standardisation
- All copy in `/lib/copy.ts`
- Style guide in `/content/style-guide.md`
- Single share caption: **"No refunds. Just receipts — close the tab and glow up."**

---

## 🧪 Running Tests

```bash
npm test
```

### Test Coverage
- `/lib/copy.ts` — Copy constants validation
- `/lib/moderation.ts` — Content filtering
- `/lib/analytics.ts` — Event tracking
- `/lib/pdf-fonts.ts` — PDF font utilities
- `/api/og` — OG endpoint SVG generation

---

## 🚀 Launch Checklist

Run the launch checklist to validate deployment readiness:

```bash
# Start the dev server first
npm run dev

# In another terminal
node scripts/launch-checklist.js
```

The script validates:
- OG endpoint returns valid SVG
- Fonts directory exists
- Environment variables configured
- Report storage ready
- API endpoints responding

---

## 🎛️ Feature Flags

Enable features via environment variables in `.env.local`:

```bash
# Polished hero with 3-line structure
NEXT_PUBLIC_FEATURE_POLISHED_HERO=true

# Dynamic OG images
NEXT_PUBLIC_FEATURE_OG_API=true

# Mascot interaction on CTA hover
NEXT_PUBLIC_FEATURE_MASCOT_INTERACTION=true

# Analytics tracking
NEXT_PUBLIC_FEATURE_ANALYTICS=true

# Content moderation on last words
NEXT_PUBLIC_FEATURE_CONTENT_MODERATION=true

# PDF font embedding
NEXT_PUBLIC_FEATURE_PDF_FONTS=true

# Strict rate limiting (1/min, 10/day)
NEXT_PUBLIC_FEATURE_STRICT_RATE_LIMIT=true

# Embeddable badge widget
NEXT_PUBLIC_FEATURE_EMBED_BADGE=true

# Hero A/B test variant
NEXT_PUBLIC_FEATURE_HERO_VARIANT=A  # or B
```

---

## 📝 Swapping Analytics Provider

Edit `/lib/analytics.ts` and modify the `send()` function:

```typescript
// GA4
function send(name: string, payload?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, payload ?? {});
  }
}

// Mixpanel
function send(name: string, payload?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && (window as any).mixpanel) {
    (window as any).mixpanel.track(name, payload ?? {});
  }
}
```

---

## 🖼️ Adding Fonts for PDF

1. Download Poppins-ExtraBold.woff2 from Google Fonts
2. Place in `public/fonts/Poppins-ExtraBold.woff2`
3. Enable feature flag: `NEXT_PUBLIC_FEATURE_PDF_FONTS=true`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── create/     # Receipt creation
│   │   ├── og/         # Dynamic OG images ✨
│   │   └── report/     # Abuse reporting ✨
│   ├── generate/       # Form page
│   └── receipt/[id]/   # Receipt display
├── components/
│   ├── mascot.tsx      # Animated mascot ✨
│   ├── embed-badge.tsx # Embeddable widget ✨
│   └── ui/             # Shadcn components
├── lib/
│   ├── analytics.ts    # Event tracking ✨
│   ├── copy.ts         # Standardised copy ✨
│   ├── feature-flags.ts # Feature toggles ✨
│   ├── moderation.ts   # Content filtering ✨
│   ├── mood.ts         # Mood theming
│   ├── pdf-fonts.ts    # PDF font embedding ✨
│   ├── rate-limit.ts   # Rate limiting ✨
│   └── utils.ts        # Utilities
└── __tests__/          # Unit tests ✨

scripts/
└── launch-checklist.js # Pre-deploy validation ✨

content/
└── style-guide.md      # Copy & tone guide ✨
```

---

## 🔗 Key URLs

| Endpoint | Description |
|----------|-------------|
| `/` | Home page with hero |
| `/generate` | Receipt creation form |
| `/receipt/{slug}` | Receipt view |
| `/api/og?slug={slug}` | Dynamic OG image |
| `/api/create` | Create receipt API |
| `/api/report` | Report abuse API |

---

## 📜 Single Share Caption

Use this caption for all social sharing:

> **"No refunds. Just receipts — close the tab and glow up."**

---

## 🛡️ Migration Notes

When merging to `main`:

1. Review feature flags and enable as needed
2. Add Poppins font to `public/fonts/` for PDF embedding
3. Set `NEXT_PUBLIC_BASE_URL` in production
4. Run launch checklist before deploy
5. Test OG images with social debuggers

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
