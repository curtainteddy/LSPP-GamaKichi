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
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  function setTheme(mode) {
    if (mode === "dark") {
      body.classList.add("dark-mode");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      themeIcon.setAttribute("title", "Switch to light mode");
    } else {
      body.classList.remove("dark-mode");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      themeIcon.setAttribute("title", "Switch to dark mode");
    }
    localStorage.setItem("theme", mode);
  }

  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    setTheme(isDark ? "dark" : "light");
  });

  document.addEventListener("DOMContentLoaded", function () {
    const toolItems = document.querySelectorAll(".tool-item");
    const body = document.body;
    let isDarkMode = false;

    // Dark mode toggle (press 'D' key)
    document.addEventListener("keydown", function (e) {
      if (e.key === "d" || e.key === "D") {
        isDarkMode = !isDarkMode;
        body.classList.toggle("dark-mode", isDarkMode);
      }
    });

    // Enhanced hover effects
    toolItems.forEach((item, index) => {
      // Add staggered floating animation
      setTimeout(() => {
        item.classList.add("animate");
      }, index * 200);

      // Enhanced click effects
      item.addEventListener("click", function () {
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      });

      // Magnetic effect on mouse move
      item.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const moveX = x * 0.1;
        const moveY = y * 0.1;

        this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      });

      item.addEventListener("mouseleave", function () {
        this.style.transform = "";
      });
    });

    // Intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0) scale(1)";
          }, index * 100);
        }
      });
    }, observerOptions);

    toolItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(50px) scale(0.8)";
      item.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(item);
    });
  });

  // On load, set theme from localStorage
  (function () {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      body.classList.add("dark-mode");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  })();
});

 // Add interactive hover effects and animations
        document.addEventListener('DOMContentLoaded', function() {
            const goalCards = document.querySelectorAll('.goal-card');
            const skillBadges = document.querySelectorAll('.skill-badge');
            const progressFills = document.querySelectorAll('.progress-fill');
            
            // Dark mode toggle for demonstration
            const body = document.body;
            let isDarkMode = false;
            
            // Add click event to toggle dark mode (for demo purposes)
            document.addEventListener('keydown', function(e) {
                if (e.key === 'd' || e.key === 'D') {
                    isDarkMode = !isDarkMode;
                    body.classList.toggle('dark-mode', isDarkMode);
                }
            });

            // Enhanced card hover effects
            goalCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.borderTopColor = '#45a049';
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.borderTopColor = '#4CAF50';
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Skill badge interactions
            skillBadges.forEach(badge => {
                badge.addEventListener('click', function() {
                    this.style.animation = 'pulse 0.6s ease-in-out';
                    setTimeout(() => {
                        this.style.animation = '';
                    }, 600);
                });
            });

            // Progress bar animation
            const animateProgressBars = () => {
                progressFills.forEach(fill => {
                    const targetWidth = fill.getAttribute('data-width');
                    fill.style.width = '0%';
                    setTimeout(() => {
                        fill.style.width = targetWidth + '%';
                    }, 300);
                });
            };

            // Intersection observer for scroll animations
            const observerOptions = {
                threshold: 0.3,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        
                        // Trigger progress bar animation when card comes into view
                        const progressBar = entry.target.querySelector('.progress-fill');
                        if (progressBar) {
                            setTimeout(() => {
                                const targetWidth = progressBar.getAttribute('data-width');
                                progressBar.style.width = targetWidth + '%';
                            }, 500);
                        }
                    }
                });
            }, observerOptions);

            goalCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px)';
                card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
                observer.observe(card);
            });

            // Add pulse animation to CSS
            if (!document.querySelector('#pulse-animation')) {
                const style = document.createElement('style');
                style.id = 'pulse-animation';
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        });