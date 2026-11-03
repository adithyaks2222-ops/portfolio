/**

 * Adithya K S · Editorial Portfolio Client Script

 * Features:

 *  0. Premium Resource-Aware Full-Screen Loading Experience

 *  1. Dynamic Projects Showcase Population from projects.js

 *  2. Mobile Menu Toggle & Keyboard Accessibility

 *  3. Fully Reversible Two-Way GSAP ScrollTrigger Assembly & Reveal Engine

 *  4. Single-Open FAQ Accordion

 *  5. Active Navigation Link Highlighting & In-Page Scroll Spy

 *  6. Smooth Back-to-Top Navigation

 *  7. Dynamic Copyright Year

 *  8. 3D Curved Infinite Logo Marquee Engine

 *  9. Interactive About Headline Coordinated State

 * 10. Interactive Word Hover for Gray Typography

 */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================================================

  // 0. PREMIUM RESOURCE-AWARE LOADING EXPERIENCE

  // Real resource milestones: DOM Ready (30%) -> Fonts (65%) -> Images (85%) -> Load (100%)

  // ==========================================================================

  function initPreloader(onComplete) {

    const preloader = document.getElementById("site-preloader");

    if (!preloader) {

      if (typeof onComplete === "function") onComplete();

      return;

    }



    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

      preloader.classList.add("is-loaded");

      document.body.style.overflow = "";

      if (typeof onComplete === "function") onComplete();

      return;

    }



    document.body.style.overflow = "hidden";

    const progressBar = document.getElementById("preloader-progress-bar");

    const statusText = document.getElementById("preloader-status-text");

    const percentText = document.getElementById("preloader-percentage");



    let currentProgress = 0;

    let targetProgress = 20;

    let isComplete = false;

    const startTime = performance.now();



    function setTarget(pct, status) {

      targetProgress = Math.max(targetProgress, pct);

      if (status && statusText) {

        statusText.textContent = status;

      }

    }



    // Smooth RAF progress animator

    function updateProgress() {

      if (currentProgress < targetProgress) {

        const step = (targetProgress - currentProgress) * 0.14;

        currentProgress += Math.max(step, 0.45);

        if (currentProgress > targetProgress) currentProgress = targetProgress;

      }



      const displayPct = Math.min(100, Math.floor(currentProgress));

      if (progressBar) progressBar.style.width = `${displayPct}%`;

      if (percentText) percentText.textContent = `${displayPct}%`;



      if (displayPct >= 100 && !isComplete) {

        isComplete = true;

        finishPreloader();

        return;

      }



      if (!isComplete) {

        requestAnimationFrame(updateProgress);

      }

    }



    function finishPreloader() {

      if (statusText) statusText.textContent = "READY";

      if (percentText) percentText.textContent = "100%";

      if (progressBar) progressBar.style.width = "100%";



      // Graceful exit transition

      setTimeout(() => {
        preloader.classList.add("is-loaded");
        preloader.style.pointerEvents = "none";
        preloader.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }

        if (typeof onComplete === "function") {
          onComplete();
        }

        setTimeout(() => {
          preloader.style.display = "none";
        }, 800);
      }, 350);

    }



    requestAnimationFrame(updateProgress);



    // Milestone 1: DOM Ready (30%)

    setTarget(30, "INITIALIZING LAYOUT");



    // Milestone 2: Critical Web Fonts Loaded (65%)

    if (document.fonts && document.fonts.ready) {

      document.fonts.ready.then(() => {

        setTarget(65, "TYPEFACES LOADED");

      }).catch(() => {

        setTarget(65, "ASSETS PREPARED");

      });

    } else {

      setTimeout(() => setTarget(65, "TYPEFACES LOADED"), 250);

    }



    // Milestone 3: Critical Foreground Photograph Loaded (85%)

    const criticalImg = new Image();

    const isSubpage = window.location.pathname.includes("/pages/");

    criticalImg.src = isSubpage ? "../assets/images/adithya.png" : "assets/images/adithya.png";

    if (criticalImg.complete) {

      setTarget(85, "MEDIA PREPARED");

    } else {

      criticalImg.onload = () => setTarget(85, "MEDIA PREPARED");

      criticalImg.onerror = () => setTarget(85, "MEDIA READY");

    }



    // Milestone 4: Full Window Load (100%)

    if (document.readyState === "complete") {

      const elapsed = performance.now() - startTime;

      const delay = Math.max(400 - elapsed, 50);

      setTimeout(() => setTarget(100, "READY"), delay);

    } else {

      window.addEventListener("load", () => {

        const elapsed = performance.now() - startTime;

        const delay = Math.max(450 - elapsed, 50);

        setTimeout(() => setTarget(100, "READY"), delay);

      });

    }



    // Safeguard Fallback Timeout: never block user longer than 2.2 seconds

    setTimeout(() => {

      setTarget(100, "READY");

    }, 2200);

  }



  // 1. Dynamic Projects Showcase Population from projects.js

  if (typeof renderProjectShowcase === "function") {

    const isSubpage = window.location.pathname.includes("/pages/");

    const prefix = isSubpage ? "../" : "";

    renderProjectShowcase("projects-showcase-container", prefix);

  }



// ==========================================================================
  // SIGNATURE INTERACTION: SOPHISTICATED LIQUID CURSOR NAVIGATION
  // Liquid drop follows pointer inside navbar, stretches, absorbs hovered links,
  // fills with solid charcoal (#242424), and contracts smoothly upon exit.
  // ==========================================================================
  function initNavLiquidCursor() {
    if (typeof gsap === "undefined") return;
    const nav = document.querySelector(".main-nav");
    if (!nav) return;

    // Respect touch devices and reduced-motion preferences
    if (window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Ensure single shared liquid indicator exists inside nav
    let pill = nav.querySelector(".nav-liquid-pill");
    if (!pill) {
      pill = document.createElement("div");
      pill.className = "nav-liquid-pill";
      pill.setAttribute("aria-hidden", "true");
      nav.appendChild(pill);
    }

    const navLinks = Array.from(nav.querySelectorAll("a"));
    if (!navLinks.length) return;

    let isInsideNav = false;
    let activeTarget = null;

    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;

    // Pointer enters navigation container: drop appears
    nav.addEventListener("pointerenter", (e) => {
      isInsideNav = true;
      const navRect = nav.getBoundingClientRect();
      mouseX = e.clientX - navRect.left;
      mouseY = e.clientY - navRect.top;
      lastX = mouseX;
      lastY = mouseY;

      if (!activeTarget) {
        gsap.killTweensOf(pill);
        gsap.set(pill, {
          x: mouseX,
          y: mouseY,
          width: 14,
          height: 14,
          borderRadius: "50%",
          scale: 0.3,
          rotation: 0
        });
        gsap.to(pill, {
          opacity: 1,
          scale: 1,
          duration: 0.22,
          ease: "power2.out"
        });
      }
    });

    // Pointer moves inside nav container
    nav.addEventListener("pointermove", (e) => {
      if (!isInsideNav) return;
      const navRect = nav.getBoundingClientRect();
      const currentX = e.clientX - navRect.left;
      const currentY = e.clientY - navRect.top;

      const vx = currentX - lastX;
      const vy = currentY - lastY;
      lastX = currentX;
      lastY = currentY;
      mouseX = currentX;
      mouseY = currentY;

      // Free-floating droplet state (in whitespace between links)
      if (!activeTarget) {
        const speed = Math.hypot(vx, vy);
        const stretch = Math.min(1.4, 1 + speed * 0.03);
        const squeeze = 1 / Math.sqrt(stretch);
        const angle = Math.atan2(vy, vx) * (180 / Math.PI);

        gsap.to(pill, {
          x: mouseX,
          y: mouseY,
          width: 14,
          height: 14,
          borderRadius: "50%",
          scaleX: stretch,
          scaleY: squeeze,
          rotation: angle,
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });

    // Pointer leaves nav container
    nav.addEventListener("pointerleave", () => {
      isInsideNav = false;
      activeTarget = null;
      navLinks.forEach((link) => link.classList.remove("is-hovered"));

      gsap.killTweensOf(pill);
      gsap.to(pill, {
        opacity: 0,
        scale: 0.1,
        duration: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(pill, {
            width: 14,
            height: 14,
            borderRadius: "50%",
            scale: 0,
            opacity: 0,
            rotation: 0
          });
        }
      });
    });

    // Liquid attraction to navigation items
    function lockToLink(link) {
      activeTarget = link;
      navLinks.forEach((l) => {
        if (l !== link) l.classList.remove("is-hovered");
      });
      link.classList.add("is-hovered");

      const targetX = link.offsetLeft + link.offsetWidth * 0.5;
      const targetY = link.offsetTop + link.offsetHeight * 0.5;
      const targetW = link.offsetWidth + 6;
      const targetH = link.offsetHeight + 4;

      gsap.killTweensOf(pill);
      gsap.to(pill, {
        x: targetX,
        y: targetY,
        width: targetW,
        height: targetH,
        borderRadius: "8px",
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.28,
        ease: "power3.out",
        overwrite: "auto"
      });
    }

    // Exit from navigation item: contract back to liquid droplet
    function unlockFromLink(link) {
      if (activeTarget === link) {
        activeTarget = null;
        link.classList.remove("is-hovered");

        if (isInsideNav) {
          gsap.killTweensOf(pill);
          gsap.to(pill, {
            x: mouseX,
            y: mouseY,
            width: 14,
            height: 14,
            borderRadius: "50%",
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.28,
            ease: "back.out(1.5)",
            overwrite: "auto"
          });
        }
      }
    }

    // Bind link interactions
    navLinks.forEach((link) => {
      link.addEventListener("pointerenter", () => {
        isInsideNav = true;
        lockToLink(link);
      });

      link.addEventListener("pointerleave", () => {
        unlockFromLink(link);
      });

      link.addEventListener("focus", () => {
        isInsideNav = true;
        lockToLink(link);
      });

      link.addEventListener("blur", () => {
        unlockFromLink(link);
      });
    });
  }

  initNavLiquidCursor();

  // ==========================================================================
  // PREMIUM LIQUID SMOOTH SCROLLING ENGINE
  // Natural momentum LERP scroller with precision trackpad detection,
  // 60/120 FPS requestAnimationFrame synchronization, GSAP ScrollTrigger
  // integration, silk-smooth anchor glides, and 100% native mobile touch passthrough.
  // ==========================================================================
  function initLiquidSmoothScroll() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.config({ limitCallbacks: true });
    }

    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    // Smooth anchor navigation (desktop & mobile)
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;

      if (href === "#top" || href === "#") {
        e.preventDefault();
        smoothGlideTo(0);
        return;
      }

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = 75;
        const rect = targetEl.getBoundingClientRect();
        const destY = Math.max(0, rect.top + window.scrollY - headerHeight);
        smoothGlideTo(destY);

        if (history.pushState) {
          history.pushState(null, "", href);
        }
      }
    });

    let currentY = window.scrollY || window.pageYOffset;
    let targetY = currentY;
    let isGliding = false;
    let isRunning = false;
    let ease = 0.088;
    let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const updateMax = () => {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };

    window.addEventListener("resize", updateMax, { passive: true });

    function smoothGlideTo(destY) {
      updateMax();
      destY = Math.max(0, Math.min(maxScroll, destY));
      isGliding = true;
      targetY = destY;

      if (typeof gsap !== "undefined") {
        const dummy = { y: window.scrollY || window.pageYOffset };
        gsap.to(dummy, {
          y: destY,
          duration: 1.1,
          ease: "power3.inOut",
          onUpdate: () => {
            currentY = dummy.y;
            targetY = dummy.y;
            window.scrollTo(0, currentY);
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
          },
          onComplete: () => {
            isGliding = false;
            currentY = destY;
            targetY = destY;
            window.scrollTo(0, destY);
            if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
          }
        });
      } else {
        window.scrollTo({ top: destY, behavior: "smooth" });
        isGliding = false;
      }
    }

    // On touch screens or reduced motion, preserve native 120Hz touch physics completely
    if (isTouch || prefersReducedMotion) {
      return;
    }

    const onWheel = (e) => {
      // Do not hijack scroll inside overflowed elements (e.g. pre, code, modals)
      let el = e.target;
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.scrollHeight > el.clientHeight) {
          const overflowY = window.getComputedStyle(el).overflowY;
          if (overflowY === "auto" || overflowY === "scroll") return;
        }
        el = el.parentElement;
      }

      e.preventDefault();
      updateMax();

      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 36;
      else if (e.deltaMode === 2) deltaY *= window.innerHeight;

      // Detect precision trackpads vs mouse wheel notches
      const isTrackpad = Math.abs(deltaY) < 38 && Math.abs(deltaY) % 1 !== 0;

      if (isTrackpad) {
        // Direct 1:1 responsive feel for trackpad gestures
        targetY = Math.max(0, Math.min(maxScroll, targetY + deltaY * 1.05));
        ease = 0.22;
      } else {
        // Silky fluid acceleration & deceleration for mouse wheels
        targetY = Math.max(0, Math.min(maxScroll, targetY + deltaY * 0.92));
        ease = 0.088;
      }

      if (!isRunning && !isGliding) {
        isRunning = true;
        requestAnimationFrame(tick);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    // Sync target with native scroll events (scrollbar drag, page keys)
    window.addEventListener("scroll", () => {
      if (!isRunning && !isGliding) {
        currentY = window.scrollY || window.pageYOffset;
        targetY = currentY;
      }
    }, { passive: true });

    function tick() {
      if (isGliding) {
        isRunning = false;
        return;
      }

      const diff = targetY - currentY;

      if (Math.abs(diff) > 0.4) {
        currentY += diff * ease;
        window.scrollTo(0, currentY);
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.update();
        }
        requestAnimationFrame(tick);
      } else {
        currentY = targetY;
        window.scrollTo(0, targetY);
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.update();
        }
        isRunning = false;
      }
    }
  }

  initLiquidSmoothScroll();


    // 2. Mobile Menu Toggle

  const menuButton = document.querySelector(".menu-toggle");

  const nav = document.querySelector(".main-nav");



  if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

      const isOpen = nav.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));

    });



    nav.querySelectorAll("a").forEach((link) => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");

      });

    });



    document.addEventListener("keydown", (e) => {

      if (e.key === "Escape" && nav.classList.contains("open")) {

        nav.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");

      }

    });



    document.addEventListener("click", (e) => {

      if (!nav.contains(e.target) && !menuButton.contains(e.target) && nav.classList.contains("open")) {

        nav.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");

      }

    });

  }

  // 2b. Atom Nucleus Interactive LinkedIn Gateway
  const atomNucleus = document.querySelector(".atom-nucleus");
  if (atomNucleus) {
    const linkedInUrl = "https://www.linkedin.com/in/adithya-k-s-03a20i06/";
    atomNucleus.setAttribute("href", linkedInUrl);
    atomNucleus.setAttribute("target", "_blank");
    atomNucleus.setAttribute("rel", "noopener noreferrer");

    atomNucleus.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.open(linkedInUrl, "_blank", "noopener,noreferrer");
      }
    });
  }



  // ==========================================================================

  // 3. GSAP SCROLLTRIGGER ASSEMBLY & REVERSIBLE SCROLL-BACK ENGINE

  // Two-way reversible transitions: elements reveal on entrance and smoothly

  // re-enter when scrolling upward. No stuck states, no permanently hidden text.

  // ==========================================================================

  function initScrollAssembly() {

    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {

      document.querySelectorAll(".reveal").forEach((element) => {

        element.classList.add("is-visible");

      });

      return;

    }



    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

      document.querySelectorAll(".reveal").forEach((element) => {

        element.classList.add("is-visible");

      });

      return;

    }



    gsap.registerPlugin(ScrollTrigger);

    document.documentElement.classList.add("gsap-active");



    const isMobile = window.innerWidth <= 640;

    const isTablet = window.innerWidth <= 900 && !isMobile;

    const xMult = isMobile ? 0.45 : (isTablet ? 0.72 : 1.0);

    const rotMult = isMobile ? 0.35 : (isTablet ? 0.65 : 1.0);



    // Initial Hero Entrance Sequence (triggered once loading completes)

    function playHeroEntrance() {

      const hero = document.querySelector(".hero");

      if (!hero) return;



      const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });

      const siteHeader = document.querySelector(".site-header");

      const eyebrow = hero.querySelector(".eyebrow");

      const title = hero.querySelector(".hero-title");

      const copy = hero.querySelector(".hero-copy");

      const aside = hero.querySelector(".hero-aside");

      const textLink = hero.querySelector(".text-link");

      const heroArt = hero.querySelector(".hero-art");



      if (siteHeader) heroTl.fromTo(siteHeader, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7 }, 0);

      if (eyebrow) heroTl.fromTo(eyebrow, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.12);

      if (title) heroTl.fromTo(title, { opacity: 0, y: 35, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" }, 0.22);

      if (copy) heroTl.fromTo(copy, { opacity: 0, x: -30 * xMult, y: 15 }, { opacity: 1, x: 0, y: 0, duration: 0.8 }, 0.35);

      if (aside) heroTl.fromTo(aside, { opacity: 0, x: 30 * xMult, y: 15 }, { opacity: 1, x: 0, y: 0, duration: 0.8 }, 0.42);

      if (textLink) heroTl.fromTo(textLink, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }, 0.52);

      if (heroArt) heroTl.fromTo(heroArt, { opacity: 0, scale: 0.86, rotation: -8 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.1, ease: "power2.out" }, 0.3);



      // Reversible Hero Exit / Re-entry when scrolling

      gsap.fromTo(".hero-title, .hero-bottom",

        { y: 0, opacity: 1 },

        {

          y: -40,

          opacity: 0.2,

          ease: "power1.out",

          scrollTrigger: {

            trigger: hero,

            start: "top top",

            end: "bottom 20%",

            scrub: 0.6,

          }

        }

      );



      if (heroArt) {

        gsap.fromTo(heroArt,

          { y: 0, opacity: 1, scale: 1 },

          {

            y: -60,

            scale: 0.9,

            opacity: 0.2,

            ease: "power1.out",

            scrollTrigger: {

              trigger: hero,

              start: "top top",

              end: "bottom 20%",

              scrub: 0.6,

            }

          }

        );

      }

    }



    // 2. Ticker Entrance (Reversible)

    const ticker = document.querySelector(".ticker");

    if (ticker) {

      gsap.fromTo(ticker,

        { opacity: 0.3, scaleY: 0.95 },

        {

          opacity: 1,

          scaleY: 1,

          duration: 0.7,

          ease: "power2.out",

          scrollTrigger: {

            trigger: ticker,

            start: "top 95%",

            end: "bottom 15%",

            toggleActions: "play none none reverse",

          }

        }

      );

    }



    // 3. Subpage Header Entrance (if on subpages)

    const subpageHeader = document.querySelector(".subpage-header, .subpage-hero");

    if (subpageHeader) {

      const subTl = gsap.timeline({ defaults: { ease: "power2.out" } });

      const kicker = subpageHeader.querySelector(".section-kicker, .eyebrow");

      const title = subpageHeader.querySelector(".subpage-title");

      const intro = subpageHeader.querySelector(".subpage-intro");

      if (kicker) subTl.fromTo(kicker, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);

      if (title) subTl.fromTo(title, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2);

      if (intro) subTl.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3);

    }



    // 4. Section Heading Glides (Two-Way Reversible: reveals on scroll down & re-enters on scroll up)

    document.querySelectorAll("section:not(.hero)").forEach((sec) => {

      const kicker = sec.querySelector(".section-kicker");

      const heading = sec.querySelector(".section-heading-row h2, .curved-marquee-header h2");

      const intro = sec.querySelector(".section-heading-row .section-intro, .curved-marquee-header .section-intro");



      if (heading || intro) {

        const secHeadTl = gsap.timeline({

          scrollTrigger: {

            trigger: sec,

            start: "top 88%",

            end: "bottom 15%",

            toggleActions: "play none none reverse",

          }

        });



        if (kicker) secHeadTl.fromTo(kicker, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);

        if (heading) secHeadTl.fromTo(heading, { opacity: 0, x: -35 * xMult }, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, 0.05);

        if (intro) secHeadTl.fromTo(intro, { opacity: 0, x: 35 * xMult }, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, 0.1);

      }

    });



    // 5. 3D Curved Logo Marquee Stage Entrance & Liquid Parallax Depth

    const marqueeViewport = document.querySelector(".curved-marquee-viewport");

    if (marqueeViewport) {

      gsap.fromTo(marqueeViewport,

        { scale: 0.96, opacity: 0.5 },

        {

          scale: 1,

          opacity: 1,

          duration: 0.9,

          ease: "power2.out",

          scrollTrigger: {

            trigger: "#perspective-experience",

            start: "top 85%",

            end: "bottom 15%",

            toggleActions: "play none none reverse",

          }

        }

      );

      // Subtle liquid parallax depth on central portrait cutout
      const stageCutout = marqueeViewport.querySelector(".stage-cutout");
      if (stageCutout) {
        gsap.to(stageCutout, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: "#perspective-experience",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.0,
          }
        });
      }

    }



    // 6. What I Do / Services (4 Cards assembling from 4 directions, reversible)

    const serviceCards = document.querySelectorAll(".services .service-card, #what-i-do .service-card");

    if (serviceCards.length >= 4) {

      const servicesTl = gsap.timeline({

        scrollTrigger: {

          trigger: ".service-grid",

          start: "top 85%",

          end: "bottom 15%",

          toggleActions: "play none none reverse",

        }

      });



      // Card 1: Left & Bottom

      servicesTl.fromTo(serviceCards[0],

        { x: -65 * xMult, y: 30, rotation: -2.2 * rotMult, scale: 0.92, opacity: 0 },

        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

        0

      );



      // Card 2: Top & Left

      servicesTl.fromTo(serviceCards[1],

        { x: -15 * xMult, y: -40, rotation: 1.4 * rotMult, scale: 0.93, opacity: 0 },

        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

        0.08

      );



      // Card 3: Bottom & Right

      servicesTl.fromTo(serviceCards[2],

        { x: 15 * xMult, y: 45, rotation: -1.4 * rotMult, scale: 0.93, opacity: 0 },

        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

        0.16

      );



      // Card 4: Right & Bottom

      servicesTl.fromTo(serviceCards[3],

        { x: 65 * xMult, y: 30, rotation: 2.2 * rotMult, scale: 0.92, opacity: 0 },

        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

        0.24

      );

    }



    // 7. Selected Work / Bento Grid Assembly (Reversible)

    const projectCards = document.querySelectorAll(".project-list .project-card");

    if (projectCards.length > 0) {

      // Cluster 1: Cards 1, 2, 3 (CAPX, PhishEye, JARVX)
      const cluster1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".project-list",
          start: "top 85%",
          once: true,
        },
        onComplete: () => {
          gsap.set([projectCards[0], projectCards[1], projectCards[2]], { clearProps: "transform,opacity" });
        }
      });



      if (projectCards[0]) {

        cluster1.fromTo(projectCards[0],

          { x: -75 * xMult, y: 40, rotation: -1.8 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.95, ease: "power2.out" },

          0

        );

      }

      if (projectCards[1]) {

        cluster1.fromTo(projectCards[1],

          { x: 70 * xMult, y: -35, rotation: 1.8 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0.1

        );

      }

      if (projectCards[2]) {

        cluster1.fromTo(projectCards[2],

          { x: 70 * xMult, y: 45, rotation: -1.4 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0.2

        );

      }



      // Cluster 2: Cards 4, 5, 6 (CodeBurner, StarkForge, GeoTagger)

      if (projectCards.length > 3) {

        const cluster2 = gsap.timeline({
          scrollTrigger: {
            trigger: projectCards[3],
            start: "top 85%",
            once: true,
          },
          onComplete: () => {
            gsap.set([projectCards[3], projectCards[4], projectCards[5]], { clearProps: "transform,opacity" });
          }
        });



        cluster2.fromTo(projectCards[3],

          { x: -70 * xMult, y: 40, rotation: 1.5 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.95, ease: "power2.out" },

          0

        );

        if (projectCards[4]) {

          cluster2.fromTo(projectCards[4],

            { x: 65 * xMult, y: -30, rotation: -1.5 * rotMult, scale: 0.93, opacity: 0 },

            { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

            0.1

          );

        }

        if (projectCards[5]) {

          cluster2.fromTo(projectCards[5],

            { x: 65 * xMult, y: 40, rotation: 1.2 * rotMult, scale: 0.93, opacity: 0 },

            { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

            0.2

          );

        }

      }



      // All-Work CTA button

      const allWorkLink = document.querySelector(".all-work-link");

      if (allWorkLink) {

        gsap.fromTo(allWorkLink,

          { opacity: 0, y: 25 },

          {

            opacity: 1,

            y: 0,

            duration: 0.6,

            ease: "power2.out",

            scrollTrigger: {

              trigger: allWorkLink,

              start: "top 92%",

              end: "bottom 10%",

              toggleActions: "play none none reverse",

            }

          }

        );

      }

    }



    // 8. Stack & Tools Section (Left monolithic card + Right staggered groups, reversible)

    const stackLayout = document.querySelector(".stack-layout");

    if (stackLayout) {

      const stackTl = gsap.timeline({

        scrollTrigger: {

          trigger: stackLayout,

          start: "top 85%",

          end: "bottom 15%",

          toggleActions: "play none none reverse",

        }

      });



      const stackFeature = stackLayout.querySelector(".stack-feature");

      if (stackFeature) {

        stackTl.fromTo(stackFeature,

          { x: -70 * xMult, y: 35, rotation: -1.8 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.95, ease: "power2.out" },

          0

        );

      }



      const stackGroups = stackLayout.querySelectorAll(".stack-group");

      stackGroups.forEach((group, idx) => {

        stackTl.fromTo(group,

          { x: 55 * xMult, y: 20, rotation: 1 * rotMult, opacity: 0 },

          { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.65, ease: "power2.out" },

          0.1 + idx * 0.08

        );

      });



      const stackNote = stackLayout.querySelector(".stack-note");

      if (stackNote) {

        stackTl.fromTo(stackNote,

          { y: 20, opacity: 0 },

          { y: 0, opacity: 1, duration: 0.5, ease: "power1.out" },

          0.5

        );

      }

    }



    // 9. About Me Section (Statement left, copy & facts right, reversible)

    const aboutLayout = document.querySelector(".about-layout");

    if (aboutLayout) {

      const aboutTl = gsap.timeline({

        scrollTrigger: {

          trigger: aboutLayout,

          start: "top 85%",

          end: "bottom 15%",

          toggleActions: "play none none reverse",

        }

      });



      const statement = aboutLayout.querySelector(".about-statement");

      if (statement) {

        aboutTl.fromTo(statement,

          { x: -65 * xMult, y: 30, rotation: -1.5 * rotMult, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.95, ease: "power2.out" },

          0

        );

      }



      const leadCopy = aboutLayout.querySelectorAll(".about-lead, .about-rotaract, .about-copy p");

      if (leadCopy.length) {

        aboutTl.fromTo(leadCopy,

          { x: 55 * xMult, y: 18, opacity: 0 },

          { x: 0, y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power2.out" },

          0.1

        );

      }



      const facts = aboutLayout.querySelectorAll(".about-facts > div");

      facts.forEach((fact, idx) => {

        const xDir = idx % 2 === 0 ? -25 * xMult : 25 * xMult;

        aboutTl.fromTo(fact,

          { x: xDir, y: 30, scale: 0.94, opacity: 0 },

          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.65, ease: "power2.out" },

          0.25 + idx * 0.08

        );

      });

    }



// 9.1 Academic Pathway & Curriculum Grid (Two-way reversible assembly)
    const academicWrap = document.querySelector(".about-academic-wrap");
    if (academicWrap) {
      const acadTl = gsap.timeline({
        scrollTrigger: {
          trigger: academicWrap,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        }
      });

      const acadHeading = academicWrap.querySelector(".academic-subhead-row");
      if (acadHeading) {
        acadTl.fromTo(acadHeading,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          0
        );
      }

      const degreeCard = academicWrap.querySelector(".degree-hero-card");
      if (degreeCard) {
        acadTl.fromTo(degreeCard,
          { y: 30, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },
          0.1
        );
      }

      const currCards = academicWrap.querySelectorAll(".curriculum-card");
      currCards.forEach((cCard, cIdx) => {
        const xOffset = cIdx % 3 === 0 ? -30 : (cIdx % 3 === 2 ? 30 : 0);
        acadTl.fromTo(cCard,
          { x: xOffset * xMult, y: 35, scale: 0.94, opacity: 0 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" },
          0.2 + cIdx * 0.07
        );
      });
    }

    // 10. Process Section (4 steps assembling from 4 directions, reversible)

    const processGrid = document.querySelector(".process-grid");

    if (processGrid) {

      const processSteps = processGrid.querySelectorAll(".process-step");

      if (processSteps.length >= 4) {

        const processTl = gsap.timeline({

          scrollTrigger: {

            trigger: processGrid,

            start: "top 85%",

            end: "bottom 15%",

            toggleActions: "play none none reverse",

          }

        });



        // Step 1: Left

        processTl.fromTo(processSteps[0],

          { x: -60 * xMult, y: 25, rotation: -1.8 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0

        );



        // Step 2: Top

        processTl.fromTo(processSteps[1],

          { x: -12 * xMult, y: -35, rotation: 1 * rotMult, scale: 0.94, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0.08

        );



        // Step 3: Bottom

        processTl.fromTo(processSteps[2],

          { x: 12 * xMult, y: 40, rotation: -1 * rotMult, scale: 0.94, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0.16

        );



        // Step 4: Right

        processTl.fromTo(processSteps[3],

          { x: 60 * xMult, y: 25, rotation: 1.8 * rotMult, scale: 0.93, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0.24

        );

      }

    }



    // Credentials row in Process section (Reversible)

    const credentialsRow = document.querySelector(".credentials-row");

    if (credentialsRow) {

      const boxes = credentialsRow.querySelectorAll(".credential-box");

      if (boxes.length >= 2) {

        const credTl = gsap.timeline({

          scrollTrigger: {

            trigger: credentialsRow,

            start: "top 88%",

            end: "bottom 15%",

            toggleActions: "play none none reverse",

          }

        });



        credTl.fromTo(boxes[0],

          { x: -50 * xMult, y: 30, rotation: -1.2 * rotMult, scale: 0.94, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0

        );



        credTl.fromTo(boxes[1],

          { x: 50 * xMult, y: 30, rotation: 1.2 * rotMult, scale: 0.94, opacity: 0 },

          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },

          0.1

        );

      }

    }



    // 11. FAQ Section (Left title + Right staggered accordion questions, reversible)

    const faqLayout = document.querySelector(".faq-layout");

    if (faqLayout) {

      const faqTl = gsap.timeline({

        scrollTrigger: {

          trigger: faqLayout,

          start: "top 85%",

          end: "bottom 15%",

          toggleActions: "play none none reverse",

        }

      });



      const faqHeading = faqLayout.children[0];

      if (faqHeading) {

        faqTl.fromTo(faqHeading,

          { x: -45 * xMult, y: 20, opacity: 0 },

          { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },

          0

        );

      }



      const faqItems = faqLayout.querySelectorAll(".faq-list details");

      faqItems.forEach((item, idx) => {

        faqTl.fromTo(item,

          { x: 50 * xMult, y: 18, opacity: 0 },

          { x: 0, y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },

          0.1 + idx * 0.08

        );

      });

    }



    // 12. Contact Section (Main block + Bottom footer details, reversible)

    const contactSection = document.querySelector(".contact-section");

    if (contactSection) {

      const contactTl = gsap.timeline({

        scrollTrigger: {

          trigger: contactSection,

          start: "top 85%",

          end: "bottom 15%",

          toggleActions: "play none none reverse",

        }

      });



      const contactMain = contactSection.querySelector(".contact-main");

      if (contactMain) {

        contactTl.fromTo(contactMain,

          { y: 40, scale: 0.96, opacity: 0 },

          { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: "power2.out" },

          0

        );

      }



      const contactBottom = contactSection.querySelector(".contact-bottom");

      if (contactBottom) {

        contactTl.fromTo(contactBottom,

          { y: 30, opacity: 0 },

          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },

          0.2

        );

      }

    }



    // 13. Site Footer Scroll Scrub

    const siteFooter = document.querySelector(".site-footer");

    if (siteFooter) {

      gsap.fromTo(siteFooter,

        { opacity: 0, y: 20 },

        {

          opacity: 1,

          y: 0,

          duration: 0.6,

          ease: "power1.out",

          scrollTrigger: {

            trigger: siteFooter,

            start: "top 96%",

            end: "bottom bottom",

            toggleActions: "play none none reverse",

          }

        }

      );

    }







    // 15. Stack feature monolith liquid undercurrent fill

    const stackFeatureEl = document.querySelector(".stack-feature");

    if (stackFeatureEl && !stackFeatureEl.querySelector(".stack-liquid-fill")) {

      const liquidFill = document.createElement("div");

      liquidFill.className = "stack-liquid-fill";

      stackFeatureEl.prepend(liquidFill);

      gsap.fromTo(liquidFill, { scaleY: 0 }, {

        scaleY: 1,

        ease: "none",

        scrollTrigger: {

          trigger: stackFeatureEl,

          start: "top 85%",

          end: "bottom 65%",

          scrub: 0.8,

        }

      });

    }







    // Start hero entrance when preloader completes

    playHeroEntrance();



    // Recalculate coordinates once all assets have completely settled

    window.addEventListener("load", () => {

      ScrollTrigger.refresh();

    });

    if (document.fonts && document.fonts.ready) {

      document.fonts.ready.then(() => {

        ScrollTrigger.refresh();

      });

    }

  }



  // Kick off Preloader and connect to Scroll Assembly

  initPreloader(() => {

    initScrollAssembly();

  });



  // 4. FAQ Single-Open Accordion

  const questions = document.querySelectorAll(".faq-list details");

  questions.forEach((item) => {

    item.addEventListener("toggle", () => {

      if (item.open) {

        questions.forEach((other) => {

          if (other !== item) other.open = false;

        });

      }

    });

  });



  // 5. Active Navigation Link Highlighting

  const navLinks = document.querySelectorAll(".main-nav a");

  const currentPath = window.location.pathname.split("/").pop() || "index.html";



  let pageMatched = false;

  navLinks.forEach((link) => {

    const href = link.getAttribute("href") || "";

    const targetFile = href.split("/").pop().split("#")[0];

    if (targetFile && targetFile === currentPath && currentPath !== "index.html") {

      link.classList.add("active");

      pageMatched = true;

    }

  });



    // Scroll spy for in-page anchors if on home or anchor links exist
  if (!pageMatched) {
    const anchorLinks = Array.from(navLinks).filter((l) => (l.getAttribute("href") || "").startsWith("#"));
    const navSections = anchorLinks.map((link) => {
      const id = link.getAttribute("href");
      return id && id !== "#top" ? document.querySelector(id) : null;
    }).filter(Boolean);

    if (anchorLinks.length > 0 && navSections.length > 0) {
      let sectionData = [];
      const cacheSectionPositions = () => {
        sectionData = navSections.map((section) => {
          const top = section.getBoundingClientRect().top + window.scrollY;
          return {
            id: section.getAttribute("id"),
            top: top,
            height: section.offsetHeight
          };
        });
      };

      cacheSectionPositions();
      window.addEventListener("resize", cacheSectionPositions, { passive: true });
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.addEventListener("refresh", cacheSectionPositions);
      }

      let navTicking = false;
      const updateActiveNavLink = () => {
        if (!navTicking) {
          requestAnimationFrame(() => {
            const scrollPosition = window.scrollY + 250;
            let currentId = "";
            for (let i = 0; i < sectionData.length; i++) {
              const s = sectionData[i];
              if (scrollPosition >= s.top && scrollPosition < s.top + s.height) {
                currentId = s.id;
                break;
              }
            }

            anchorLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
            });
            navTicking = false;
          });
          navTicking = true;
        }
      };

      window.addEventListener("scroll", updateActiveNavLink, { passive: true });
      updateActiveNavLink();
    }
  }



  // 6. Back-to-Top Button

  const backToTopLinks = document.querySelectorAll('a[href="#top"]');

  backToTopLinks.forEach((link) => {

    link.addEventListener("click", (e) => {

      if (link.getAttribute("href") === "#top") {

        e.preventDefault();

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }

    });

  });



  // 7. Current Year

  const yearEl = document.getElementById("year-stamp");

  if (yearEl) {

    yearEl.textContent = new Date().getFullYear();

  }



  // 8. 3D Curved Infinite Logo Marquee Curvature Engine

  function initCurvedMarquee() {

    const viewport = document.querySelector(".curved-marquee-viewport");

    if (!viewport) return;



    const cards = Array.from(viewport.querySelectorAll(".tech-marquee-card"));

    if (!cards.length) return;



    // Respect reduced motion

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {

      cards.forEach((card) => {

        card.style.transform = "none";

      });

      return;

    }



    let isVisible = false;

    let rafId = null;



    // IntersectionObserver guarantees 60fps performance by only computing when section is visible

    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          isVisible = entry.isIntersecting;

          if (isVisible && !rafId) {

            rafId = requestAnimationFrame(tick);

          } else if (!isVisible && rafId) {

            cancelAnimationFrame(rafId);

            rafId = null;

          }

        });

      },

      { threshold: 0.02 }

    );



    observer.observe(viewport);



    // Reusable Float32Array to eliminate per-frame garbage collection

    const centers = new Float32Array(cards.length);



    function tick() {

      if (!isVisible) {

        rafId = null;

        return;

      }



      const viewportCenter = window.innerWidth * 0.5;

      const halfWidth = window.innerWidth * 0.5;



      // Batch Pass 1: Read all card horizontal centers

      for (let i = 0; i < cards.length; i++) {

        const rect = cards[i].getBoundingClientRect();

        centers[i] = rect.left + rect.width * 0.5;

      }



      // Batch Pass 2: Compute and write 3D transforms

      for (let i = 0; i < cards.length; i++) {

        const rawNormX = (centers[i] - viewportCenter) / halfWidth;

        const normX = Math.max(-1.5, Math.min(1.5, rawNormX));

        const absNormX = Math.abs(normX);

        const scale = 1 + (absNormX * absNormX) * 0.4;

        const rotY = normX * -45;



        cards[i].style.transform = `rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

      }



      rafId = requestAnimationFrame(tick);

    }



    rafId = requestAnimationFrame(tick);

  }



  initCurvedMarquee();



  // 9. Interactive About Section Headline & Right-Side Coordinated State

  const aboutTriggers = document.querySelectorAll(".about-trigger");

  aboutTriggers.forEach((trigger) => {

    const layout = trigger.closest(".about-layout");

    if (!layout) return;



    const activate = () => layout.classList.add("is-active");

    const deactivate = () => layout.classList.remove("is-active");



    trigger.addEventListener("mouseenter", activate);

    trigger.addEventListener("mouseleave", deactivate);

    trigger.addEventListener("focus", activate);

    trigger.addEventListener("blur", deactivate);

  });



  // 10. Interactive Word Hover for Gray Typography

  const graySelectors = [

    ".section-heading-row h2 span",

    ".faq-layout h2 span",

    ".about-statement h2 span",

    ".perspective-header h2 span",

    ".curved-marquee-header h2 span",

    ".contact-main h2 span",

    ".subpage-intro",

    ".section-intro",

    ".hero-copy",

    ".eyebrow",

    ".section-kicker",

    ".tiny-label",

    ".hero-aside p",

    ".about-copy p",

    ".about-facts span",

    ".about-facts p",

    ".contact-bottom p",

    ".contact-overline",

    ".faq-list details p",

    ".credentials-row p",

    ".credential-box p",

    ".credential-box .badge",

    ".service-card p",

    ".process-step p",

    ".project-one-liner",

    ".detail-paragraph",

    ".detail-feature-card p",

    ".gallery-caption"

  ];



  function wrapWords(element) {

    if (!element || element.dataset.grayWordsWrapped === "true") return;

    element.dataset.grayWordsWrapped = "true";



    const childNodes = Array.from(element.childNodes);

    for (const node of childNodes) {

      if (node.nodeType === Node.TEXT_NODE) {

        const text = node.nodeValue;

        if (!text || !text.trim()) continue;



        const frag = document.createDocumentFragment();

        const tokens = text.split(/(\s+)/);

        for (const token of tokens) {

          if (!token) continue;

          if (/^\s+$/.test(token)) {

            frag.appendChild(document.createTextNode(token));

          } else {

            const span = document.createElement("span");

            span.className = "gray-word";

            span.textContent = token;

            frag.appendChild(span);

          }

        }

        element.replaceChild(frag, node);

      } else if (node.nodeType === Node.ELEMENT_NODE) {

        const tag = node.tagName.toLowerCase();

        if (tag !== "a" && tag !== "button" && tag !== "svg" && !node.classList.contains("gray-word")) {

          wrapWords(node);

        }

      }

    }

  }



  function applyGrayWordHover() {

    graySelectors.forEach((selector) => {

      document.querySelectorAll(selector).forEach((el) => {

        wrapWords(el);

      });

    });

  }



  applyGrayWordHover();

});

