document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });

  // Modal functionality for team members
  const memberCards = document.querySelectorAll(".member-card");
  const modals = document.querySelectorAll(".modal");

  memberCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't open modal if clicking the button (let button click handle it)
      if (e.target.classList.contains("view-profile")) return;

      const memberId = this.getAttribute("data-member");
      const modal = document.getElementById(`${memberId}-modal`);

      if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling
      }
    });
  });

  // Handle view profile button clicks
  document.querySelectorAll(".view-profile").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent card click from also triggering

      const card = this.closest(".member-card");
      const memberId = card.getAttribute("data-member");
      const modal = document.getElementById(`${memberId}-modal`);

      if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling
      }
    });
  });

  // Close modals when clicking X or outside
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this || e.target.classList.contains("close")) {
        this.style.display = "none";
        document.body.style.overflow = "auto"; // Re-enable scrolling
      }
    });
  });

  // Close modals with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modals.forEach((modal) => {
        if (modal.style.display === "block") {
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }
      });
    }
  });

  // Add active class to nav links when scrolling
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const headerHeight = document.querySelector("header").offsetHeight;

      if (pageYOffset >= sectionTop - headerHeight - 50) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Add animation on scroll
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".team-cards .member-card, .goals-container .goal-card, .tools-container .tool-item, .docs-container .doc-card"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Set initial state for animation
  document
    .querySelectorAll(
      ".team-cards .member-card, .goals-container .goal-card, .tools-container .tool-item, .docs-container .doc-card"
    )
    .forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Run once on load in case elements are already in view

  // Dark/Light mode toggle
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  function setTheme(mode) {
    if (mode === "dark") {
      body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️";
    } else {
      body.classList.remove("dark-mode");
      toggleBtn.textContent = "🌙";
    }
    localStorage.setItem("theme", mode);
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    setTheme(isDark ? "dark" : "light");
  });

  // On load, set theme from localStorage
  (function () {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Light Mode";
    }
  })();
});
