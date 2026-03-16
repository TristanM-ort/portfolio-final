document.addEventListener("DOMContentLoaded", () => {

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
entry.target.style.opacity = 1;
entry.target.style.transform = "translateY(0)";
}
});
});

sections.forEach(section => {
section.style.opacity = 0;
section.style.transform = "translateY(40px)";
section.style.transition = "all 0.8s ease";
observer.observe(section);
});



/* MENU ACTIF */

const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
link.addEventListener("click", function(){

navLinks.forEach(l => l.classList.remove("active"));

this.classList.add("active");

});
});



/* MACHINE A ECRIRE */

const elements = document.querySelectorAll(".typewriter");

elements.forEach(element => {

const text = element.textContent.trim();

element.textContent = "";

let index = 0;

function type(){

if(index < text.length){

element.textContent += text.charAt(index);

index++;

setTimeout(type,30);

}

}

type();

});



/* MODE CLAIR / SOMBRE */

const toggleBtn = document.getElementById("theme-toggle");

if(toggleBtn){

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){

document.body.classList.add("light-mode");

toggleBtn.textContent = "🌙";

}

toggleBtn.addEventListener("click", () => {

document.body.classList.toggle("light-mode");

if(document.body.classList.contains("light-mode")){

toggleBtn.textContent = "🌙";

localStorage.setItem("theme","light");

}else{

toggleBtn.textContent = "☀️";

localStorage.setItem("theme","dark");

}

});

}

});