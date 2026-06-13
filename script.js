const projects = [
  {
    title: "Project Aahar",
    category: "Food Drive",
    image: 'linear-gradient(135deg, rgba(37,99,235,.9), rgba(124,58,237,.75)), url("https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80")',
    text: "Nutritious meal distribution and ration support for families facing hardship."
  },
  {
    title: "Project Shiksha",
    category: "Education",
    image: 'linear-gradient(135deg, rgba(15,23,42,.65), rgba(37,99,235,.55)), url("https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80")',
    text: "Study material, mentorship, and joyful learning spaces for young learners."
  },
  {
    title: "Green Pankh",
    category: "Environment",
    image: 'linear-gradient(135deg, rgba(20,184,166,.62), rgba(88,28,135,.65)), url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80")',
    text: "Plantation, waste awareness, and citizen action programs."
  }
];

const icons = {
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm0 0A2.5 2.5 0 0 1 6.5 8H20" />',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />',
  leaf: '<path d="M5 21c.5-6.5 4-11 13-14M6 15C4.5 9.5 8 4 20 3c1 10-4.5 15.5-10 14" />',
  spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7 12 1 2.8 3 1.2-3 1.2-1 2.8-1-2.8-3-1.2 3-1.2 1-2.8ZM5 14l.7 1.8L8 17l-2.3 1.2L5 20l-.7-1.8L2 17l2.3-1.2L5 14Z" />'
};

const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const themeToggle = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

function setTheme(isDark) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.querySelector("span").textContent = isDark ? "☀" : "●";
}

function formatIndianNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function animateCounter(card) {
  if (card.dataset.counted === "true") return;

  card.dataset.counted = "true";
  const target = Number(card.dataset.count);
  const suffix = card.dataset.suffix || "";
  const output = card.querySelector("strong");
  let startTime;

  function tick(time) {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / 1400, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    output.textContent = `${formatIndianNumber(Math.floor(target * eased))}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function renderIcons() {
  document.querySelectorAll("[data-icon]").forEach((icon) => {
    icon.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${icons[icon.dataset.icon]}
      </svg>
    `;
  });
}

let projectIndex = 0;
let projectTimer;

function renderProject(index) {
  projectIndex = index;
  const project = projects[projectIndex];

  document.querySelector(".carousel-image").style.backgroundImage = project.image;
  document.querySelector(".project-category").textContent = project.category;
  document.querySelector(".project-title").textContent = project.title;
  document.querySelector(".project-text").textContent = project.text;

  document.querySelectorAll(".dots button").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === projectIndex);
  });
}

function startProjectTimer() {
  clearInterval(projectTimer);
  projectTimer = setInterval(() => {
    renderProject((projectIndex + 1) % projects.length);
  }, 4200);
}

function setupCarousel() {
  const dots = document.querySelector(".dots");

  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Show ${project.title}`);
    button.addEventListener("click", () => {
      renderProject(index);
      startProjectTimer();
    });
    dots.append(button);
  });

  renderProject(0);
  startProjectTimer();
}

function setupRevealAnimations() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateCounter(entry.target);
    });
  }, { threshold: 0.25 });

  document.querySelectorAll(".stat-card").forEach((card) => counterObserver.observe(card));
}

function setupFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector("button");

    button.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("open");

      document.querySelectorAll(".faq-item").forEach((faq) => {
        faq.classList.remove("open");
        faq.querySelector("button").setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("open", shouldOpen);
      button.setAttribute("aria-expanded", String(shouldOpen));
    });
  });
}

function setupContactForm() {
  const form = document.querySelector(".contact-form");
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Thank you. Your message is ready to be sent to the foundation team.";
    form.reset();
  });
}

setTheme(savedTheme ? savedTheme === "dark" : prefersDark);
renderIcons();
setupCarousel();
setupRevealAnimations();
setupFaq();
setupContactForm();

themeToggle.addEventListener("click", () => {
  setTheme(!document.documentElement.classList.contains("dark"));
});

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
