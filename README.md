# abhyudaychoumal.github.io

Personal portfolio for **Abhyuday Choumal** — backend developer & architect.
Live at [https://abhyudaychoumal.github.io](https://abhyudaychoumal.github.io).

---

## Tech stack

- **React 19** + **TypeScript** + **Vite 8** — UI shell and build pipeline
- **GSAP 3** — `ScrollSmoother`, `ScrollTrigger`, `SplitText` for the animation system
- **Three.js** + `@react-three/fiber` + `@react-three/drei` — WebGL canvases
- **`@react-three/rapier`** — physics for the TechStack ball pit
- **Draco** geometry compression + **WebP** texture re-encoding for the 3D avatar
- **react-fast-marquee** for the scrolling text strips
- **Formspree** for the contact form
- **GitHub Actions** + **GitHub Pages** for the deploy pipeline

---

## Run locally

Requires **Node 20+** (Node 22 recommended; we ship `.nvmrc` if you use `nvm`/`fnm`).

```bash
git clone https://github.com/ABHYUDAYCHOUMAL/ABHYUDAYCHOUMAL.github.io.git
cd ABHYUDAYCHOUMAL.github.io
npm install
npm run dev
```

The dev server prints a URL — by default `http://localhost:5173`. It supports hot-module reload, so saves in any source file refresh the browser automatically.

### Other npm scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and produce a production bundle in `dist/` |
| `npm run preview` | Serve the contents of `dist/` locally on port 4173 — useful for verifying the production build before deploying |
| `npm run lint` | Run ESLint over `.ts` / `.tsx` sources |
| `npm run optimize:avatar` | Re-compress `public/avatar.glb` with Draco geometry + WebP textures (run if you swap the avatar source) |

---

## Project structure

```
.
├─ .github/workflows/deploy.yml   GitHub Actions → builds + deploys to Pages
├─ public/                        Static assets served as-is
│  ├─ avatar.glb                  Draco/WebP-compressed 3D avatar
│  ├─ draco/                      WASM decoder for the avatar
│  ├─ profile.jpg                 Photo fallback
│  ├─ favicon.svg
│  └─ Resume_Abhyuday_Choumal.pdf
├─ scripts/optimize-avatar.mjs    GLB compression pipeline (gltf-transform + sharp)
├─ src/
│  ├─ data/site.ts                Single source of truth for ALL portfolio content
│  │                              (name, bio, career, projects, social, env)
│  ├─ lib/
│  │  ├─ gsap.ts                  Plugin registration + reduced-motion / touch detection
│  │  ├─ reveal.ts                data-reveal scroll-reveal system
│  │  └─ magnetic.ts              .magnetic class — buttons pull toward cursor
│  └─ components/
│     ├─ Landing.tsx              Hero (avatar + name + role + CTAs)
│     ├─ AvatarCanvas.tsx         3D avatar (Suspense, error boundary, frameloop gating)
│     ├─ About.tsx                Bio + animated stat counters
│     ├─ WhatIDo.tsx              Skill buckets (touch-tap expand on mobile)
│     ├─ Career.tsx               Experience timeline (scrubbed grow animation)
│     ├─ Work.tsx                 Projects (horizontal pinned scroll on desktop)
│     ├─ TechStack.tsx            Brand-coloured ball pit physics scene
│     ├─ Contact.tsx              Formspree-backed message form
│     ├─ Navbar.tsx               Glass-blur sticky navbar
│     ├─ SocialIcons.tsx          Left-rail social links
│     ├─ Footer.tsx
│     ├─ Cursor.tsx               Custom cursor (dot + ring, mix-blend-difference)
│     ├─ AmbientGlow.tsx          Cursor-follow radial glow
│     ├─ MarqueeStrip.tsx         Edge-to-edge scrolling text divider
│     ├─ LoadingScreen.tsx        Splash with progress + click-to-enter
│     ├─ SmoothScroll.tsx         ScrollSmoother wrapper, scroll restoration
│     ├─ CanvasErrorBoundary.tsx  Catches WebGL crashes without taking down the page
│     └─ styles/                  One CSS file per component
└─ legacy/                        Pre-rebuild Bootstrap site, kept as historical reference
```

### Where to edit content

- All copy / project list / career history → **`src/data/site.ts`**
- Section structure / layout → **`src/components/<Section>.tsx`**
- Section styling → **`src/components/styles/<Section>.css`**
- Site-wide design tokens (colours, fonts, spacing) → **`src/index.css`**

---

## Environment configuration

Vite reads `.env` files at build time. **Variables must start with `VITE_`** to be exposed to the browser.

| File | Committed | Use |
|---|---|---|
| `.env.development` | ✓ | Defaults loaded by `npm run dev` |
| `.env.production`  | ✓ | Defaults loaded by `npm run build` |
| `.env.example`     | ✓ | Documentation of available variables |
| `.env.local`       | ✗ | Per-machine overrides (real keys, debug toggles) |

Variables in use:

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Public canonical URL (used in OG tags) |
| `VITE_FORMSPREE_ID` | Contact form endpoint segment — see [Formspree](https://formspree.io/) |
| `VITE_GA_ID` | Google Analytics 4 measurement ID (leave empty to disable) |
| `VITE_RPM_AVATAR_URL` | Optional remote `.glb` avatar URL — overrides the bundled `/avatar.glb` if set |

---

## Deployment

Pushes to the `redesign` branch trigger `.github/workflows/deploy.yml` which:

1. Installs dependencies (`npm ci`)
2. Builds the production bundle (`npm run build`)
3. Uploads `dist/` as a GitHub Pages artifact
4. Publishes to [https://abhyudaychoumal.github.io](https://abhyudaychoumal.github.io)

GitHub Pages is configured under **Settings → Pages → Source → GitHub Actions**. No `gh-pages` branch is used — the artifact is served directly.

---

## Performance notes

- The 3D avatar is **0.85 MB** (down from 4.05 MB raw) thanks to Draco geometry + WebP texture re-encoding.
- Both WebGL canvases (avatar, TechStack) use `frameloop: "demand"` when off-screen, so they consume zero CPU/GPU when not in view.
- The Three.js + Rapier bundles are lazy-loaded — initial JS payload is ~135 KB gzipped.
- Reveal animations use per-element `IntersectionObserver` triggers, refreshable on resize and on lazy-mount, with no `MutationObserver` (which would feedback-loop with `ScrollTrigger.pin`).

---

## Accessibility

- `prefers-reduced-motion: reduce` short-circuits ScrollSmoother, all reveal animations, the custom cursor, the loading-screen splash transitions, and the avatar tilt.
- Touch devices get the native pointer + native momentum scroll (no smoother).
- Reveal targets stay visible (`opacity: 1`) when reduced motion is on.
- Form labels and ARIA attributes on the contact form, status pills, and decorative regions.

---

## License

All source code in this repository is the personal property of Abhyuday Choumal.
Inspired by patterns common in modern portfolio sites; original work and
content. Not licensed for commercial reuse without permission.
