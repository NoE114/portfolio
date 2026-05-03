const fallbackProjects = [
  {
    name: "PE-Hackathon-Template-2026",
    description: "A reusable hackathon template focused on fast setup and clear project structure.",
    html_url: "https://github.com/NoE114/PE-Hackathon-Template-2026",
    language: "JavaScript",
  },
  {
    name: "X0R_AMUHACKS5.0",
    description: "Hackathon project work with a practical product focus and collaborative workflow.",
    html_url: "https://github.com/NoE114/X0R_AMUHACKS5.0",
    language: "JavaScript",
  },
  {
    name: "Scientific-calculator",
    description: "A browser-based calculator for precise everyday scientific operations.",
    html_url: "https://github.com/NoE114/Scientific-calculator",
    language: "HTML",
  },
];

const terminalLines = [
  ["$", "whoami"],
  ["", "NoE"],
  ["$", "role"],
  ["", "Student developer / full-stack builder"],
  ["$", "stack --top"],
  ["", "JavaScript  HTML  CSS  React  Node  Python  Linux"],
  ["$", "mission"],
  ["", "Build clean, accessible, useful software."],
];

const aboutLines = [
  ["$", "cat about.md"],
  ["", "NoE is a student developer focused on practical full-stack web work."],
  ["", "I care about readable code, responsive layouts, accessible interactions, and interfaces that feel clear instead of noisy."],
  ["$", "current_stack"],
  ["", "JavaScript, HTML, CSS, React, Node.js, Python, C, Git, GitHub, Linux, REST APIs, Figma"],
  ["$", "working_style"],
  ["", "Terminal-first, detail-oriented, and always looking for the cleaner implementation."],
];

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("[data-menu]");
const aboutModal = document.querySelector("[data-about-modal]");
const aboutOpeners = document.querySelectorAll("[data-about-open]");
const aboutClosers = document.querySelectorAll("[data-about-close]");

const initMatrixRain = () => {
  const rain = document.querySelector("[data-matrix-rain]");
  if (!rain || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const glyphs = ["0", "1"];
  const columns = window.innerWidth < 680 ? 18 : 38;

  rain.innerHTML = Array.from({ length: columns }, (_, index) => {
    const length = 12 + Math.floor(Math.random() * 16);
    const bits = Array.from({ length }, () => `<span>${glyphs[Math.floor(Math.random() * glyphs.length)]}</span>`).join("");
    const x = (index / columns) * 100 + Math.random() * 1.8;
    const size = 0.72 + Math.random() * 0.42;
    const duration = 11 + Math.random() * 14;
    const delay = -Math.random() * duration;
    const opacity = 0.28 + Math.random() * 0.34;

    return `<div class="matrix-column" style="--x:${x}%;--size:${size}rem;--duration:${duration}s;--delay:${delay}s;--opacity:${opacity};">${bits}</div>`;
  }).join("");
};

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const typeLines = (terminal, lines, speed = 22) => {
  if (!terminal) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  terminal.innerHTML = "";

  const renderAll = () => {
    terminal.innerHTML = lines
      .map(([prompt, text], index) => {
        const cls = prompt ? "prompt" : "muted";
        const cursor = index === lines.length - 1 ? " cursor" : "";
        return `<p class="${cls}${cursor}">${prompt ? `<span class="prompt">${prompt}</span> ` : ""}${text}</p>`;
      })
      .join("");
  };

  if (prefersReduced) {
    renderAll();
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;

  const tick = () => {
    const [prompt, text] = lines[lineIndex];
    let line = terminal.querySelector(`[data-line="${lineIndex}"]`);

    if (!line) {
      line = document.createElement("p");
      line.dataset.line = String(lineIndex);
      line.className = prompt ? "prompt" : "muted";
      terminal.appendChild(line);
    }

    line.innerHTML = `${prompt ? `<span class="prompt">${prompt}</span> ` : ""}${text.slice(0, charIndex)}`;
    charIndex += 1;

    if (charIndex <= text.length) {
      terminal.dataset.timer = window.setTimeout(tick, speed);
      return;
    }

    lineIndex += 1;
    charIndex = 0;

    if (lineIndex < lines.length) {
      terminal.dataset.timer = window.setTimeout(tick, prompt ? 140 : 80);
      return;
    }

    line.classList.add("cursor");
  };

  terminal.dataset.timer = window.setTimeout(tick, 180);
};

const typeTerminal = () => {
  const terminal = document.querySelector('[data-terminal="home"]');
  typeLines(terminal, terminalLines);
};

const openAboutModal = () => {
  if (!aboutModal) return;

  aboutModal.classList.add("is-open");
  aboutModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const terminal = aboutModal.querySelector('[data-terminal="about"]');
  if (terminal?.dataset.timer) {
    window.clearTimeout(Number(terminal.dataset.timer));
  }
  typeLines(terminal, aboutLines, 18);
  aboutModal.querySelector(".terminal-close")?.focus();
};

const closeAboutModal = () => {
  if (!aboutModal) return;

  const terminal = aboutModal.querySelector('[data-terminal="about"]');
  if (terminal?.dataset.timer) {
    window.clearTimeout(Number(terminal.dataset.timer));
  }

  aboutModal.classList.remove("is-open");
  aboutModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

aboutOpeners.forEach((opener) => {
  opener.addEventListener("click", openAboutModal);
});

aboutClosers.forEach((closer) => {
  closer.addEventListener("click", closeAboutModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aboutModal?.classList.contains("is-open")) {
    closeAboutModal();
  }
});

const projectCard = (repo) => {
  const language = repo.language || "Repo";
  const description = repo.description || "No description yet. Open the repository for more details.";
  return `
    <article class="project-card shell-window">
      <span class="project-command">$ open ${repo.name}</span>
      <h3>${repo.name}</h3>
      <p>${description}</p>
      <div class="project-meta">
        <span>${language}</span>
        <a class="text-link" href="${repo.html_url}" target="_blank" rel="noopener">GitHub</a>
      </div>
    </article>
  `;
};

const renderProjects = (repos) => {
  const featuredContainer = document.querySelector("[data-projects-featured]");
  const allContainer = document.querySelector("[data-projects-all]");
  const featuredNames = ["PE-Hackathon-Template-2026", "X0R_AMUHACKS5.0", "Scientific-calculator"];

  const cleanRepos = repos.filter((repo) => !repo.archived && !repo.disabled);
  const featured = featuredNames
    .map((name) => cleanRepos.find((repo) => repo.name === name) || fallbackProjects.find((repo) => repo.name === name))
    .filter(Boolean);

  if (featuredContainer) {
    featuredContainer.innerHTML = featured.map(projectCard).join("");
  }

  if (allContainer) {
    const remaining = cleanRepos.filter((repo) => !featuredNames.includes(repo.name));
    allContainer.innerHTML = [...featured, ...remaining].slice(0, 18).map(projectCard).join("");
  }
};

const loadProjects = async () => {
  const hasProjects = document.querySelector("[data-projects-featured], [data-projects-all]");
  if (!hasProjects) return;

  renderProjects(fallbackProjects);

  try {
    const response = await fetch("https://api.github.com/users/NoE114/repos?per_page=100&sort=updated");
    if (!response.ok) return;
    const repos = await response.json();
    if (Array.isArray(repos)) {
      renderProjects(repos);
    }
  } catch (error) {
    renderProjects(fallbackProjects);
  }
};

const initReveal = () => {
  const targets = document.querySelectorAll(".section, .project-card, .page-hero, .contact-form");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
};

const initContactForm = () => {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  const submitBtn = document.getElementById("submit-btn");
  if (!form || !feedback || !submitBtn) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "./sending";
    feedback.className = "form-feedback";
    feedback.textContent = "";

    try {
      const formData = new FormData(form);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) throw new Error("Submission failed");

      feedback.className = "form-feedback success";
      feedback.textContent = "$ message sent successfully";
      form.reset();
    } catch (error) {
      feedback.className = "form-feedback error";
      feedback.textContent = "$ send failed. Please try again later.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "./send-message";
    }
  });
};

typeTerminal();
initMatrixRain();
loadProjects();
initReveal();
initContactForm();
