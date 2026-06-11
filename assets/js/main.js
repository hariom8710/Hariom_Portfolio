document.addEventListener("DOMContentLoaded", async () => {
  // --- 1. LOAD JSON DATA ---
  // In your local project, delete the 3 lines below and uncomment the fetch() block.
  const jsonText = document.getElementById("portfolio-data").textContent;
  const data = JSON.parse(jsonText);
  renderContent(data);

  /* // Local JSON Fetch (Use this in VS Code)
            try {
                const response = await fetch('./data/profile.json');
                const data = await response.json();
                renderContent(data);
            } catch (error) {
                console.error("Error loading profile.json:", error);
            }
            */

  // --- 2. RENDER CONTENT FUNCTION ---
  function renderContent(data) {
    // Populate Static Text
    document.getElementById("brand-name").textContent = data.brand;
    document.getElementById("active-page").textContent = data.activePage;
    document.getElementById("hero-availability").textContent =
      data.availability;

    document.getElementById("hero-greeting").textContent = data.hero.greeting;
    document.getElementById("hero-name").textContent = data.hero.name;
    document.getElementById("hero-action").textContent = data.hero.action;
    document.getElementById("hero-skill").textContent = data.hero.skill;
    document.getElementById("hero-desc").textContent = data.hero.description;

    // Populate Hero Buttons
    document.getElementById("hero-btn-primary").textContent =
      data.hero.primaryBtn;
    document.getElementById("hero-btn-secondary").textContent =
      data.hero.secondaryBtn;

    // Populate Desktop Nav
    const desktopNav = document.getElementById("desktop-nav");
    const mobileNav = document.getElementById("mobile-nav");

    data.navLinks.forEach((link) => {
      // Desktop Link
      const li = document.createElement("li");
      li.innerHTML = `<a href="${link.href}" class="text-[0.95rem] transition-all duration-200 text-slate-600 hover:text-slate-900 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:text-slate-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${link.name}</a>`;
      desktopNav.appendChild(li);

      // Mobile Link
      const div = document.createElement("div");
      div.innerHTML = `<a href="${link.href}" class="mobile-link text-[1rem] transition-colors duration-200 cursor-pointer block py-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">${link.name}</a>`;
      mobileNav.appendChild(div);
    });

    // Re-initialize Lucide icons after DOM generation
    lucide.createIcons();
    setupEventListeners();
    initTypewriter(data.hero.roles);
  }

  // --- 3. INTERACTIVE LOGIC (Scroll, Theme, Menu, Typing) ---

  function initTypewriter(roles) {
    const typewriterEl = document.getElementById("typewriter");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40; // Faster deletion speed
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal typing speed
      }

      // Handle end of word and switching
      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at the end of the word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before starting new word
      }

      setTimeout(type, typingSpeed);
    }

    // Start the typing effect
    if (roles && roles.length > 0) {
      type();
    }
  }

  function setupEventListeners() {
    const navContainer = document.getElementById("nav-container");
    const html = document.documentElement;
    const themeToggle = document.getElementById("theme-toggle");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const iconMenu = document.getElementById("icon-menu");
    const iconClose = document.getElementById("icon-close");

    let isMenuOpen = false;

    // Scroll Effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navContainer.classList.remove(
          "bg-white/30",
          "dark:bg-[#091322]/20",
          "border-slate-200/50",
          "dark:border-slate-700/20",
        );
        navContainer.classList.add(
          "bg-white/85",
          "dark:bg-[#091322]/85",
          "border-slate-200/80",
          "dark:border-slate-700/50",
          "shadow-md",
        );
      } else {
        navContainer.classList.add(
          "bg-white/30",
          "dark:bg-[#091322]/20",
          "border-slate-200/50",
          "dark:border-slate-700/20",
        );
        navContainer.classList.remove(
          "bg-white/85",
          "dark:bg-[#091322]/85",
          "border-slate-200/80",
          "dark:border-slate-700/50",
          "shadow-md",
        );
      }
    });

    // Theme Toggle
    themeToggle.addEventListener("click", () => {
      html.classList.toggle("dark");
      // Optional: Save preference to localStorage here
    });

    // Mobile Menu Toggle
    function toggleMenu() {
      isMenuOpen = !isMenuOpen;
      if (isMenuOpen) {
        mobileMenu.classList.remove(
          "opacity-0",
          "scale-95",
          "max-h-0",
          "pointer-events-none",
        );
        mobileMenu.classList.add("opacity-100", "scale-100", "max-h-[500px]");
        iconMenu.classList.add("hidden");
        iconMenu.classList.remove("block");
        iconClose.classList.add("block");
        iconClose.classList.remove("hidden");

        mobileMenuBtn.classList.add(
          "dark:bg-teal-500/20",
          "dark:text-teal-500",
          "dark:border-teal-500/30",
          "bg-teal-50",
          "text-teal-600",
          "border-teal-200",
        );
      } else {
        mobileMenu.classList.add(
          "opacity-0",
          "scale-95",
          "max-h-0",
          "pointer-events-none",
        );
        mobileMenu.classList.remove(
          "opacity-100",
          "scale-100",
          "max-h-[500px]",
        );
        iconMenu.classList.add("block");
        iconMenu.classList.remove("hidden");
        iconClose.classList.add("hidden");
        iconClose.classList.remove("block");

        mobileMenuBtn.classList.remove(
          "dark:bg-teal-500/20",
          "dark:text-teal-500",
          "dark:border-teal-500/30",
          "bg-teal-50",
          "text-teal-600",
          "border-teal-200",
        );
      }
    }

    mobileMenuBtn.addEventListener("click", toggleMenu);

    // Close mobile menu when a link is clicked
    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (isMenuOpen) toggleMenu();
      });
    });
  }
});
