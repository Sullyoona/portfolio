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
