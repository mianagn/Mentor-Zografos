// Typewriter Effect using TypewriterJS
// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing typewriter...');
    
    // Initialize TypewriterJS
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const typewriter = new Typewriter(typewriterElement, {
            loop: false,
            delay: 75,
            cursor: '|',
            deleteSpeed: 50,
        });

        typewriter
            .pauseFor(800)
            .typeString('Τα πάντα για σένα και την επιχείρησή σου!')
            .start();
    }
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Contact Form Handling with EmailJS
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        gdprConsent: formData.get('gdprConsent')
    };

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
        alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.');
        return;
    }

    if (!data.gdprConsent) {
        alert('Παρακαλώ αποδεχτείτε την πολιτική προστασίας δεδομένων.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Παρακαλώ εισάγετε έγκυρη διεύθυνση email.');
        return;
    }

    // Show loading state
    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Αποστολή...';
    submitBtn.disabled = true;

    // EmailJS configuration
    const serviceID = 'YOUR_SERVICE_ID'; // You'll get this from EmailJS
    const templateID = 'YOUR_TEMPLATE_ID'; // You'll get this from EmailJS
    const publicKey = 'YOUR_PUBLIC_KEY'; // You'll get this from EmailJS

    // Template parameters for EmailJS
    const templateParams = {
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        phone: data.phone,
        message: data.message || 'Δεν υπάρχει μήνυμα',
        to_email: 'mixalisanagnostou2003@gmail.com', // Your email for testing
        reply_to: data.email
    };

    // Send email using EmailJS
    emailjs.send(serviceID, templateID, templateParams, publicKey)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Ευχαριστούμε για το μήνυμά σας! Θα επικοινωνήσουμε μαζί σας σύντομα.');
            
            // Reset form
            document.getElementById('contactForm').reset();
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            alert('Σφάλμα κατά την αποστολή. Παρακαλώ δοκιμάστε ξανά ή επικοινωνήστε μαζί μας απευθείας.');
        })
        .finally(function() {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.product-category, .service-item, .feature, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Active Navigation Link Highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroPattern = document.querySelector('.hero-pattern');
    if (heroPattern) {
        heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Loading Animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for active nav link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #22c55e !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// // Initialize typing effect when page loads
// document.addEventListener('DOMContentLoaded', function() {
//     // This functionality is already handled by the main typewriter function above
// });

// Add smooth hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Form input focus effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// Add CSS for form focus effects
const formStyle = document.createElement('style');
formStyle.textContent = `
    .form-group.focused input,
    .form-group.focused textarea {
        border-color: #22c55e;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
`;
document.head.appendChild(formStyle);

// Special Offer Popup Functionality
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('specialOfferPopup');
    const closeBtn = document.getElementById('popupClose');
    
    if (popup && closeBtn) {
        // Minimize popup when close button is clicked
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            popup.classList.add('minimized');
        });
        
        // Expand popup when minimized popup is clicked
        popup.addEventListener('click', function(e) {
            if (popup.classList.contains('minimized')) {
                e.preventDefault();
                popup.classList.remove('minimized');
            }
        });
        
        // Prevent popup content clicks from minimizing
        const offerContent = popup.querySelector('.offer-content');
        if (offerContent) {
            offerContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
});
