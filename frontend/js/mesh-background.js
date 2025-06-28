// Generate diagonal lines
function createDiagonalLines() {
    const container1 = document.getElementById('diagonal-lines-1');
    const container2 = document.getElementById('diagonal-lines-2');
    for (let i = 0; i < 6; i++) {
        const line1 = document.createElement('div');
        line1.className = 'absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent diagonal-line-1';
        line1.style.top = `${i * 16.67}%`;
        line1.style.transform = 'rotate(15deg)';
        line1.style.transformOrigin = 'left center';
        line1.style.animationDelay = `${i * 1.2}s`;
        container1.appendChild(line1);
        const line2 = document.createElement('div');
        line2.className = 'absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400/15 to-transparent diagonal-line-2';
        line2.style.top = `${i * 16.67}%`;
        line2.style.transform = 'rotate(-15deg)';
        line2.style.transformOrigin = 'right center';
        line2.style.animationDelay = `${i * 0.8}s`;
        container2.appendChild(line2);
    }
}
// Generate horizontal lines
function createHorizontalLines() {
    const container = document.getElementById('horizontal-lines');
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400/10 to-transparent slide-right';
        line.style.top = `${(i + 1) * 20}%`;
        line.style.animationDelay = `${i * 2}s`;
        container.appendChild(line);
    }
}
// Generate vertical lines
function createVerticalLines() {
    const container = document.getElementById('vertical-lines');
    for (let i = 0; i < 4; i++) {
        const line = document.createElement('div');
        line.className = 'absolute h-full w-px bg-gradient-to-b from-transparent via-blue-400/8 to-transparent slide-down';
        line.style.left = `${(i + 1) * 20}%`;
        line.style.animationDelay = `${i * 3}s`;
        container.appendChild(line);
    }
}
// Generate intersection points
function createIntersectionPoints() {
    const container = document.getElementById('intersection-points');
    for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'absolute w-1 h-1 bg-purple-400/40 rounded-full pulse-dot';
        dot.style.left = `${(i % 5) * 20 + 10}%`;
        dot.style.top = `${Math.floor(i / 5) * 25 + 12.5}%`;
        dot.style.animationDelay = `${i * 0.3}s`;
        dot.style.filter = 'drop-shadow(0 0 2px rgba(147, 51, 234, 0.5))';
        container.appendChild(dot);
    }
}
// Initialize all elements when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
    createDiagonalLines();
    createHorizontalLines();
    createVerticalLines();
    createIntersectionPoints();
});
// Add mouse interaction for spotlight effects
window.addEventListener('mousemove', function(e) {
    const spotlightMain = document.querySelector('.spotlight-main');
    const spotlightSecondary = document.querySelector('.spotlight-secondary');
    const spotlightFocus = document.querySelector('.spotlight-focus');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    // Subtle mouse following effect
    if (spotlightMain) {
        spotlightMain.style.left = `${x * 100}%`;
        spotlightMain.style.top = `${y * 100}%`;
    }
    if (spotlightSecondary) {
        spotlightSecondary.style.left = `${(1 - x) * 100}%`;
        spotlightSecondary.style.top = `${(1 - y) * 100}%`;
    }
    if (spotlightFocus) {
        spotlightFocus.style.left = `${(x + 0.1) * 100}%`;
        spotlightFocus.style.top = `${(y + 0.1) * 100}%`;
    }
}); 