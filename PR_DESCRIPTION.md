# polish: viral-ready improvements, OG + PDF font embed, analytics

## Summary

Comprehensive polish update to make Closure Receipt share-worthy and production-ready.

## Changes

### 🎨 High-Impact Visual Polish
- **Hero redesign**: Three-line structure with 6.5rem headlines (desktop)
- **Breakup word**: -2° rotation, accent underline
- **CTA animation**: Scale 1.06 on hover (120ms transition)
- **Mascot interaction**: Blinks/glances when CTA is hovered

### 🖼️ OG Image API
- New endpoint: `GET /api/og?slug={slug}`
- Returns dynamic SVG (1200×630)
- Includes verdict, subtitle, receipt number, mascot
- Proper cache headers for CDN

### 📄 PDF Improvements
- Poppins ExtraBold font embedding
- Print-optimised styles
- Font preloading utilities

### 📊 Analytics Instrumentation
- Lightweight event tracking interface
- Easy provider swap (GA4, Mixpanel, etc.)
- Opt-out support via query param or localStorage
- Key events: page views, receipt creation, downloads, shares

### 🔒 Security & Ethics
- Enhanced rate limiting (strict mode: 1/min, 10/day)
- Content moderation on "last words" field
- Report API at `/api/report`
- Privacy tip in form

### ♿ Accessibility
- `aria-live` announcements for slider values
- Proper `aria-label` attributes
- `prefers-reduced-motion` support
- Focus management improvements

### 📝 Copy Standardisation
- Central copy constants in `/lib/copy.ts`
- Style guide at `/content/style-guide.md`
- Single share caption: "No refunds. Just receipts — close the tab and glow up."

### 🎛️ Feature Flags
All new functionality is behind feature flags for safe rollout:
- `NEXT_PUBLIC_FEATURE_POLISHED_HERO`
- `NEXT_PUBLIC_FEATURE_OG_API`
- `NEXT_PUBLIC_FEATURE_MASCOT_INTERACTION`
- `NEXT_PUBLIC_FEATURE_ANALYTICS`
- `NEXT_PUBLIC_FEATURE_CONTENT_MODERATION`
- `NEXT_PUBLIC_FEATURE_PDF_FONTS`
- `NEXT_PUBLIC_FEATURE_STRICT_RATE_LIMIT`
- `NEXT_PUBLIC_FEATURE_EMBED_BADGE`

## New Files
- `src/lib/copy.ts` — Standardised copy constants
- `src/lib/analytics.ts` — Event tracking interface
- `src/lib/feature-flags.ts` — Feature toggles
- `src/lib/moderation.ts` — Content filtering
- `src/lib/pdf-fonts.ts` — PDF font utilities
- `src/app/api/og/route.ts` — OG image endpoint
- `src/app/api/report/route.ts` — Report abuse endpoint
- `src/components/embed-badge.tsx` — Embeddable widget
- `content/style-guide.md` — Copy & tone guide
- `scripts/launch-checklist.js` — Pre-deploy validation
- `src/__tests__/og-api.test.ts`
- `src/__tests__/pdf-fonts.test.ts`
- `src/__tests__/moderation.test.ts`
- `src/__tests__/analytics.test.ts`
- `src/__tests__/copy.test.ts`

## Modified Files
- `src/app/page.tsx` — Polished hero
- `src/app/globals.css` — Hero sizes, reduced motion
- `src/components/mascot.tsx` — Interaction state
- `src/lib/rate-limit.ts` — Strict mode
- `src/app/receipt/[id]/page.tsx` — OG meta tags
- `src/app/receipt/[id]/receipt-card.tsx` — Analytics, PDF fonts, report
- `src/app/receipt/[id]/share-buttons.tsx` — Share caption, analytics
- `src/app/generate/generate-form.tsx` — Moderation, accessibility
- `README.md` — Full documentation update

## Testing

```bash
# Run unit tests
npm test

# Run launch checklist (with dev server running)
node scripts/launch-checklist.js
```

### Manual Testing
1. **OG endpoint**: Visit `/api/og?slug=test-receipt`
2. **PDF fonts**: Download a receipt PDF, check Poppins renders
3. **Share caption**: Share a receipt, verify prefilled text
4. **Moderation**: Enter profanity in "last words", check it's blocked
5. **Rate limiting**: Enable strict mode, verify 1/min limit

## Migration Notes

Before merging to `main`:
1. Add Poppins font file to `public/fonts/Poppins-ExtraBold.woff2`
2. Configure `NEXT_PUBLIC_BASE_URL` in production
3. Review and enable feature flags as needed
4. Test OG images with Facebook/Twitter debuggers
5. Run `node scripts/launch-checklist.js`
