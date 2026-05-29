document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sections = document.querySelectorAll('section[id]');

    console.log('Filter buttons found:', filterBtns.length);
    console.log('Gallery items found:', document.querySelectorAll('.gallery-item').length);

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

            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get all gallery items
            const items = document.querySelectorAll('.gallery-item');
            console.log('Total items:', items.length);

            // Loop through each item and show/hide based on filter
            items.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                console.log('Item category:', itemCategory);

                if (selectedFilter === 'all') {
                    // Show all items
                    item.style.display = 'flex';
                } else if (itemCategory === selectedFilter) {
                    // Show items in selected category
                    item.style.display = 'flex';
                } else {
                    // Hide items not in selected category
                    item.style.display = 'none';
                }
            });
        });
    });

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
