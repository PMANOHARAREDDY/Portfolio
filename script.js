/* ==========================================================================
   SCRIPT.JS - PORTFOLIO INTERACTION LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    /* --- Header Scroll Effect --- */
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* --- Mobile Navigation Drawer --- */
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle("active");
        navMenu.classList.toggle("active");
        
        // Prevent body scrolling when mobile menu is open
        if (navMenu.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    };

    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                toggleMobileMenu();
            }
        });
    });

    /* --- Theme Toggle Manager --- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    
    // Get stored theme or default to dark
    const getSavedTheme = () => {
        const savedTheme = localStorage.getItem("manohara-portfolio-theme");
        return savedTheme ? savedTheme : "dark";
    };

    // Apply theme on load
    const currentTheme = getSavedTheme();
    document.documentElement.setAttribute("data-theme", currentTheme);

    // Toggle theme action
    themeToggleBtn.addEventListener("click", () => {
        const activeTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = activeTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("manohara-portfolio-theme", newTheme);
        
        showToast(`Switched to ${newTheme} mode`, "success");
    });

    /* --- Typewriter Effect --- */
    const typedWordsElement = document.getElementById("typed-words");
    const wordsArray = ["Software Developer", "Full-Stack Builder", "Flutter Intern", "Placement Coordinator"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const runTypewriter = () => {
        const currentWord = wordsArray[wordIndex];
        
        if (isDeleting) {
            typedWordsElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // erase faster
        } else {
            typedWordsElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // standard typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // pause at full word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % wordsArray.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(runTypewriter, typingSpeed);
    };

    if (typedWordsElement) {
        runTypewriter();
    }

    /* --- Scroll Spy / Intersection Observer for Navigation --- */
    const sections = document.querySelectorAll("section");
    
    const navObserverOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // triggers when section is in the upper middle area of screen
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute("id");
                
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right");
    
    const revealObserverOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // trigger when 15% visible
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once animated
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));

    /* --- Project Category Filter --- */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active from all
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                // Add fade-out state before display changes
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                
                setTimeout(() => {
                    if (filterValue === "all" || category === filterValue) {
                        card.classList.remove("hide");
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        }, 50);
                    } else {
                        card.classList.add("hide");
                    }
                }, 300);
            });
        });
    });

    /* --- Scroll To Top Button --- */
    const scrollToTopBtn = document.getElementById("scroll-to-top");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add("active");
        } else {
            scrollToTopBtn.classList.remove("active");
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    /* --- Toast Notification System --- */
    const toastContainer = document.getElementById("toast-container");

    const showToast = (message, type = "success") => {
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        
        const icon = type === "success" 
            ? '<i class="fa-solid fa-circle-check"></i>' 
            : '<i class="fa-solid fa-circle-exclamation"></i>';
            
        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = "slideInToast 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    };

    /* --- Contact Form Handler --- */
    const contactForm = document.getElementById("contact-form");
    
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("form-name").value.trim();
            const email = document.getElementById("form-email").value.trim();
            const phone = document.getElementById("form-phone").value.trim();
            const subject = document.getElementById("form-subject").value.trim();
            const message = document.getElementById("form-message").value.trim();
            
            // Simple validation
            if (!name || !email || !phone || !subject || !message) {
                showToast("Please fill in all fields", "warning");
                return;
            }

            // Button Loading State
            const submitBtn = contactForm.querySelector(".btn-submit");
            const btnSpan = submitBtn.querySelector("span");
            const btnIcon = submitBtn.querySelector("i");
            
            const originalText = btnSpan.textContent;
            const originalIconClass = btnIcon.className;
            
            btnSpan.textContent = "Sending...";
            btnIcon.className = "fa-solid fa-spinner fa-spin";
            submitBtn.style.pointerEvents = "none";

            // Trigger Email (FormSubmit) and Telegram Alert (Vercel API) concurrently
            const emailPromise = fetch("https://formsubmit.co/ajax/manoharareddyp97@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    _subject: `New Portfolio Message: ${subject}`,
                    message: message
                })
            }).then(r => r.json());

            const telegramPromise = fetch("/api/send-telegram", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message
                })
            }).then(r => r.json()).catch(err => ({ success: false, error: err }));

            Promise.all([emailPromise, telegramPromise])
            .then(([emailResult, telegramResult]) => {
                if (emailResult.success === "true" || emailResult.success === true) {
                    let successMsg = `Thanks, ${name}! Your message has been sent successfully.`;
                    if (telegramResult.success) {
                        successMsg += " Telegram alert sent.";
                    }
                    showToast(successMsg, "success");
                    contactForm.reset();
                    
                    // Clear inputs blur states
                    const inputs = contactForm.querySelectorAll("input, textarea");
                    inputs.forEach(input => {
                        input.blur();
                    });
                } else {
                    showToast("Failed to send message. Please try again.", "warning");
                }
            })
            .catch(error => {
                console.error("Transmission error:", error);
                showToast("Connection error. Please try again later.", "warning");
            })
            .finally(() => {
                // Restore button state
                btnSpan.textContent = originalText;
                btnIcon.className = originalIconClass;
                submitBtn.style.pointerEvents = "auto";
            });
        });
    }
});
