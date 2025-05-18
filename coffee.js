
document.querySelectorAll('.slider-nav a').forEach((navLink) => {
    navLink.addEventListener('click', () => {
        const targetSlide = document.querySelector(navLink.getAttribute('href')); 
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
    });
}); 


document.getElementById('register-btn').addEventListener('click', () => {
    const mainContainer = document.querySelector('.main');
    mainContainer.style.display = mainContainer.style.display === 'block' ? 'none' : 'block';
});


document.addEventListener('DOMContentLoaded', () => {
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link'); 

const updateActiveLink = () => {
    sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - window.innerHeight / 3;
    const sectionBottom = sectionTop + section.offsetHeight;

if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
    navLinks.forEach((link) => link.classList.remove('active')); 
    navLinks[index].classList.add('active'); 
    }
    });
};


window.addEventListener('scroll', updateActiveLink);
});


//Slides JS codes
let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

next.addEventListener('click', function(){
    let items = document.querySelectorAll('.item'); 
    document.querySelector('.slide').appendChild(items[0]); 
});

prev.addEventListener('click', function(){
    let items = document.querySelectorAll('.item'); 
    document.querySelector('.slide').prepend(items[items.length - 1]); 
});


window.addEventListener("message", function(event) {
    if (event.data === "redirectToHome") {
        window.location.href = "http://127.0.0.1:5500/CRUD-2025/public/Food-API/index.html";
    }
});

document.querySelectorAll(".fa-xmark").forEach(icon => {
    icon.addEventListener("click", () =>{
        icon.parentElement.remove();
    });
});