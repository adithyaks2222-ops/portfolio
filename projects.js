/**
 * CENTRAL PROJECTS REPOSITORY
 * Scalable architecture for Adithya K S Portfolio
 */

const PORTFOLIO_PROJECTS = [
  {
    id: "capx",
    title: "CAPX",
    tagline: "Cyber Analysis & Protection eXplorer",
    category: "DEFENSIVE SECURITY",
    shortDescription: "Windows system analysis and security inspection utility.",
    status: "In Development",
    statusClass: "in-dev",
    previewImage: "assets/images/projects/capx.svg",
    detailUrl: "projects/capx.html",
    githubUrl: "https://github.com/adithyaks2222-ops/CAPX",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "Python", icon: "assets/images/icons/python.svg" },
      { name: "Flask", icon: "assets/images/icons/flask.svg" },
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" },
      { name: "HTML5", icon: "assets/images/icons/html5.svg" }
    ]
  },
  {
    id: "phisheye",
    title: "PhishEye",
    tagline: "Heuristic Phishing Detection Extension",
    category: "BROWSER SECURITY",
    shortDescription: "Chrome extension analyzing URLs for phishing indicators.",
    status: "Development",
    statusClass: "in-dev",
    previewImage: "assets/images/projects/phisheye.svg",
    detailUrl: "projects/phisheye.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" },
      { name: "Chrome API", icon: "assets/images/icons/chrome.svg" },
      { name: "HTML5", icon: "assets/images/icons/html5.svg" }
    ]
  },
  {
    id: "jarvx",
    title: "JARVX",
    tagline: "Python Command-Line Network Scanner",
    category: "CLI NETWORKING",
    shortDescription: "Lightweight command-line network diagnostic tool.",
    status: "Prototype",
    statusClass: "prototype",
    previewImage: "assets/images/projects/jarvx.svg",
    detailUrl: "projects/jarvx.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "Python", icon: "assets/images/icons/python.svg" },
      { name: "Sockets", icon: "assets/images/icons/cisco.svg" },
      { name: "Linux", icon: "assets/images/icons/linux.svg" }
    ]
  },
  {
    id: "codeburner",
    title: "CodeBurner",
    tagline: "Ephemeral Code Paste Application",
    category: "DEV TOOLS",
    shortDescription: "Paste-sharing web application with burning expiration.",
    status: "MVP Completed",
    statusClass: "mvp",
    previewImage: "assets/images/projects/codeburner.svg",
    detailUrl: "projects/codeburner.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" },
      { name: "Node.js", icon: "assets/images/icons/nodejs.svg" },
      { name: "MongoDB", icon: "assets/images/icons/mongodb.svg" }
    ]
  },
  {
    id: "starkforge",
    title: "StarkForge",
    tagline: "Interactive Developer Dashboard",
    category: "DASHBOARD",
    shortDescription: "Developer dashboard with system monitors and widgets.",
    status: "Actively Developing",
    statusClass: "in-dev",
    previewImage: "assets/images/projects/starkforge.svg",
    detailUrl: "projects/starkforge.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "HTML5", icon: "assets/images/icons/html5.svg" },
      { name: "CSS3", icon: "assets/images/icons/css3.svg" },
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" }
    ]
  },
  {
    id: "geotagger",
    title: "GeoTagger",
    tagline: "Geolocation Verification Utility",
    category: "GEOLOCATION",
    shortDescription: "Photo geolocation extraction and map verification utility.",
    status: "Prototype",
    statusClass: "prototype",
    previewImage: "assets/images/projects/geotagger.svg",
    detailUrl: "projects/geotagger.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" },
      { name: "Maps API", icon: "assets/images/icons/chrome.svg" },
      { name: "HTML5", icon: "assets/images/icons/html5.svg" }
    ]
  }
];

// Helper to render homepage project cards automatically
function renderProjectShowcase(containerId = "projects-showcase-container", prefix = "") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // If container already contains static pre-rendered cards, keep them
  if (container.children.length > 0 && !container.dataset.dynamic) return;
  container.dataset.dynamic = "true";

  container.innerHTML = PORTFOLIO_PROJECTS.map(project => `
    <a class="project-card reveal" href="${prefix}${project.detailUrl}" aria-label="View case study for ${project.title}">
      <div class="project-visual">
        <img src="${prefix}${project.previewImage}" alt="${project.title} preview screenshot" class="project-preview-img" loading="lazy">
        <span class="visual-tag">${project.category}</span>
      </div>
      <div class="project-info">
        <div class="project-info-main">
          <div class="project-title-row">
            <h3 class="project-card-title">${project.title} <span class="arrow-glyph" aria-hidden="true">↗</span></h3>
            <span class="project-status-badge ${project.statusClass}">${project.status}</span>
          </div>
          <p class="project-one-liner">${project.shortDescription}</p>
        </div>
        <div class="project-tech-pills">
          ${project.techStack.map(tech => `
            <span class="tech-pill-mini">
              <img src="${prefix}${tech.icon}" alt="" aria-hidden="true" class="tech-icon-mini">
              <span>${tech.name}</span>
            </span>
          `).join("")}
        </div>
      </div>
    </a>
  `).join("");
}

// Make accessible globally
if (typeof window !== "undefined") {
  window.PORTFOLIO_PROJECTS = PORTFOLIO_PROJECTS;
  window.renderProjectShowcase = renderProjectShowcase;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PORTFOLIO_PROJECTS, renderProjectShowcase };
}
