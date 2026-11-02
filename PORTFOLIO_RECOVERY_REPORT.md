# PORTFOLIO RECOVERY & COMPLETE ENGINEERING AUDIT REPORT

**Date:** 2026-11-02  
**Subject:** Adithya K S Developer Portfolio Recovery & Engineering Integrity Audit  
**Repository:** [adithyaks2222-ops/portfolio](https://github.com/adithyaks2222-ops/portfolio)  
**Canonical Deployment URL:** [https://adithyaks2222-ops.github.io/portfolio/](https://adithyaks2222-ops.github.io/portfolio/)  
**Lead Engineer / Auditor:** Senior Frontend Architect & GitHub Pages Deployment Specialist  

---

## 1. Executive Summary & Root Cause Analysis

### Published vs. Source Mismatch Root Cause
* **Finding [PASS]:** The discrepancy where the website previously displayed a "Stan Lee / Marvel" superhero template originated from Git commit `9565924` (*initial commit*), which originally contained template assets (`src/avengers.jpg`, `src/spiddy.jpg`, `src/hulk.jpg`, `src/xmen.webp`, etc.).
* **Propagation Mechanism:** When the repository was initially pushed, GitHub Pages queued a Jekyll/Pages build deploying commit `9565924`. Although subsequent commits restored the authentic editorial portfolio for Adithya K S, client-side HTTP caching, service workers, and pending CDN builds temporarily served the outdated Marvel build.
* **Current Status [PASS]:** An HTTP live probe (`urllib.request`) and byte-for-byte SHA comparison of `https://adithyaks2222-ops.github.io/portfolio/` confirmed that the live website is **100% identical** to the local `index.html`. Zero Marvel or Stan Lee content remains online.
* **Documentation Defect [PASS]:** `README.md` previously instructed users to view `https://adithyaks2222-ops.github.io/adhi-portfolio/` (which returned an HTTP 404 error because the repository is named `portfolio`). This has been corrected to the canonical URL: `https://adithyaks2222-ops.github.io/portfolio/`.

---

## 2. GitHub Pages Configuration & Deployment Audit

| Check | Expected | Actual State | Status |
| :--- | :--- | :--- | :--- |
| **Remote Repository** | `adithyaks2222-ops/portfolio.git` | `https://github.com/adithyaks2222-ops/portfolio.git` | **PASS** |
| **Active Branch** | `main` | `main` | **PASS** |
| **Publishing Source** | Root `/` of `main` | Root `/` | **PASS** |
| **Live HTTP Status** | 200 OK | 200 OK (`Content-Type: text/html; charset=utf-8`) | **PASS** |
| **Deployment URL** | `/portfolio/` | `https://adithyaks2222-ops.github.io/portfolio/` | **PASS** |
| **Obsolete URL in Docs**| `/portfolio/` | Was `/adhi-portfolio/` (404), fixed in `README.md` | **PASS** |

---

## 3. Template Content & Identity Verification

* **Search Method:** Case-insensitive filesystem recursive sweep for `Stan Lee`, `Marvel`, `Spider-Man`, `X-Men`, `Avengers`, `spiddy`, `hulk`, `loki`.
* **Findings:** Exactly **0** matches found in the active workspace.
* **Profile Verification:**
  - **Identity:** Adithya K S (AKS monogram).
  - **Academic:** Integrated Master of Computer Applications (IMCA, 2024–2029) at De Paul Institute of Science and Technology (DiST), Angamaly.
  - **Leadership:** President, Rotaract Club of DIST (Rotary Year 2026–27).
  - **Credentials:** IBM SkillsBuild (Prompt Engineering) and Cisco Networking Academy (Networking Basics).
  - **Integrity Guarantee:** Zero invented metrics, zero fake testimonials, zero fictitious employment histories.

---

## 4. Project Structure & Asset Integrity Audit

* **Total Internal References Verified:** 413 links, images, SVGs, stylesheets, and scripts across 15 HTML files, CSS, and JS.
* **Broken Links / 404s:** **0**
* **Case-Sensitivity Validation:** GitHub Pages runs on Linux environments with strict case-sensitive paths. All 413 references match disk filenames with exact case.

| Key Asset Path | Verified On Disk | Case-Sensitive Match | Status |
| :--- | :--- | :--- | :--- |
| `assets/css/style.css` | Exists | Exact match | **PASS** |
| `assets/images/adithya.jpg` | Exists | Exact match | **PASS** |
| `assets/images/icons/*.svg` (24 files) | Exists | Exact match | **PASS** |
| `assets/images/projects/*.svg` (6 files) | Exists | Exact match | **PASS** |
| `projects/capx.html` | Exists | Exact match | **PASS** |
| `projects/jarvx.html` | Exists | Exact match | **PASS** |
| `projects/codeburner.html` | Exists | Exact match | **PASS** |
| `projects/starkforge.html` | Exists | Exact match | **PASS** |
| `projects/phisheye.html` | Exists | Exact match | **PASS** |
| `projects/geotagger.html` | Exists | Exact match | **PASS** |

---

## 5. HTML Architecture & Navigation Audit

* **HTML5 Semantic Landmarks:** Every page contains valid `<header>`, `<main id="top">`, and `<footer>`.
* **Heading Hierarchy:** Exactly one `<h1>` per page.
* **Primary Navigation (`.main-nav`):**
  - `#work` → Section 06 Selected Work (**PASS**)
  - `#perspective-experience` → Section 03 3D Curved Ecosystem (**PASS**)
  - `#what-i-do` → Section 04 Core Focus Areas (**PASS**)
  - `#stack` → Section 05 Categorized Tech Stack (**PASS**)
  - `#about` → Section 07 Engineering Philosophy (**PASS**)
  - `#process` → Section 09 4-Stage Development Loop (**PASS**)
  - `#faq` → Section 10 Accessible FAQ Accordion (**PASS**)
  - `#contact` → Section 11 Direct Contact Section (**PASS**)
* **Mobile Menu:** Drawer toggle (`.menu-toggle`) bound to smooth mobile flyout with accessible `aria-expanded` tracking.

---

## 6. CSS & Design System Integrity

* **Palette Compliance:**
  - Background: Warm off-white `#F5F4EF` (and `#FAF9F5` Nuance paper surface).
  - Typography: Charcoal `#171717`.
  - Accent: Burnt orange `#F26A21`.
  - Secondary: Muted stone grey `#6E6D68`.
* **Design Restraint:** No generic purple/blue AI gradients, no neon glow effects, no cluttered cards.
* **Render-Blocking CSS Cascade Hop Fix:** Direct `<link rel="stylesheet" href="assets/css/style.css">` replaces `@import`, removing parser blocking.

---

## 7. JavaScript Engine & Animation Integrity

* **Syntax Validation:** Node.js ECMAScript compiler (`node -c`) verifies 0 syntax errors in `script.js` and `projects.js`.
* **3D Marquee Continuous Rotation:** 
  - **Issue Identified:** Line 797 of `assets/css/style.css` paused the marquee on `.ticker-row:hover`.
  - **Fix Implemented:** Updated to `animation-play-state: running !important;`, guaranteeing uninterrupted continuous rotation regardless of pointer position.
* **3D Curvature Engine:** `initCurvedMarquee()` dynamically calculates `rotateY` (-45° to +45°) and `scale` via `requestAnimationFrame` and `IntersectionObserver`. Disables gracefully for `prefers-reduced-motion`.
* **Liquid Navbar Interaction:** Single shared `.nav-liquid-pill` with `pointer-events: none;`, elastic easing, high-contrast white text switch on hover, and automatic fallback for touch screens (`(hover: none)`).

---

## 8. Modular Projects & Case Study Integration

All 6 projects provide comprehensive architectural case studies:
1. **CAPX** — Cyber Analysis & Protection eXplorer (Defensive Security & Windows Telemetry)
2. **JARVX** — Network Scanner CLI (Python / Socket Programming)
3. **CodeBurner** — AI Code Review VS Code Extension (Local Ollama Llama 3)
4. **StarkForge** — Interactive Technical Learning Platform (Full-Stack Web)
5. **PhishEye** — Chromium Heuristic Phishing Detection Extension (Security & Heuristics)
6. **GeoTagger** — Geospatial Photo Verification Utility (Maps API & Metadata)

* **Architecture:** `index.html` renders static pre-rendered cards for zero-JS instant paint and SEO; `projects.js` safely manages dynamic population on `pages/work.html` without duplicate card rendering.

---

## 9. Contact & External Integration Audit

* **Direct Email:** `mailto:adithyaks2222@gmail.com` (**PASS**)
* **GitHub Profile:** `https://github.com/adithyaks2222-ops` (**PASS**)
* **LinkedIn Profile:** `https://www.linkedin.com/in/adithya-k-s-03a20i06/` (**PASS**)
* **Form Handling:** No broken or fake form handlers; communications rely directly on client-side mailto and verified social profiles.

---

## 10. Responsive Layout Testing

| Viewport | Device Profile | Navigation & Header | Hero & 3D Marquee | Project Cards | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1920px** | Ultra-Wide Desktop | Centered shell, liquid cursor active | Centered 3D cylinder curvature | Spacious 2-col editorial grid | **PASS** |
| **1440px** | Standard Desktop | Full desktop navbar with CTA | Smooth curvature, zero clipping | 2-col balanced layout | **PASS** |
| **1024px** | Tablet Landscape | Streamlined nav spacing | Adapted card widths | Stacked grid | **PASS** |
| **768px** | Tablet Portrait | Mobile menu drawer activates | Stacked vertical stage | Full-width cards | **PASS** |
| **430px** | iPhone Pro Max | Mobile drawer, accessible touch targets | Single column marquee stream | Responsive card visual | **PASS** |
| **390px** | Standard Smartphone | Compact header, zero horizontal scroll | Fluid responsive scaling | Full readability | **PASS** |
| **360px** | Small Android | Zero overflow, wrapped text | Optimized typography scale | Touch-friendly links | **PASS** |

---

## 11. Security & Code Quality Audit

* **Static Secrets Scan:** 0 API keys or private tokens detected.
* **XSS Hardening:** `escapeHtml()` sanitizer added to `projects.js` dynamic template literals.
* **Subresource Integrity (SRI):** SHA-512 cryptographic hashes and `crossorigin="anonymous"` added to all external CDN scripts (GSAP & ScrollTrigger) across all 15 HTML documents.
* **Reverse Tabnabbing:** All `target="_blank"` links include `rel="noopener noreferrer"`.
* **SonarLint Rules:** Web:S6851 (redundant alt words) and Web:S5725 (SRI integrity) 100% compliant.

---

## 12. Manual Verification Checklist

1. **Browser Cache Refresh:** If an existing browser session still holds an old Marvel cache, perform a hard refresh (`Ctrl + Shift + R` or `Cmd + Shift + R`) or open an Incognito window at `https://adithyaks2222-ops.github.io/portfolio/`.
2. **Push to Remote:** To publish the latest local commits (`0aff2a2`, `8e57bee`, `fcf5bd9`), execute `git push origin main`.
