// Prevent default anchor link behavior
document.querySelectorAll('.slider-nav a').forEach((navLink) => {
    navLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor link behaviour.
        const targetSlide = document.querySelector(navLink.getAttribute('href')); //Get the target slide.
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Scroll to the slide smoothly, keeping it near the top.
    });
}); 

// To allow the form in .main class to be displayed.
document.getElementById('register-btn').addEventListener('click', () => {
    const mainContainer = document.querySelector('.main');
    mainContainer.style.display = mainContainer.style.display === 'block' ? 'none' : 'block';
});

// to highlight a link when scrooled to or clicked on.
document.addEventListener('DOMContentLoaded', () => {
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link'); 

const updateActiveLink = () => {
    sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - window.innerHeight / 3;
    const sectionBottom = sectionTop + section.offsetHeight;

if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
    navLinks.forEach((link) => link.classList.remove('active')); // Remove 'active' from all links
    navLinks[index].classList.add('active'); // Add 'active' to the link matching the section
    }
    });
};

// Update active link on scroll
window.addEventListener('scroll', updateActiveLink);
});