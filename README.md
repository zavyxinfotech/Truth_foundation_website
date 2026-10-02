# Truth Foundation — Official NGO Landing & Donation Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/zavyxinfotech/Truth_Foundation_Landing_Page)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff.svg)](https://vitejs.dev/)

A high-converting, fully responsive, SEO-optimized Public Charitable Trust landing and donation platform for **Truth Foundation** (Registered NGO • Est. 5th July 2010, Chennai, India).

---

## 🌟 About Truth Foundation

Truth Foundation is a registered Public Charitable Trust dedicated to empowering underprivileged children, abandoned seniors, and special-needs communities across Tamil Nadu.

### Core Initiatives & Impact
- 🏠 **Redhills Orphanage Home**: Operating for over 15 years on ~1 acre of land in rural Redhills, Chennai, providing separate dormitories, study halls, playgrounds, and nutritious meals for **45 resident boys and girls** cared for by 16 committed staff members.
- ♿ **Special Needs School (China Ikaadu, Thiruvallur)**: Specialized education, physiotherapy, and doorstep van pickup/drop for **23 children with intellectual disabilities**.
- 👴 **Old Age Day Care Center**: Food, shelter, medication, and loving care for **20 abandoned street seniors** in Redhills.
- 📚 **8 Evening Tuition & Child Care Centers**: Serving **346 underprivileged children** across Vyasarpadi, Pulianthope, Surapattu, Periyapalem, Vichoor, Perungavoor, Athipattu, and Thirumullaivoyal with free tuition, meals, notebooks, school bags, and hygiene kits.
- 🩺 **Health & AIDS Awareness Drives**: Weekly women SHG sessions and AIDS awareness rallies at Redhills Bypass.
- 📦 **COVID-19 & Emergency Relief**: Reached over **25,000 vulnerable individuals** (visually impaired, elderly, leprosy, gypsy, and transgender communities) across Thiruvallur, Kanchipuram, Chengalpattu, and Chennai districts.

---

## ✨ Features

- 📱 **100% Mobile-First Responsive Design**: Optimized typography, touch targets, and grid layouts across all viewport sizes.
- ⚡ **Razorpay Payment Integration**: Interactive checkout modal for both **One-Time** and **Monthly Recurring** donations.
- 🎠 **3D Rotating Field Gallery**: Interactive 3D carousel with modal popups exploring field stories.
- 🗺️ **Exact Google Maps Location Embed**: Dual office listings (Redhills Registered Home Office & Kolathur Corporate Office) with live Google Maps iframe.
- 💬 **WhatsApp Direct CTA**: One-click WhatsApp contact integration (`+91 63827 21178`) across header, hero, floating widget, and FAQ sections.
- 🔍 **Enterprise SEO Optimization**: Complete OpenGraph tags, Twitter Cards, canonical URL tags, and Schema.org JSON-LD structured data.
- 🛡️ **100% Strict Type Safety**: Full TypeScript validation (`tsc --noEmit`) enforced before every production build.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Payments**: Razorpay Payment Gateway API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zavyxinfotech/Truth_Foundation_Landing_Page.git
   cd Truth_Foundation_Landing_Page
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs strict TypeScript checks (`tsc --noEmit`) and builds the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type verification without emitting files |

---

## 📁 Directory Structure

```text
truth-foundation-updated-landing-page/
├── public/                  # Static assets & favicons
├── src/
│   ├── assets/              # Optimized images & brand logos
│   ├── components/          # React UI components
│   │   ├── AboutSection.tsx
│   │   ├── DonatePage.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── Footer.tsx
│   │   ├── GallerySection.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── RazorpayModal.tsx
│   │   ├── ScrollSection.tsx
│   │   ├── TrustSection.tsx
│   │   └── WhyDonate.tsx
│   ├── data/
│   │   └── campaignData.ts  # NGO campaigns, FAQs, gallery & testimonials data
│   ├── utils/
│   │   └── pixelTracker.ts # Event tracking utilities
│   ├── App.tsx              # Main application root
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind CSS v4 entry
│   └── types.ts             # TypeScript definitions
├── cSpell.json              # Spellchecker configuration
├── tailwind.config.js       # Tailwind theme configuration
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite configuration
```

---

## 🖼️ Images

Two pipelines, both automatic:

| Where | How | When to touch |
| :--- | :--- | :--- |
| **Bundle images** (`src/assets/images/*`) | Imported with a [vite-imagetools](https://github.com/JonasKruckenberg/imagetools) query, e.g. `import hero from './hero.jpg?w=640;960;1376&format=webp;jpg&as=picture'`, rendered with `<Picture picture={hero} sizes="100vw" alt="…" />`. Vite emits resized WebP + JPEG fallbacks with hashed names at build time. Small single-size images use `?w=128&format=webp` and get a plain URL string. | Add a new photo: drop a ≤1600px JPEG in `src/assets/images`, import it with a query, pick `sizes` from the rendered CSS width. |
| **Static assets** (`public/`: favicons, `apple-touch-icon.png`, `og-image.jpg`, `logo-256.png`) | Generated by `npm run assets:static` (`scripts/generate-static-assets.mjs`, uses `sharp`) from the logo and first hero image. | Re-run and commit `public/` when the logo or hero image changes. |

The first hero slide is the LCP element; `plugins/lcp-preload.ts` injects a responsive `<link rel="preload" imagesrcset>` for its exact WebP files into `dist/index.html` at build time (keep its `widths` in sync with the `?w=` directive in `Hero.tsx`).

---

## 📍 Contact & Offices

- **Corporate Office**: #49, Venus Nagar Main Road, Kolathur, Chennai - 600099 (Phone: `044-28552376`)
- **Registered Home Office**: #244, Mallima Nagar, Vilagadupakkam, Redhills, Chennai - 600052 (Phone: `044-26511661`)
- **WhatsApp Support**: [+91 99622 94949](https://wa.me/919962294949)

---

## 👨‍💻 Credits

Developed with ❤️ by **ZAVYX InfoTech** — [https://zavyx.odoo.com/](https://zavyx.odoo.com/)
