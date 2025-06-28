// Navbar functionality
let isMenuOpen = false;

// Toggle mobile menu
function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    
    if (isMenuOpen) {
        // Open menu
        mobileMenu.classList.remove('max-h-0', 'opacity-0');
        mobileMenu.classList.add('max-h-96', 'opacity-100');
        
        // Change icon to X
        menuIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        `;
    } else {
        // Close menu
        mobileMenu.classList.remove('max-h-96', 'opacity-100');
        mobileMenu.classList.add('max-h-0', 'opacity-0');
        
        // Change icon back to hamburger
        menuIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        `;
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        
        // Close mobile menu if open
        if (isMenuOpen) {
            toggleMenu();
        }
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = event.target.closest('button[onclick="toggleMenu()"]');
    
    if (isMenuOpen && !mobileMenu.contains(event.target) && !menuButton) {
        toggleMenu();
    }
});

// Close mobile menu on window resize (if switching to desktop)
window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && isMenuOpen) {
        toggleMenu();
    }
});