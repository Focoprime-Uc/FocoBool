//banner
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.banner-slider');
const dots = document.querySelectorAll('.dot');

let index = 0;
let autoSlide;

/* mudar slide */
function showSlide(i){
  index = i;

  if(index >= slides.length) index = 0;
  if(index < 0) index = slides.length - 1;

  slider.style.transform = `translateX(-${index * 100}%)`;

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

/* auto */
function startAuto(){
  autoSlide = setInterval(() => {
    showSlide(index + 1);
  }, 4000);
}

function stopAuto(){
  clearInterval(autoSlide);
}

startAuto();

/* clicar nos dots */
dots.forEach((dot, i)=>{
  dot.onclick = () => {
    showSlide(i);
  }
});

/* SWIPE MOBILE */
let startX = 0;

slider.addEventListener('touchstart', e=>{
  startX = e.touches[0].clientX;
  stopAuto();
});

slider.addEventListener('touchend', e=>{
  let endX = e.changedTouches[0].clientX;

  if(startX - endX > 50){
    showSlide(index + 1);
  } else if(endX - startX > 50){
    showSlide(index - 1);
  }

  startAuto();
});

/* PAUSA AO SEGURAR */
slider.addEventListener('mouseenter', stopAuto);
slider.addEventListener('mouseleave', startAuto);

// HEADER
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if(window.scrollY > 20){
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});