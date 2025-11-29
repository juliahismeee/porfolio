// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// ===== PHOTO UPLOAD FUNCTIONALITY =====
const photoInput = document.querySelector('#photoInput');
const photoFrame = document.querySelector('.photo-frame');
const profilePhoto = document.querySelector('#profilePhoto');
const photoUploadHint = document.querySelector('.photo-upload-hint');

if (photoFrame && photoInput) {
    // Click on frame to upload
    photoFrame.addEventListener('click', () => {
        photoInput.click();
    });

    // Click on hint to upload
    if (photoUploadHint) {
        photoUploadHint.addEventListener('click', () => {
            photoInput.click();
        });
    }

    // Handle file selection
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePhoto.src = event.target.result;
                profilePhoto.style.display = 'block';
                if (photoUploadHint) {
                    photoUploadHint.style.display = 'none';
                }
                // Save to localStorage so it persists
                localStorage.setItem('profilePhoto', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved photo from localStorage on page load
    window.addEventListener('load', () => {
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            profilePhoto.src = savedPhoto;
            profilePhoto.style.display = 'block';
            if (photoUploadHint) {
                photoUploadHint.style.display = 'none';
            }
        }
    });
}

// ===== NAVBAR BACKGROUND ON SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 0) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ===== ABOUT PAGE IMAGE UPLOAD =====
const aboutPhotoInput = document.querySelector('#aboutPhotoInput');
const aboutImage = document.querySelector('#aboutImage');
const aboutImagePlaceholder = document.querySelector('#aboutImagePlaceholder');

if (aboutPhotoInput) {
    // Clicking the placeholder opens file picker
    if (aboutImagePlaceholder) {
        aboutImagePlaceholder.addEventListener('click', () => {
            aboutPhotoInput.click();
        });
    }

    // centralize load/error behavior
    if (aboutImage) {
        aboutImage.addEventListener('load', () => {
            const icon = aboutImagePlaceholder ? aboutImagePlaceholder.querySelector('i') : null;
            if (icon) icon.style.display = 'none';
            aboutImage.classList.add('visible');
            aboutImage.style.display = 'block';
        });

        aboutImage.addEventListener('error', () => {
            aboutImage.style.display = 'none';
            const icon = aboutImagePlaceholder ? aboutImagePlaceholder.querySelector('i') : null;
            if (icon) icon.style.display = 'block';
            aboutImage.classList.remove('visible');
        });
    }

    aboutPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && aboutImage) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // set src; load handler will handle visibility/animation
                aboutImage.src = event.target.result;
                // persist the image
                try {
                    localStorage.setItem('aboutPhoto', event.target.result);
                } catch (err) {
                    console.warn('Could not save about photo to localStorage', err);
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved about photo on page load (if exists). Otherwise, the default src (me.png) will trigger load/error events.
    window.addEventListener('load', () => {
        try {
            const saved = localStorage.getItem('aboutPhoto');
            if (saved && aboutImage) {
                aboutImage.src = saved;
            } else if (aboutImage && aboutImage.complete) {
                // If the browser already loaded the image before JS attached listeners, handle it manually
                if (aboutImage.naturalWidth && aboutImage.naturalWidth > 0) {
                    const icon = aboutImagePlaceholder ? aboutImagePlaceholder.querySelector('i') : null;
                    if (icon) icon.style.display = 'none';
                    aboutImage.classList.add('visible');
                    aboutImage.style.display = 'block';
                } else {
                    // image failed to load
                    aboutImage.style.display = 'none';
                }
            }
        } catch (err) {
            // ignore localStorage errors
        }
    });
}

// ===== PROGRESS BAR ANIMATION =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.progress');
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// ===== FORM SUBMISSION =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Simple validation
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Show success message
        alert('Thank you for your message! I will get back to you soon.');

        // Reset form
        contactForm.reset();

        // In a real application, you would send this data to a server
        console.log({
            name: name,
            email: email,
            message: message
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.project-card, .stat, .skill-category');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `slideInUp 0.6s ease ${index * 0.1}s forwards`;
            entry.target.style.opacity = '0';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ===== CTA BUTTON FUNCTIONALITY =====
const ctaButton = document.querySelector('.cta-button');
if (ctaButton && !ctaButton.hasAttribute('onclick')) {
    ctaButton.addEventListener('click', () => {
        window.location.href = 'projects.html';
    });
}

// PROJECT LINKS
const projectLinks = document.querySelectorAll('.project-link');

projectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') {
            e.preventDefault();
            alert('Project details would be displayed here. This is a demo portfolio!');
        }
        // If there is a real href, let it open normally.
    });
});



// ===== TYPING ANIMATION FOR HERO SUBTITLE =====
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;

    function typeEffect() {
        if (i < originalText.length) {
            heroSubtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeEffect, 50);
        }
    }

    // Start typing when page loads
    window.addEventListener('load', () => {
        typeEffect();
    });
}

// ===== DARK MODE TOGGLE (Optional Feature) =====
// Uncomment the code below if you want to add a dark mode toggle

/*
const darkModeToggle = document.createElement('button');
darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
darkModeToggle.classList.add('dark-mode-toggle');
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Check if dark mode was previously enabled
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
*/

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statElements = document.querySelectorAll('.stat h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text);
            animateCounter(entry.target, number);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statElements.forEach(stat => {
    statsObserver.observe(stat);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%cWelcome to My Portfolio! 👋', 'font-size: 20px; color: #6c5ce7; font-weight: bold;');
console.log('%cFeel free to explore and reach out if you have any opportunities!', 'font-size: 14px; color: #666;');
