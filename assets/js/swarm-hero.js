/**
 * ============================================================================
 * HERO SWARM CINEMATIC RECONSTRUCTION ENGINE
 * Autonomous multiplayer-style cursor swarm simulating collaborative design-tool
 * reconstruction of the hero section on initial page entrance.
 *
 * Attribution:
 * Concept inspired by Joel Califa's Swarm & Dhvanil Patel's Swarm Cursors.
 * Original clean-room implementation in Vanilla JavaScript & HTML5 Canvas.
 * Zero external dependencies.
 *
 * Design System & Color Architecture:
 * - Canvas & Overlay Paper: #F5F4EF
 * - Primary Lead Cursor (AKS): #F26A21 (Burnt Orange)
 * - Collaborator Cursors: #171717 / #242424 (Charcoal)
 * - Alignment Guides: #F26A21 / #D8D8D1
 * ============================================================================
 */

(function () {
  'use strict';

  // --- 1. Vector Physics Helper ---
  class Vec2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    }
    mult(n) {
      this.x *= n;
      this.y *= n;
      return this;
    }
    mag() {
      return Math.hypot(this.x, this.y);
    }
    dist(v) {
      return Math.hypot(this.x - v.x, this.y - v.y);
    }
    copy() {
      return new Vec2(this.x, this.y);
    }
  }

  // --- 2. Swarm Agent Representation ---
  class SwarmAgent {
    constructor(name, color, startPos) {
      this.name = name;
      this.color = color;
      this.pos = startPos.copy();
      this.target = startPos.copy();
      this.vel = new Vec2(0, 0);
      this.scale = 1;
      this.clicking = false;
      this.maxSpeed = 16;
      this.ease = 0.09;
      this.visible = true;
    }

    setTarget(x, y, maxSpeed = 16, ease = 0.09) {
      this.target.set(x, y);
      this.maxSpeed = maxSpeed;
      this.ease = ease;
    }

    update() {
      const dx = this.target.x - this.pos.x;
      const dy = this.target.y - this.pos.y;
      this.pos.x += dx * this.ease;
      this.pos.y += dy * this.ease;
    }

    render(ctx) {
      if (!this.visible) return;

      const x = Math.round(this.pos.x);
      const y = Math.round(this.pos.y);

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(this.scale, this.scale);

      // Soft natural elevation shadow
      ctx.shadowColor = 'rgba(23, 24, 22, 0.22)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      // Figma-style vector cursor arrow
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 16.5);
      ctx.lineTo(4.2, 12.3);
      ctx.lineTo(7.5, 19.5);
      ctx.lineTo(10.5, 18.2);
      ctx.lineTo(7.2, 11.2);
      ctx.lineTo(13.5, 11.2);
      ctx.closePath();

      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.lineWidth = 1.25;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Reset shadow for text badge
      ctx.shadowColor = 'transparent';

      // Collaborator Pill Badge
      const badgeText = this.name;
      ctx.font = '600 10px "DM Mono", monospace';
      const textWidth = ctx.measureText(badgeText).width;
      const padX = 6;
      const badgeH = 17;
      const badgeW = textWidth + padX * 2;
      const badgeX = 13;
      const badgeY = 12;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
      } else {
        ctx.rect(badgeX, badgeY, badgeW, badgeH);
      }
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);

      // Pulse / ripple effect if clicking
      if (this.clicking) {
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // --- 3. Hero Swarm Orchestrator ---
  class HeroSwarmController {
    constructor() {
      this.overlay = null;
      this.canvas = null;
      this.ctx = null;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.rafId = null;
      this.startTime = null;
      this.duration = 3800; // brisk & cinematic (ms)
      this.agents = [];
      this.hasPlayed = false;
      this.isFinished = false;
      this.onCompleteCallback = null;

      // Element Rects
      this.rects = {
        eyebrow: null,
        title: null,
        copy: null,
        aside: null,
        atom: null,
        header: null
      };

      // Construction Operation Trackers
      this.ops = {
        eyebrowBox: 0,
        titleBox: 0,
        atomRings: 0,
        atomCrosshair: 0,
        bottomBoxes: 0,
        guidesAlpha: 0
      };
    }

    /**
     * Measure current DOM geometry for hero elements
     */
    measureHeroElements() {
      const hero = document.querySelector('.hero');
      if (!hero) return false;

      const eyebrow = hero.querySelector('.eyebrow');
      const title = hero.querySelector('.hero-title');
      const copy = hero.querySelector('.hero-copy');
      const aside = hero.querySelector('.hero-aside');
      const atom = hero.querySelector('.hero-art');
      const header = document.querySelector('.site-header');

      const getSafeRect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.left),
          y: Math.round(r.top),
          width: Math.round(r.width),
          height: Math.round(r.height),
          cx: Math.round(r.left + r.width / 2),
          cy: Math.round(r.top + r.height / 2)
        };
      };

      this.rects = {
        eyebrow: getSafeRect(eyebrow),
        title: getSafeRect(title),
        copy: getSafeRect(copy),
        aside: getSafeRect(aside),
        atom: getSafeRect(atom),
        header: getSafeRect(header)
      };

      return true;
    }

    /**
     * Mount full-screen paper overlay and drawing canvas
     */
    setupDOM() {
      // Pin scroll to top and lock overflow during intro
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';

      // 1. Overlay to temporarily blank the hero
      this.overlay = document.createElement('div');
      this.overlay.className = 'hero-swarm-overlay';
      document.body.appendChild(this.overlay);

      // 2. High-DPI Canvas for cursor drawings
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'hero-swarm-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      this.resizeCanvas();
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      // 3. Prepare Hero Elements with zero opacity for synchronized reveal
      const hero = document.querySelector('.hero');
      if (hero) {
        const els = hero.querySelectorAll('.eyebrow, .hero-title, .hero-copy, .hero-aside, .hero-art');
        els.forEach((el) => {
          el.style.opacity = '0';
          el.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
      }

      const siteHeader = document.querySelector('.site-header');
      if (siteHeader) {
        siteHeader.style.opacity = '0';
        siteHeader.style.transition = 'opacity 0.4s ease';
      }
    }

    resizeCanvas() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (this.canvas) {
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
      }
    }

    /**
     * Initialize the multiplayer swarm collaborators
     */
    initAgents() {
      const W = this.width;
      const H = this.height;

      // 6 collaborative cursors originating from diverse viewport edges
      this.agents = [
        // Lead cursor: Adithya (AKS) in Burnt Orange
        new SwarmAgent('AKS', '#F26A21', new Vec2(-80, H * 0.25)),
        // Kernel: Systems & Structure
        new SwarmAgent('Kernel', '#171717', new Vec2(W + 80, H * 0.15)),
        // Syntax: Code & Typography
        new SwarmAgent('Syntax', '#242424', new Vec2(W * 0.3, -80)),
        // Vector: Orbits & Geometry
        new SwarmAgent('Vector', '#E45B14', new Vec2(W + 90, H * 0.65)),
        // Design: Layout & Details
        new SwarmAgent('Design', '#333333', new Vec2(W * 0.7, H + 80)),
        // Core: Quantum / Atom Specialist
        new SwarmAgent('Core', '#1A1A1A', new Vec2(-90, H * 0.75))
      ];
    }

    /**
     * Start the cinematic rebuild intro sequence
     */
    start(options = {}) {
      if (this.hasPlayed || sessionStorage.getItem('hero_swarm_played') === '1') {
        this.hasPlayed = true;
        this.isFinished = true;
        this.revealHeroImmediately();
        if (typeof options.onComplete === 'function') options.onComplete();
        return;
      }

      // Check user preferences
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;

      if (prefersReduced || isCoarse) {
        this.hasPlayed = true;
        this.isFinished = true;
        sessionStorage.setItem('hero_swarm_played', '1');
        this.revealHeroImmediately();
        if (typeof options.onComplete === 'function') options.onComplete();
        return;
      }

      this.onCompleteCallback = options.onComplete || null;
      this.hasPlayed = true;
      sessionStorage.setItem('hero_swarm_played', '1');

      this.measureHeroElements();
      this.setupDOM();
      this.initAgents();

      this.startTime = performance.now();
      this.loop = this.loop.bind(this);
      this.rafId = requestAnimationFrame(this.loop);
    }

    /**
     * Fallback for reduced motion / mobile: reveals hero immediately
     */
    revealHeroImmediately() {
      document.body.style.overflow = '';
      const hero = document.querySelector('.hero');
      if (hero) {
        const els = hero.querySelectorAll('.eyebrow, .hero-title, .hero-copy, .hero-aside, .hero-art');
        els.forEach((el) => {
          el.style.opacity = '1';
          el.style.transform = '';
          el.style.transition = '';
        });
      }
      const siteHeader = document.querySelector('.site-header');
      if (siteHeader) {
        siteHeader.style.opacity = '1';
        siteHeader.style.transition = '';
      }
    }

    /**
     * Main animation loop & choreographed event milestones
     */
    loop(now) {
      const elapsed = now - this.startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      this.updateChoreography(elapsed);
      this.render();

      if (progress < 1) {
        this.rafId = requestAnimationFrame(this.loop);
      } else {
        this.finish();
      }
    }

    /**
     * Synchronized Choreography Stages
     */
    updateChoreography(elapsed) {
      const W = this.width;
      const H = this.height;
      const r = this.rects;

      const ag0 = this.agents[0]; // AKS
      const ag1 = this.agents[1]; // Kernel
      const ag2 = this.agents[2]; // Syntax
      const ag3 = this.agents[3]; // Vector
      const ag4 = this.agents[4]; // Design
      const ag5 = this.agents[5]; // Core

      // --- STAGE 1: Entry & Flocking (0 - 500ms) ---
      if (elapsed < 500) {
        const p = elapsed / 500;
        this.ops.guidesAlpha = p * 0.45;

        ag0.setTarget(W * 0.22, H * 0.26, 18, 0.09);
        ag1.setTarget(W * 0.45, H * 0.32, 18, 0.09);
        ag2.setTarget(W * 0.35, H * 0.42, 18, 0.09);
        ag3.setTarget(W * 0.72, H * 0.38, 18, 0.09);
        ag4.setTarget(W * 0.55, H * 0.65, 18, 0.09);
        ag5.setTarget(W * 0.68, H * 0.55, 18, 0.09);
      }

      // --- STAGE 2: Reconstruct Eyebrow & Headline (500 - 1500ms) ---
      else if (elapsed < 1500) {
        const p = (elapsed - 500) / 1000;

        // ag0 (AKS) draws eyebrow selection
        if (r.eyebrow) {
          const ebX = r.eyebrow.x;
          const ebY = r.eyebrow.y;
          const ebW = r.eyebrow.width;
          ag0.setTarget(ebX + ebW * Math.min(p * 1.4, 1), ebY + r.eyebrow.height, 14, 0.12);
          this.ops.eyebrowBox = Math.min(p * 1.3, 1);

          if (p > 0.3) {
            const ebEl = document.querySelector('.hero .eyebrow');
            if (ebEl) ebEl.style.opacity = '1';
          }
        }

        // ag1 (Kernel) & ag2 (Syntax) drag title bounding box
        if (r.title) {
          const tX = r.title.x;
          const tY = r.title.y;
          const tW = r.title.width;
          const tH = r.title.height;

          const titleP = Math.max(0, (elapsed - 800) / 700);
          ag1.setTarget(tX + tW * Math.min(titleP * 1.2, 1), tY + tH * Math.min(titleP * 1.2, 1), 16, 0.1);
          ag2.setTarget(tX + tW * Math.min(titleP * 0.9, 1), tY, 14, 0.1);

          this.ops.titleBox = Math.min(titleP, 1);

          if (titleP > 0.55) {
            const tEl = document.querySelector('.hero .hero-title');
            if (tEl) tEl.style.opacity = '1';
          }
        }

        // ag3 (Vector) & ag5 (Core) prepare atom station
        if (r.atom) {
          ag3.setTarget(r.atom.cx - 50, r.atom.cy - 50, 12, 0.08);
          ag5.setTarget(r.atom.cx + 50, r.atom.cy + 50, 12, 0.08);
        }
      }

      // --- STAGE 3: Reconstruct 3D Atom & Hero Bottom (1500 - 2600ms) ---
      else if (elapsed < 2600) {
        const p = (elapsed - 1500) / 1100;

        // Atom precision alignment
        if (r.atom) {
          this.ops.atomRings = Math.min(p * 1.3, 1);
          this.ops.atomCrosshair = Math.min(p * 1.6, 1);

          const angle = p * Math.PI * 2;
          const radius = Math.min(r.atom.width, r.atom.height) * 0.35;
          ag3.setTarget(r.atom.cx + Math.cos(angle) * radius, r.atom.cy + Math.sin(angle) * radius, 16, 0.15);
          ag5.setTarget(r.atom.cx, r.atom.cy, 12, 0.1);
          ag5.clicking = p > 0.35 && p < 0.75;

          if (p > 0.4) {
            const atomEl = document.querySelector('.hero .hero-art');
            if (atomEl) atomEl.style.opacity = '1';
          }
        }

        // ag0 & ag4 reconstruct hero bottom (copy + aside)
        if (r.copy && r.aside) {
          const botP = Math.max(0, (elapsed - 1700) / 900);
          this.ops.bottomBoxes = Math.min(botP, 1);

          ag0.setTarget(r.copy.x + r.copy.width * Math.min(botP, 1), r.copy.y + r.copy.height, 14, 0.1);
          ag4.setTarget(r.aside.x + r.aside.width * Math.min(botP, 1), r.aside.y + r.aside.height, 14, 0.1);

          if (botP > 0.45) {
            const copyEl = document.querySelector('.hero .hero-copy');
            const asideEl = document.querySelector('.hero .hero-aside');
            if (copyEl) copyEl.style.opacity = '1';
            if (asideEl) asideEl.style.opacity = '1';
          }
        }

        // Reveal Site Header
        const headerEl = document.querySelector('.site-header');
        if (headerEl) headerEl.style.opacity = '1';
      }

      // --- STAGE 4: Verification & Fluid Exit (2600 - 3800ms) ---
      else {
        const p = (elapsed - 2600) / 1200;

        // Fade construction guides
        this.ops.guidesAlpha = Math.max(0, 1 - p * 2.2);

        // Cursors accelerate off screen to natural exit boundaries
        ag0.setTarget(-140, H * 0.2, 24, 0.08); // Exits left
        ag1.setTarget(W + 140, -80, 26, 0.08); // Exits top-right
        ag2.setTarget(W * 0.35, -140, 22, 0.08); // Exits top
        ag3.setTarget(W + 160, H * 0.45, 24, 0.08); // Exits right
        ag4.setTarget(W * 0.6, H + 140, 22, 0.08); // Exits bottom
        ag5.setTarget(-140, H * 0.8, 24, 0.08); // Exits bottom-left

        // At 40% of exit phase, fade out paper overlay & canvas
        if (p > 0.4) {
          if (this.overlay) this.overlay.classList.add('is-exiting');
          if (this.canvas) this.canvas.classList.add('is-exiting');
        }
      }

      // Update individual agent physics
      this.agents.forEach(ag => ag.update());
    }

    /**
     * Render Canvas Guides, Dimension Badges & Multiplayer Cursors
     */
    render() {
      const ctx = this.ctx;
      if (!ctx) return;

      ctx.save();
      ctx.scale(this.dpr, this.dpr);
      ctx.clearRect(0, 0, this.width, this.height);

      const r = this.rects;

      // 1. Subtle Alignment Rulers
      if (this.ops.guidesAlpha > 0.02) {
        ctx.save();
        ctx.globalAlpha = this.ops.guidesAlpha;
        ctx.strokeStyle = '#D8D8D1';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);

        if (r.eyebrow) {
          ctx.beginPath();
          ctx.moveTo(0, r.eyebrow.y);
          ctx.lineTo(this.width, r.eyebrow.y);
          ctx.stroke();
        }

        if (r.title) {
          ctx.beginPath();
          ctx.moveTo(r.title.x, 0);
          ctx.lineTo(r.title.x, this.height);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 2. Eyebrow Bounding Box
      if (this.ops.eyebrowBox > 0 && r.eyebrow) {
        this.drawBoundingBox(
          r.eyebrow.x - 6,
          r.eyebrow.y - 4,
          r.eyebrow.width + 12,
          r.eyebrow.height + 8,
          this.ops.eyebrowBox,
          '#F26A21',
          'STATUS · READY'
        );
      }

      // 3. Hero Title Bounding Box & Dimensions
      if (this.ops.titleBox > 0 && r.title) {
        this.drawBoundingBox(
          r.title.x - 8,
          r.title.y - 6,
          r.title.width + 16,
          r.title.height + 12,
          this.ops.titleBox,
          '#171717',
          `${Math.round(r.title.width)} × ${Math.round(r.title.height)}`
        );
      }

      // 4. Atom Orbits Alignment Calipers & Crosshairs
      if (this.ops.atomRings > 0 && r.atom) {
        this.drawAtomGuides(
          r.atom.cx,
          r.atom.cy,
          Math.min(r.atom.width, r.atom.height) * 0.42,
          this.ops.atomRings,
          this.ops.atomCrosshair,
          '#F26A21'
        );
      }

      // 5. Hero Bottom / Copy & Aside Bounding Guides
      if (this.ops.bottomBoxes > 0) {
        if (r.copy) {
          this.drawBoundingBox(
            r.copy.x - 6,
            r.copy.y - 4,
            r.copy.width + 12,
            r.copy.height + 8,
            this.ops.bottomBoxes,
            '#242424',
            'STATEMENT'
          );
        }
        if (r.aside) {
          this.drawBoundingBox(
            r.aside.x - 6,
            r.aside.y - 4,
            r.aside.width + 12,
            r.aside.height + 8,
            this.ops.bottomBoxes,
            '#F26A21',
            'GATEWAY'
          );
        }
      }

      // 6. Render Multiplayer Cursors
      this.agents.forEach(ag => ag.render(ctx));

      ctx.restore();
    }

    /**
     * Draw professional design-tool selection box with handles and dimension pill
     */
    drawBoundingBox(x, y, w, h, progress, color, label) {
      if (progress <= 0) return;
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.25;
      ctx.setLineDash([4, 4]);

      const curW = w * progress;
      const curH = h * progress;

      ctx.strokeRect(x, y, curW, curH);

      // Corner handles
      if (progress > 0.45) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
        const handles = [
          [x, y],
          [x + curW, y],
          [x, y + curH],
          [x + curW, y + curH]
        ];
        handles.forEach(([hx, hy]) => {
          ctx.fillRect(hx - 3, hy - 3, 6, 6);
          ctx.strokeRect(hx - 3, hy - 3, 6, 6);
        });
      }

      // Dimension Pill Badge
      if (progress > 0.65 && label) {
        ctx.setLineDash([]);
        ctx.font = '600 9px "DM Mono", monospace';
        const tw = ctx.measureText(label).width;
        const pw = tw + 10;
        const ph = 16;
        const px = x + curW / 2 - pw / 2;
        const py = y - ph - 4;

        ctx.fillStyle = color;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(px, py, pw, ph, 3);
        } else {
          ctx.rect(px, py, pw, ph);
        }
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, px + pw / 2, py + ph / 2);
      }

      ctx.restore();
    }

    /**
     * Draw circular alignment calipers and crosshairs for 3D atom
     */
    drawAtomGuides(cx, cy, radius, progressRings, progressCrosshair, color) {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.1;
      ctx.setLineDash([3, 4]);

      // Outer caliper circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius * progressRings, 0, Math.PI * 2);
      ctx.stroke();

      // Inner caliper circle
      if (progressRings > 0.4) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.48 * progressRings, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center crosshairs
      if (progressCrosshair > 0) {
        ctx.setLineDash([]);
        const crossLen = 18 * progressCrosshair;
        ctx.beginPath();
        ctx.moveTo(cx - crossLen, cy);
        ctx.lineTo(cx + crossLen, cy);
        ctx.moveTo(cx, cy - crossLen);
        ctx.lineTo(cx, cy + crossLen);
        ctx.stroke();

        // Coordinate tag
        ctx.font = '600 9px "DM Mono", monospace';
        const coord = `ATOM · R:${Math.round(radius)}px`;
        const tw = ctx.measureText(coord).width;
        const pw = tw + 8;
        const ph = 15;
        const px = cx + 8;
        const py = cy - 20;

        ctx.fillStyle = color;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(px, py, pw, ph, 3);
        } else {
          ctx.rect(px, py, pw, ph);
        }
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(coord, px + pw / 2, py + ph / 2);
      }

      ctx.restore();
    }

    /**
     * Complete the sequence, cleanup DOM and hand off to main portfolio engines
     */
    finish() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      this.isFinished = true;

      // Smoothly remove overlay and canvas
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
          this.overlay = null;
        }
        if (this.canvas && this.canvas.parentNode) {
          this.canvas.parentNode.removeChild(this.canvas);
          this.canvas = null;
        }

        // Unlock scroll
        document.body.style.overflow = '';

        // Ensure all hero elements are fully opaque with default styling
        const hero = document.querySelector('.hero');
        if (hero) {
          const els = hero.querySelectorAll('.eyebrow, .hero-title, .hero-copy, .hero-aside, .hero-art');
          els.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = '';
            el.style.transition = '';
          });
        }
        const siteHeader = document.querySelector('.site-header');
        if (siteHeader) {
          siteHeader.style.opacity = '1';
          siteHeader.style.transition = '';
        }

        // Handoff to main site engine (scroll assembly & smooth scroll)
        if (typeof this.onCompleteCallback === 'function') {
          this.onCompleteCallback();
        }
      }, 500);
    }
  }

  // Export Singleton
  const heroSwarm = new HeroSwarmController();
  window.HeroSwarm = heroSwarm;

})();
