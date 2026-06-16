# Closure Receipt

> Turn your breakup into a receipt. Share it, download it, and move on.

Closure Receipt is a witty, modern web application built for reflection, not revenge. It allows users to generate a "receipt" quantifying their past relationships, complete with emotional damage calculations, tailored microcopy, and dynamic social sharing.

---

## 🎯 The Purpose

Breakups are messy. **Closure Receipt** is designed to provide a playful, structured way to process the end of a relationship. Instead of sending an angry text, users can fill out a form to quantify the "investment" (time, money, and emotional damage) and receive a beautifully formatted, downloadable receipt. It turns the chaotic feelings of a breakup into a clean, tangible, and humorous artifact—helping people close the tab on the past and move forward.

## 🛠️ How It Works

1. **The Assessment:** The user fills out an interactive, multi-step form detailing their relationship (partner's name, time invested, money spent, betrayal level, and emotional damage).
2. **The Calculation:** Based on the slider inputs (like "Emotional Damage" from 0-10), the application dynamically generates a custom "Mood Profile" (Calm, Reflective, Spicy, or Nuclear), complete with color palettes and mascot expressions.
3. **The Receipt:** The app securely saves the data in MongoDB and generates a unique, shareable receipt URL.
4. **The Closure:** The user can download the receipt as a PDF, share an Open Graph social card on Twitter/Instagram, or copy an embed badge for their personal site.

---

## ✨ Features

- **Dynamic Receipt Generation:** Calculates "lessons learned" and tone-specific copy based on user input.
- **Robust Architecture:** Built on Next.js App Router with strict TypeScript enforcement.
- **MongoDB Integration:** Secure receipt storage and a robust, horizontally scalable MongoDB-backed rate limiter (Standard: 10/min, Strict: 1/min + 10/day).
- **Vercel Analytics:** Native integration with `@vercel/analytics` for seamless, privacy-respecting event tracking.
- **Dynamic SEO & Open Graph:** Automated `sitemap.ts` generation and an on-the-fly `/api/og` endpoint that generates 1200x630 SVG social cards featuring the brand mascot.
- **Accessibility First:** Supports `prefers-reduced-motion`, `aria-live` value announcements, and comprehensive focus trapping.
- **Brand Voice Consistency:** Highly curated copy (`lib/copy.ts`), including bespoke, witty 404 pages and subtle mascot interactions.

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your environment:**
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```bash
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/closureDB"
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎛️ Feature Flags

Closure Receipt makes heavy use of feature flags to allow safe rollouts and toggling of experimental UI/UX features. These are managed in your `.env.local`:

```bash
# UI Enhancements
NEXT_PUBLIC_FEATURE_POLISHED_HERO="false"
NEXT_PUBLIC_FEATURE_MASCOT_INTERACTION="false"

# Analytics & Moderation
NEXT_PUBLIC_FEATURE_ANALYTICS="true"
NEXT_PUBLIC_FEATURE_CONTENT_MODERATION="true"

# Export & Sharing
NEXT_PUBLIC_FEATURE_OG_API="true"
NEXT_PUBLIC_FEATURE_PDF_FONTS="false"
NEXT_PUBLIC_FEATURE_EMBED_BADGE="false"

# Security & Limits
NEXT_PUBLIC_FEATURE_STRICT_RATE_LIMIT="false"
```

*Note: In a production environment, `NEXT_PUBLIC_FEATURE_ANALYTICS` and `NEXT_PUBLIC_FEATURE_OG_API` will automatically default to `true` if left undefined.*

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── create/     # Secure receipt generation
│   │   ├── og/         # Dynamic SVG Open Graph generator
│   │   └── report/     # Unified moderation & reporting
│   ├── generate/       # Interactive form interface
│   └── receipt/[id]/   # Dynamic receipt view & 404
├── components/
│   ├── mascot.tsx      # SVG mascot with mood states
│   ├── embed-badge.tsx # Embeddable badge widget
│   └── ui/             # Reusable UI primitives
├── lib/
│   ├── analytics.ts    # Vercel Analytics wrapper
│   ├── mongodb.ts      # Singleton DB connection
│   ├── rate-limit.ts   # MongoDB-backed rate limiter
│   └── types.ts        # Strict TypeScript schemas
└── __tests__/          # Jest test suites
```

---

## 🧪 Testing

The project maintains rigorous test coverage ensuring copy validation, content moderation filters, rate limiting logic, and Open Graph generation remain pristine.

```bash
# Run the test suite
npm test
```

---

## 🚀 Deployment

Closure Receipt is perfectly optimised for [Vercel](https://vercel.com/). 

Before deploying, ensure:
1. Your MongoDB Atlas cluster is configured to allow connections from Vercel's IP range (or `0.0.0.0/0`).
2. Your production `NEXT_PUBLIC_BASE_URL` is correctly set in your Vercel Environment Variables to ensure Open Graph images and share links resolve correctly.

```bash
npm run build
npm start
```
