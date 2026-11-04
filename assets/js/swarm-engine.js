/**
 * ============================================================================
 * SWARM VISUAL RECONSTRUCTION ENGINE
 * Autonomous multiplayer-style cursor swarm simulating collaborative design-tool
 * reconstruction (drawing boxes, dimension badges, typing carets & ruler guides).
 * Inspired by Joel Califa's Swarm & Dhvanil Patel's Swarm Cursors.
 *
 * Clean-room implementation in Vanilla JavaScript & HTML5 Canvas. Zero dependencies.
 * Colors: Charcoal #242424 · Burnt Orange #F26A21 · Paper #F5F4EF
 * ============================================================================
 */

(function () {
  'use strict';

  // --- 1. 2D Vector Physics Helper ---
  class Vec2 {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    set(x, y) { this.x = x; this.y = y; return this; }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    div(n) { if (n !== 0) { this.x /= n; this.y /= n; } return this; }
    mag() { return Math.hypot(this.x, this.y); }
    normalize() { const m = this.mag(); if (m !== 0) this.div(m); return this; }
    limit(max) { if (this.mag() > max) { this.normalize(); this.mult(max); } return this; }
    dist(v) { return Math.hypot(this.x - v.x, this.y - v.y); }
    copy() { return new Vec2(this.x, this.y); }
    static sub(v1, v2) { return new Vec2(v1.x - v2.x, v1.y - v2.y); }
  }

  // --- 2. Minimal Synthesized Web Audio Design (Zero External Files) ---
  class SoundSynthesizer {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined') {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620 + Math.random() * 80, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.045);
      } catch (_) {}
    }

    playSnap() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.075);
      } catch (_) {}
    }

    playChime() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      try {
        const freqs = [523.25, 659.25, 783.99]; // C - E - G chord
        freqs.forEach((f, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.04);
          gain.gain.setValueAtTime(0.035, this.ctx.currentTime + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.04 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.04);
          osc.stop(this.ctx.currentTime + i * 0.04 + 0.38);
        });
      } catch (_) {}
    }
  }

  // --- 3. Cursor Agent Profiles ---
  const AGENT_PROFILES = [
    { name: 'AKS', color: '#F26A21' },         // Lead / Orange
    { name: 'Kernel', color: '#242424' },      // Charcoal
    { name: 'Grid', color: '#00B4D8' },        // Cyan
    { name: 'Vector', color: '#7928CA' },      // Violet
    { name: 'Type', color: '#E67E22' },        // Amber
    { name: 'Layout', color: '#10B981' },      // Emerald
    { name: 'Audit', color: '#EF4444' },       // Crimson
    { name: 'Motion', color: '#3B82F6' },      // Blue
    { name: 'Logic', color: '#8B5CF6' },       // Purple
    { name: 'Asset', color: '#F59E0B' },       // Gold
    { name: 'Security', color: '#64748B' },    // Slate
    { name: 'DOM', color: '#06B6D4' }          // Teal
  ];

  // --- 4. Cursor Agent Class ---
  class CursorAgent {
    constructor(id, profile, origin) {
      this.id = id;
      this.name = profile.name;
      this.color = profile.color;
      this.pos = new Vec2(origin.x + (Math.random() - 0.5) * 40, origin.y + (Math.random() - 0.5) * 40);
      this.vel = new Vec2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
      this.acc = new Vec2();
      this.maxSpeed = 9 + Math.random() * 3;
      this.maxForce = 0.42;

      // State machine: 'ORBIT' | 'FLOCK' | 'APPROACH' | 'DRAW_BOX' | 'TYPE_TEXT' | 'IDLE'
      this.state = 'ORBIT';
      this.currentTask = null;
      this.taskStartPos = new Vec2();
      this.taskProgress = 0;
      this.orbitAngle = Math.random() * Math.PI * 2;
      this.orbitRadius = 50 + Math.random() * 70;
      this.orbitSpeed = 0.025 + Math.random() * 0.015;
    }

    applyForce(f) {
      this.acc.add(f);
    }

    seek(target, arriveDist = 120) {
      const desired = Vec2.sub(target, this.pos);
      const d = desired.mag();
      desired.normalize();
      if (d < arriveDist) {
        const m = (d / arriveDist) * this.maxSpeed;
        desired.mult(m);
      } else {
        desired.mult(this.maxSpeed);
      }
      const steer = Vec2.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }

    flock(agents) {
      // Reynolds Boids: Separation, Alignment, Cohesion
      let sep = new Vec2();
      let ali = new Vec2();
      let coh = new Vec2();
      let sepCount = 0;
      let flockCount = 0;

      for (let i = 0; i < agents.length; i++) {
        const other = agents[i];
        if (other === this) continue;
        const d = this.pos.dist(other.pos);

        // Separation (within 38px)
        if (d > 0 && d < 38) {
          const diff = Vec2.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(d);
          sep.add(diff);
          sepCount++;
        }

        // Alignment & Cohesion (within 90px)
        if (d > 0 && d < 90) {
          ali.add(other.vel);
          coh.add(other.pos);
          flockCount++;
        }
      }

      if (sepCount > 0) {
        sep.div(sepCount);
        sep.normalize();
        sep.mult(this.maxSpeed);
        sep.sub(this.vel);
        sep.limit(this.maxForce * 1.5);
      }

      if (flockCount > 0) {
        ali.div(flockCount);
        ali.normalize();
        ali.mult(this.maxSpeed);
        ali.sub(this.vel);
        ali.limit(this.maxForce);

        coh.div(flockCount);
        coh = this.seek(coh);
      }

      sep.mult(1.6);
      ali.mult(0.9);
      coh.mult(0.7);

      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
    }

    update(bounds, originPos, dt = 1) {
      if (this.state === 'ORBIT') {
        this.orbitAngle += this.orbitSpeed * dt;
        const targetX = originPos.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        const targetY = originPos.y + Math.sin(this.orbitAngle) * (this.orbitRadius * 0.65);
        const steer = this.seek(new Vec2(targetX, targetY), 60);
        this.applyForce(steer);
      } else if (this.state === 'APPROACH' && this.currentTask) {
        const target = this.currentTask.getStartPoint();
        const steer = this.seek(target, 80);
        this.applyForce(steer);

        if (this.pos.dist(target) < 14) {
          this.state = this.currentTask.type === 'TEXT' ? 'TYPE_TEXT' : 'DRAW_BOX';
          this.taskStartPos = this.pos.copy();
          this.taskProgress = 0;
        }
      } else if (this.state === 'DRAW_BOX' && this.currentTask) {
        // Linearly glide from start corner to diagonal corner
        this.taskProgress += 0.028 * dt;
        if (this.taskProgress >= 1) {
          this.taskProgress = 1;
          this.currentTask.complete();
          this.state = 'FLOCK';
          this.currentTask = null;
        } else {
          const start = this.currentTask.getStartPoint();
          const end = this.currentTask.getEndPoint();
          this.pos.x = start.x + (end.x - start.x) * this.taskProgress;
          this.pos.y = start.y + (end.y - start.y) * this.taskProgress;
          return; // Position driven directly during box drawing
        }
      } else if (this.state === 'TYPE_TEXT' && this.currentTask) {
        this.taskProgress += 0.035 * dt;
        if (this.taskProgress >= 1) {
          this.taskProgress = 1;
          this.currentTask.complete();
          this.state = 'FLOCK';
          this.currentTask = null;
        } else {
          const start = this.currentTask.getStartPoint();
          const end = this.currentTask.getEndPoint();
          this.pos.x = start.x + (end.x - start.x) * this.taskProgress;
          this.pos.y = start.y;
          return;
        }
      }

      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);

      // Soft viewport boundary bounce
      const margin = 20;
      if (this.pos.x < margin) { this.pos.x = margin; this.vel.x *= -0.7; }
      if (this.pos.x > bounds.width - margin) { this.pos.x = bounds.width - margin; this.vel.x *= -0.7; }
      if (this.pos.y < margin) { this.pos.y = margin; this.vel.y *= -0.7; }
      if (this.pos.y > bounds.height - margin) { this.pos.y = bounds.height - margin; this.vel.y *= -0.7; }
    }

    render(ctx) {
      const x = Math.round(this.pos.x);
      const y = Math.round(this.pos.y);

      // 1. Draw Active Selection Box & Dimension Badges
      if (this.state === 'DRAW_BOX' && this.currentTask) {
        const start = this.currentTask.getStartPoint();
        const boxW = x - start.x;
        const boxH = y - start.y;

        // Selection Box Rectangle
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.fillStyle = 'rgba(242, 106, 33, 0.06)';
        ctx.fillRect(start.x, start.y, boxW, boxH);
        ctx.strokeRect(start.x, start.y, boxW, boxH);
        ctx.restore();

        // Corner Resize Handles
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        const handleSize = 6;
        ctx.fillRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(start.x - handleSize / 2, start.y - handleSize / 2, handleSize, handleSize);

        // Floating Dimension Badge Pill (e.g., "380 × 240px")
        const badgeText = `${Math.abs(Math.round(boxW))} × ${Math.abs(Math.round(boxH))}px`;
        ctx.font = '500 10px "DM Mono", monospace';
        const badgeWidth = ctx.measureText(badgeText).width + 12;
        const badgeX = x + 10;
        const badgeY = y + 14;

        ctx.fillStyle = '#242424';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, 18, 4);
        ctx.fill();

        ctx.fillStyle = '#F26A21';
        ctx.fillText(badgeText, badgeX + 6, badgeY + 12.5);
      }

      // 2. Draw Figma-Style Cursor Arrow
      ctx.save();
      ctx.translate(x, y);

      // Subtle drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = this.color;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';

      // Figma Arrow Path: tip at (0,0)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 15);
      ctx.lineTo(4, 11);
      ctx.lineTo(7.5, 17);
      ctx.lineTo(10, 16);
      ctx.lineTo(6.5, 10);
      ctx.lineTo(11, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // 3. Draw Username Badge Pill
      const pillText = this.name;
      ctx.font = '600 10px "DM Mono", monospace';
      const textWidth = ctx.measureText(pillText).width;
      const pillW = textWidth + 12;
      const pillH = 16;
      const pillX = x + 12;
      const pillY = y + 14;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 8);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(pillText, pillX + 6, pillY + 11.5);
    }
  }

  // --- 5. Reconstruction Task Definition ---
  class RebuildTask {
    constructor(element, type = 'BOX', synth = null) {
      this.element = element;
      this.type = type;
      this.synth = synth;
      this.completed = false;
      this.inProgress = false;
    }

    getRect() {
      if (!this.element) return { x: 0, y: 0, w: 0, h: 0 };
      const r = this.element.getBoundingClientRect();
      return {
        x: r.left,
        y: r.top,
        w: r.width,
        h: r.height
      };
    }

    getStartPoint() {
      const r = this.getRect();
      return new Vec2(r.x, r.y);
    }

    getEndPoint() {
      const r = this.getRect();
      return new Vec2(r.x + r.w, r.y + r.h);
    }

    complete() {
      this.completed = true;
      this.inProgress = false;
      if (this.element) {
        this.element.classList.remove('is-reconstructing');
        this.element.style.opacity = '1';
        this.element.style.transform = '';
      }
      if (this.synth) {
        this.synth.playSnap();
      }
    }
  }

  // --- 6. Master Swarm Reconstruction Controller ---
  class SwarmController {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.btn = null;
      this.isActive = false;
      this.agents = [];
      this.tasks = [];
      this.synth = new SoundSynthesizer();
      this.rafId = null;
      this.lastTime = performance.now();
      this.bounds = { width: window.innerWidth, height: window.innerHeight };
      this.origin = new Vec2(window.innerWidth * 0.75, 180); // Default to Atom stage area
    }

    init() {
      this.canvas = document.getElementById('swarm-canvas');
      this.btn = document.getElementById('swarm-reconstruct-btn');

      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'swarm-canvas';
        this.canvas.className = 'swarm-canvas';
        this.canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(this.canvas);
      }

      this.ctx = this.canvas.getContext('2d');
      this.resize();

      window.addEventListener('resize', () => this.resize(), { passive: true });

      // Connect Header Button
      if (this.btn) {
        this.btn.addEventListener('click', () => this.toggle());
      }

      // Keyboard Shortcut: 'B' to toggle, 'Esc' to exit
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
          return;
        }
        if ((e.key === 'b' || e.key === 'B') && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this.toggle();
        } else if (e.key === 'Escape' && this.isActive) {
          e.preventDefault();
          this.stop();
        }
      });
    }

    resize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.bounds.width = window.innerWidth;
      this.bounds.height = window.innerHeight;

      this.canvas.width = Math.round(this.bounds.width * dpr);
      this.canvas.height = Math.round(this.bounds.height * dpr);
      this.canvas.style.width = `${this.bounds.width}px`;
      this.canvas.style.height = `${this.bounds.height}px`;

      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);
    }

    scanBlueprintTasks() {
      this.tasks = [];

      // Query prominent visual landmarks in viewport order
      const targetSelectors = [
        '.hero-title',
        '.hero-bottom',
        '.service-card',
        '.project-card',
        '.stack-feature',
        '.stack-group',
        '.about-statement',
        '.degree-hero-card',
        '.process-step',
        '.faq-layout',
        '.contact-main'
      ];

      const elements = document.querySelectorAll(targetSelectors.join(', '));
      elements.forEach((el) => {
        // Skip elements with 0 dimensions
        const r = el.getBoundingClientRect();
        if (r.width > 20 && r.height > 20) {
          const type = (el.classList.contains('hero-title') || el.classList.contains('hero-bottom')) ? 'TEXT' : 'BOX';
          this.tasks.push(new RebuildTask(el, type, this.synth));
        }
      });
    }

    spawnSwarm() {
      this.agents = [];
      const atomNucleus = document.querySelector('.atom-nucleus');
      if (atomNucleus) {
        const rect = atomNucleus.getBoundingClientRect();
        this.origin.set(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else {
        this.origin.set(window.innerWidth * 0.75, 180);
      }

      AGENT_PROFILES.forEach((profile, idx) => {
        const agent = new CursorAgent(idx, profile, this.origin);
        this.agents.push(agent);
      });
    }

    start() {
      if (this.isActive) return;
      this.isActive = true;
      this.resize();

      if (this.canvas) {
        this.canvas.classList.add('is-active');
      }
      if (this.btn) {
        this.btn.classList.add('is-active');
        const textSpan = this.btn.querySelector('.swarm-btn-text');
        if (textSpan) textSpan.textContent = 'Stop (Esc)';
      }

      this.spawnSwarm();
      this.scanBlueprintTasks();
      this.synth.init();
      this.synth.playChime();

      // Give tasks a wireframe blueprint feel during reconstruction
      this.tasks.forEach((t) => {
        if (t.element) {
          t.element.classList.add('is-reconstructing');
          t.element.style.opacity = '0.4';
        }
      });

      this.lastTime = performance.now();
      this.loop = (now) => {
        const dt = Math.min((now - this.lastTime) / 16.667, 2.5);
        this.lastTime = now;
        this.update(dt);
        this.render();
        if (this.isActive) {
          this.rafId = requestAnimationFrame(this.loop);
        }
      };
      this.rafId = requestAnimationFrame(this.loop);
    }

    stop() {
      if (!this.isActive) return;
      this.isActive = false;

      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }

      if (this.canvas) {
        this.canvas.classList.remove('is-active');
        this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);
      }

      if (this.btn) {
        this.btn.classList.remove('is-active');
        const textSpan = this.btn.querySelector('.swarm-btn-text');
        if (textSpan) textSpan.textContent = 'Reconstruct';
      }

      // Restore all elements to full fidelity
      this.tasks.forEach((t) => {
        if (t.element) {
          t.element.classList.remove('is-reconstructing');
          t.element.style.opacity = '';
          t.element.style.transform = '';
        }
      });

      this.agents = [];
      this.tasks = [];
    }

    toggle() {
      if (this.isActive) {
        this.stop();
      } else {
        this.start();
      }
    }

    update(dt) {
      // 1. Assign pending tasks to idle / orbiting / flocking agents
      const availableAgents = this.agents.filter(a => a.state === 'ORBIT' || a.state === 'FLOCK' || a.state === 'IDLE');
      const pendingTasks = this.tasks.filter(t => !t.completed && !t.inProgress);

      if (pendingTasks.length > 0 && availableAgents.length > 0) {
        // Find visible tasks in/near current viewport first
        const scrollY = window.scrollY || window.pageYOffset;
        const viewTop = 0;
        const viewBottom = this.bounds.height;

        pendingTasks.sort((a, b) => {
          const rA = a.getRect();
          const rB = b.getRect();
          const distA = Math.abs(rA.y - this.bounds.height * 0.35);
          const distB = Math.abs(rB.y - this.bounds.height * 0.35);
          return distA - distB;
        });

        const task = pendingTasks[0];
        // Assign closest available agent
        let bestAgent = availableAgents[0];
        let bestDist = Infinity;
        const targetPoint = task.getStartPoint();

        availableAgents.forEach((ag) => {
          const d = ag.pos.dist(targetPoint);
          if (d < bestDist) {
            bestDist = d;
            bestAgent = ag;
          }
        });

        task.inProgress = true;
        task.assignedAgent = bestAgent.id;
        bestAgent.state = 'APPROACH';
        bestAgent.currentTask = task;
        this.synth.playClick();
      }

      // 2. Update agent physics
      this.agents.forEach((agent) => {
        if (agent.state === 'FLOCK' || agent.state === 'IDLE') {
          agent.flock(this.agents);
        }
        agent.update(this.bounds, this.origin, dt);
      });

      // 3. Auto-finish if all tasks are complete
      const allDone = this.tasks.length > 0 && this.tasks.every(t => t.completed);
      if (allDone) {
        // Let cursors orbit celebratory for 1.8s then complete
        setTimeout(() => {
          if (this.isActive) this.stop();
        }, 1800);
      }
    }

    render() {
      this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);

      // Render Cursors & Selection Boxes
      this.agents.forEach(agent => agent.render(this.ctx));
    }
  }

  // --- 7. Export & Auto-Initialize on DOM Ready ---
  const swarm = new SwarmController();
  window.SwarmEngine = swarm;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => swarm.init());
  } else {
    swarm.init();
  }

})();
