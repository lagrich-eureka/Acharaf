// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize animations
  initializeAnimations()

  // Initialize hero carousel
  initializeHeroCarousel()

  // Initialize mobile menu
  initializeMobileMenu()

  // Initialize dropdown menus
  initializeDropdowns()

  // Initialize contact form
  initializeContactForm()

  // Initialize small contact form
  initializeSmallContactForm()

  // Initialize scroll effects
  initializeScrollEffects()

  // Initialize scroll to top button
  createScrollToTopButton()
})

// Animation Observer
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running"
      }
    })
  }, observerOptions)

  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    ".fade-in, .fade-in-up, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in",
  )

  animatedElements.forEach((el) => {
    el.style.animationPlayState = "paused"
    observer.observe(el)
  })
}

// Hero Carousel
function initializeHeroCarousel() {
  const heroImages = document.querySelectorAll(".hero-image")
  const heroDots = document.querySelectorAll(".hero-dot")
  let currentSlide = 0
  let slideInterval

  if (heroImages.length === 0) return

  function showSlide(index) {
    // Hide all images
    heroImages.forEach((img) => img.classList.remove("active"))
    heroDots.forEach((dot) => dot.classList.remove("active"))

    // Show current image
    heroImages[index].classList.add("active")
    heroDots[index].classList.add("active")

    currentSlide = index
  }

  function nextSlide() {
    const next = (currentSlide + 1) % heroImages.length
    showSlide(next)
  }

  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000)
  }

  function stopSlideshow() {
    clearInterval(slideInterval)
  }

  // Initialize dots click handlers
  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index)
      stopSlideshow()
      startSlideshow() // Restart timer
    })
  })

  // Start automatic slideshow
  startSlideshow()

  // Pause on hover
  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    heroSection.addEventListener("mouseenter", stopSlideshow)
    heroSection.addEventListener("mouseleave", startSlideshow)
  }
}

// Mobile Menu
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (!mobileMenuToggle || !mobileMenu) return

  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")
    mobileMenuToggle.classList.toggle("active")

    // Animate hamburger menu
    const spans = mobileMenuToggle.querySelectorAll("span")
    if (mobileMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  })

  // Close mobile menu when clicking on links
  const mobileLinks = mobileMenu.querySelectorAll("a")
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      mobileMenuToggle.classList.remove("active")

      const spans = mobileMenuToggle.querySelectorAll("span")
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    })
  })
}

// Dropdown Menus
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")

    if (!toggle || !menu) return

    // Show dropdown on hover
    dropdown.addEventListener("mouseenter", () => {
      menu.style.opacity = "1"
      menu.style.visibility = "visible"
      menu.style.transform = "translateY(0)"
    })

    // Hide dropdown when mouse leaves
    dropdown.addEventListener("mouseleave", () => {
      menu.style.opacity = "0"
      menu.style.visibility = "hidden"
      menu.style.transform = "translateY(-10px)"
    })
  })
}

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")

  if (!contactForm) return

  // Set all input borders to neutral on load and remove browser's green border
  const requiredFields = ["prenom", "nom", "email", "sujet", "message", "telephone"];
  requiredFields.forEach((field) => {
    const input = contactForm.querySelector(`[name="${field}"]`)
    if (input) {
      input.style.borderColor = "#d1d5db"
      input.style.boxShadow = "none"
      input.classList.remove("valid")
      input.classList.remove("invalid")
      // Remove any input event that might change border color
      input.oninput = null;
      // Remove browser's green border for valid input
      input.addEventListener("input", function() {
        this.style.borderColor = "#d1d5db";
        this.style.boxShadow = "none";
      });
    }
  });

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)

    // Validate required fields only on submit
    let isValid = true
    requiredFields.forEach((field) => {
      const input = contactForm.querySelector(`[name="${field}"]`)
      if (!data[field] || !data[field].trim()) {
        isValid = false
        input.style.borderColor = "#ef4444"
        input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"
      } else {
        // Special validation for telephone
        if (field === "telephone") {
          const tel = data[field].trim()
          const telRegex = /^(\+212|06|05|07)\d{8}$/
          if (!telRegex.test(tel)) {
            isValid = false
            input.style.borderColor = "#ef4444"
            input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"
          } else {
            input.style.borderColor = "#d1d5db"
            input.style.boxShadow = "none"
          }
        } else {
          input.style.borderColor = "#d1d5db"
          input.style.boxShadow = "none"
        }
      }
    })
    if (!isValid) {
      showNotification("Veuillez remplir tous les champs obligatoires.", "error")
      return
    }

    // Simulate form submission
    submitBtn.disabled = true
    submitBtn.innerHTML = `
            <span class="form-loading">
                <div class="spinner"></div>
                Envoi en cours...
            </span>
        `

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success
      submitBtn.innerHTML = "✓ Message envoyé!"
      submitBtn.classList.add("form-success")
      contactForm.reset()
      // Reset all borders to neutral after reset
      requiredFields.forEach((field) => {
        const input = contactForm.querySelector(`[name="${field}"]`)
        if (input) {
          input.style.borderColor = "#d1d5db"
          input.style.boxShadow = "none"
        }
      })
      showNotification("Votre message a été envoyé avec succès!", "success")

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.disabled = false
        submitBtn.innerHTML = "Envoyer le Message"
        submitBtn.classList.remove("form-success")
      }, 3000)
    } catch (error) {
      // Error
      submitBtn.disabled = false
      submitBtn.innerHTML = "Envoyer le Message"
      showNotification("Une erreur est survenue. Veuillez réessayer.", "error")
    }
  })
}

// Scroll Effects
function initializeScrollEffects() {
  const header = document.querySelector(".header")
  let lastScrollTop = 0

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Add scrolled class to header
    if (scrollTop > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    // Hide/show header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.style.transform = "translateY(-100%)"
    } else {
      header.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Utility Functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    info: "#3b82f6",
  }

  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Add scroll to top button
function createScrollToTopButton() {
  const btn = document.createElement("button")
  btn.innerHTML = "↑"
  btn.className = "scroll-to-top"

  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #FFD400;
    color: #222;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255, 212, 0, 0.18);
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
  `

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  // Show/hide based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      btn.style.opacity = "1"
      btn.style.visibility = "visible"
      btn.style.transform = "translateY(0)"
    } else {
      btn.style.opacity = "0"
      btn.style.visibility = "hidden"
      btn.style.transform = "translateY(20px)"
    }
  })

  btn.addEventListener("mouseenter", () => {
    btn.style.background = "#ffe066"
    btn.style.color = "#000"
    btn.style.boxShadow = "0 8px 24px rgba(255, 212, 0, 0.22)"
    btn.style.transform = "translateY(-2px) scale(1.08)"
  })

  btn.addEventListener("mouseleave", () => {
    btn.style.background = "#FFD400"
    btn.style.color = "#222"
    btn.style.boxShadow = "0 4px 16px rgba(255, 212, 0, 0.18)"
    btn.style.transform = "translateY(0)"
  })

  document.body.appendChild(btn)
}

// Small Contact Form Handler
function initializeSmallContactForm() {
  const smallContactForms = document.querySelectorAll("#smallContactForm")

  smallContactForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const email = formData.get("email")
      const subject = formData.get("subject")
      const message = formData.get("message")
      const button = form.querySelector("button")

      // Validate required fields
      if (!email || !subject || !message) {
        showNotification("Veuillez remplir tous les champs.", "error")
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showNotification("Veuillez entrer une adresse email valide.", "error")
        return
      }

      // Simulate form submission
      button.disabled = true
      button.innerHTML = "Envoi en cours..."

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Success
        button.innerHTML = "✓ Message envoyé!"
        form.reset()
        showNotification("Votre message a été envoyé avec succès! Nous vous répondrons bientôt.", "success")

        // Reset button after 3 seconds
        setTimeout(() => {
          button.disabled = false
          button.innerHTML = "Envoyer le Message"
        }, 3000)
      } catch (error) {
        // Error
        button.disabled = false
        button.innerHTML = "Envoyer le Message"
        showNotification("Une erreur est survenue. Veuillez réessayer.", "error")
      }
    })
  })
}
