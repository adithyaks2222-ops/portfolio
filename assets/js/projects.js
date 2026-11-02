/**
 * CENTRAL PROJECTS REPOSITORY
 * Scalable architecture for Adithya K S Portfolio
 * 
 * To add a new project in the future:
 * 1. Add its HTML detail page in `projects/<project-id>.html`
 * 2. Add its preview images/mockups in `assets/images/projects/`
 * 3. Add an entry to this array
 * The homepage showcase will automatically render the new project card!
 */

const PORTFOLIO_PROJECTS = [
  {
    id: "capx",
    title: "CAPX",
    tagline: "Cyber Analysis & Protection eXplorer",
    category: "DEFENSIVE SECURITY / SYSTEM ANALYSIS",
    shortDescription: "A Windows system analysis and security inspection application.",
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
      { name: "HTML5", icon: "assets/images/icons/html5.svg" },
      { name: "CSS3", icon: "assets/images/icons/css3.svg" }
    ]
  },
  {
    id: "phisheye",
    title: "PhishEye",
    tagline: "Heuristic Phishing Detection Extension",
    category: "BROWSER SECURITY / HEURISTICS",
    shortDescription: "A Chrome extension that analyses URLs and website content for potential phishing indicators.",
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
      { name: "HTML5", icon: "assets/images/icons/html5.svg" },
      { name: "CSS3", icon: "assets/images/icons/css3.svg" }
    ]
  },
  {
    id: "jarvx",
    title: "JARVX",
    tagline: "Python Command-Line Network Scanner",
    category: "NETWORKING / CLI UTILITY",
    shortDescription: "A Python command-line network scanning utility.",
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
      { name: "PyInstaller", icon: "assets/images/icons/linux.svg" }
    ]
  },
  {
    id: "codeburner",
    title: "CodeBurner",
    tagline: "AI-Assisted Code Review & Feedback Extension",
    category: "DEVELOPER EXPERIENCE / AI",
    shortDescription: "An AI-assisted code review and feedback extension for Visual Studio Code.",
    status: "MVP Completed",
    statusClass: "mvp",
    previewImage: "assets/images/projects/codeburner.svg",
    detailUrl: "projects/codeburner.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" },
      { name: "VS Code API", icon: "assets/images/icons/vscode.svg" },
      { name: "Ollama", icon: "assets/images/icons/ollama.svg" },
      { name: "Llama 3", icon: "assets/images/icons/python.svg" }
    ]
  },
  {
    id: "starkforge",
    title: "StarkForge",
    tagline: "Interactive Educational Technology Platform",
    category: "EDTECH / INTERACTIVE LEARNING",
    shortDescription: "An interactive educational technology platform for computer science and logic simulation.",
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
    tagline: "Location-Based Photo Organization Tool",
    category: "PRODUCTIVITY / GEOLOCATION",
    shortDescription: "A location-based photo organization and verification tool.",
    status: "Project Prototype",
    statusClass: "prototype",
    previewImage: "assets/images/projects/geotagger.svg",
    detailUrl: "projects/geotagger.html",
    githubUrl: "https://github.com/adithyaks2222-ops",
    liveDemoUrl: null,
    downloadUrl: null,
    techStack: [
      { name: "HTML5", icon: "assets/images/icons/html5.svg" },
      { name: "CSS3", icon: "assets/images/icons/css3.svg" },
      { name: "JavaScript", icon: "assets/images/icons/javascript.svg" },
      { name: "Google Maps", icon: "assets/images/icons/chrome.svg" }
    ]
  }
];

// Helper to render homepage project cards automatically
function renderProjectShowcase(containerId = "projects-showcase-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = PORTFOLIO_PROJECTS.map(project => `
    <a class="project-card reveal" href="${project.detailUrl}" aria-label="View case study for ${project.title}">
      <div class="project-visual">
        <img src="${project.previewImage}" alt="${project.title} preview screenshot" class="project-preview-img" loading="lazy">
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
              <img src="${tech.icon}" alt="" aria-hidden="true" class="tech-icon-mini">
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
