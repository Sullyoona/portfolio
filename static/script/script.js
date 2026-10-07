document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sections = document.querySelectorAll('section[id]');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const galleryPagination = document.getElementById('galleryPagination');
    const galleryPageNumbers = document.getElementById('galleryPageNumbers');
    const galleryPrevBtn = document.getElementById('galleryPrev');
    const galleryNextBtn = document.getElementById('galleryNext');
    const galleryItemsPerPage = 6;
    let activeGalleryFilter = 'all';
    let currentGalleryPage = 1;

    const defaultAllButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (defaultAllButton) {
        filterBtns.forEach(button => button.classList.remove('active'));
        defaultAllButton.classList.add('active');
    }

    console.log('Filter buttons found:', filterBtns.length);
    console.log('Gallery items found:', galleryItems.length);

    function updateGalleryDisplay() {
        const filteredItems = galleryItems.filter(item => {
            return activeGalleryFilter === 'all' || item.getAttribute('data-category') === activeGalleryFilter;
        });

        if (activeGalleryFilter !== 'all') {
            galleryItems.forEach(item => {
                const match = item.getAttribute('data-category') === activeGalleryFilter;
                item.style.display = match ? 'flex' : 'none';
            });

            if (galleryPagination) {
                galleryPagination.classList.remove('visible');
            }
            return;
        }

        const totalPages = Math.max(1, Math.ceil(filteredItems.length / galleryItemsPerPage));
        currentGalleryPage = Math.min(currentGalleryPage, totalPages);

        galleryItems.forEach(item => {
            item.style.display = 'none';
        });

        const startIndex = (currentGalleryPage - 1) * galleryItemsPerPage;
        const endIndex = startIndex + galleryItemsPerPage;

        filteredItems.slice(startIndex, endIndex).forEach(item => {
            item.style.display = 'flex';
        });

        if (galleryPageNumbers) {
            galleryPageNumbers.innerHTML = '';

            for (let page = 1; page <= totalPages; page++) {
                const pageBtn = document.createElement('button');
                pageBtn.type = 'button';
                pageBtn.className = 'pagination-number' + (page === currentGalleryPage ? ' active' : '');
                pageBtn.textContent = page;
                pageBtn.setAttribute('aria-label', `Go to page ${page}`);
                pageBtn.addEventListener('click', () => {
                    currentGalleryPage = page;
                    updateGalleryDisplay();
                });
                galleryPageNumbers.appendChild(pageBtn);
            }
        }

        if (galleryPrevBtn) {
            galleryPrevBtn.disabled = currentGalleryPage === 1;
        }

        if (galleryNextBtn) {
            galleryNextBtn.disabled = currentGalleryPage === totalPages;
        }

        if (galleryPagination) {
            galleryPagination.classList.toggle('visible', filteredItems.length > galleryItemsPerPage);
        }
    }

    if (galleryPrevBtn) {
        galleryPrevBtn.addEventListener('click', () => {
            if (currentGalleryPage > 1) {
                currentGalleryPage -= 1;
                updateGalleryDisplay();
            }
        });
    }

    if (galleryNextBtn) {
        galleryNextBtn.addEventListener('click', () => {
            const filteredItems = galleryItems.filter(item => item.getAttribute('data-category') === activeGalleryFilter || activeGalleryFilter === 'all');
            const totalPages = Math.max(1, Math.ceil(filteredItems.length / galleryItemsPerPage));

            if (currentGalleryPage < totalPages) {
                currentGalleryPage += 1;
                updateGalleryDisplay();
            }
        });
    }

    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                updateNavActive(targetId);
            }
        });
    });

    // Gallery filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Get the filter value from data-filter attribute
            const selectedFilter = this.getAttribute('data-filter');
            console.log('Filter clicked:', selectedFilter);
            activeGalleryFilter = selectedFilter;
            currentGalleryPage = 1;

            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            updateGalleryDisplay();
        });
    });

    updateGalleryDisplay();

    // Resume request button functionality
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function () {
            const originalText = this.textContent;

            // Ask for inputs
            const name = prompt('Enter your name:');
            const email = prompt('Enter your email:');

            // Stop if user cancels
            if (name === null || email === null) {
                return;
            }

            // Remove extra spaces
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();

            // Validation
            if (!trimmedName || !trimmedEmail) {
                alert('Please fill in both name and email.');
                return;
            }

            // Optional email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(trimmedEmail)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Disable button while sending
            this.disabled = true;
            this.textContent = 'Sending...';
            const visitorData = {
                name: trimmedName,
                email: trimmedEmail
            };
            fetch('/request-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visitorData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.textContent = '✓ Request Sent!';
                } else {
                    this.textContent = 'Error - Try again';
                }
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
                this.textContent = 'Error - Try again';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            });
        });
    }

// Contact form functionality
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');

    if (contactSubmitBtn) {
        contactSubmitBtn.addEventListener('click', function () {

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            const status = document.getElementById('contactStatus');

            // Basic validation
            if (!name || !email || !subject || !message) {
                status.textContent = 'Please fill in all fields.';
                return;
            }

            // Disable button while sending
            this.disabled = true;
            this.textContent = 'Sending...';

            fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            })
            .then(response => response.json())
            .then(data => {

                if (data.success) {

                    status.textContent = '✓ Message sent successfully!';

                    // Clear form
                    document.getElementById('contactName').value = '';
                    document.getElementById('contactEmail').value = '';
                    document.getElementById('contactSubject').value = '';
                    document.getElementById('contactMessage').value = '';

                } else {
                    status.textContent = 'Failed to send message.';
                }

                this.disabled = false;
                this.textContent = 'Send Message';
            })
            .catch(error => {
                console.error(error);

                status.textContent = 'Something went wrong.';

                this.disabled = false;
                this.textContent = 'Send Message';
            });

        });
    }

    function updateNavActive(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
                console.log('Active nav updated to:', targetId);
            }
        });
    }

    // Update nav active state on scroll
    window.addEventListener('scroll', function() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        if (currentSection) {
            updateNavActive(currentSection);
        }
    });

    // Set initial active nav
    updateNavActive('#hero');
});

document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// ── INTERNSHIP CAROUSEL ──
(function () {
    const track   = document.getElementById('carouselTrack');
    const dotsWrap = document.getElementById('carouselDots');
    if (!track) return;
 
    const slides  = track.querySelectorAll('.carousel-slide');
    const total   = slides.length;
    let current   = 0;
 
    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });
 
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
 
    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
 
    document.querySelector('.carousel-prev')
        .addEventListener('click', () => goTo(current - 1));
    document.querySelector('.carousel-next')
        .addEventListener('click', () => goTo(current + 1));
 
    // Swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });
})();
 
// ── INTERNSHIP LIGHTBOX ──
(function () {
    const lightbox      = document.getElementById('internshipLightbox');
    const lightboxImg   = document.getElementById('internshipLightboxImg');
    const lightboxClose = document.getElementById('internshipLightboxClose');
    if (!lightbox) return;
 
    document.querySelectorAll('.internship-lightbox-trigger').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });
 
    function close() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }
 
    lightboxClose.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) close();
    });
})();