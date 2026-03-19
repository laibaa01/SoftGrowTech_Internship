/* ================================================
   WANDERLUX — script.js
   ================================================ */

/* ------------------------------------------------
   1. HERO SLIDER — Simple & Guaranteed Working
   ------------------------------------------------ */
var currentSlide = 0;
var slides = [];
var dots = [];
var sliderTimer = null;
var SLIDE_DELAY = 3500;

function showSlide(index) {
  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active');
  }
  for (var j = 0; j < dots.length; j++) {
    dots[j].classList.remove('active');
  }

  if (index >= slides.length) index = 0;
  if (index < 0) index = slides.length - 1;
  currentSlide = index;

  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');

  var bar = document.getElementById('progressBar');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    setTimeout(function() {
      bar.style.transition = 'width ' + SLIDE_DELAY + 'ms linear';
      bar.style.width = '100%';
    }, 50);
  }
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide()  { showSlide(currentSlide - 1); }

function startAutoPlay() {
  if (sliderTimer) clearInterval(sliderTimer);
  sliderTimer = setInterval(nextSlide, SLIDE_DELAY);
}

function initSlider() {
  slides = document.querySelectorAll('.hero__slide');
  dots   = document.querySelectorAll('.hero__dot');
  if (slides.length === 0) return;

  var nextBtn = document.getElementById('nextBtn');
  var prevBtn = document.getElementById('prevBtn');

  if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); startAutoPlay(); });

  for (var i = 0; i < dots.length; i++) {
    (function(idx) {
      dots[idx].addEventListener('click', function() { showSlide(idx); startAutoPlay(); });
    })(i);
  }

  // Touch swipe
  var touchX = 0;
  var hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('touchstart', function(e) { touchX = e.changedTouches[0].clientX; });
    hero.addEventListener('touchend',   function(e) {
      var diff = touchX - e.changedTouches[0].clientX;
      if (diff > 50)  { nextSlide(); startAutoPlay(); }
      if (diff < -50) { prevSlide(); startAutoPlay(); }
    });
  }

  showSlide(0);
  startAutoPlay();
}

/* ------------------------------------------------
   2. NAVIGATION
   ------------------------------------------------ */
function initNav() {
  var nav    = document.getElementById('nav');
  var burger = document.getElementById('burger');
  if (!nav) return;

  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  if (burger) {
    burger.addEventListener('click', function() {
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
  }

  nav.querySelectorAll('.nav__links a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ------------------------------------------------
   3. TESTIMONIALS SLIDER
   ------------------------------------------------ */
function initTestimonials() {
  var track   = document.getElementById('testiTrack');
  var prevBtn = document.getElementById('testiPrev');
  var nextBtn = document.getElementById('testiNext');
  var dotBtns = [];
  if (!track) return;

  var cards   = track.querySelectorAll('.testi-card');
  var total   = cards.length;
  var current = 0;

  function getVisible() {
    if (window.innerWidth < 480)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function slideTo(index) {
    var visible = getVisible();
    var max = total - visible;
    if (index < 0) index = 0;
    if (index > max) index = max;
    current = index;

    // Get gap from CSS (1.5rem = 24px) + full card width including gap
    var trackWidth = track.offsetWidth;
    var gap = 24;
    var cardWidth = (trackWidth - (gap * (visible - 1))) / visible;

    track.style.transform = 'translateX(-' + (current * (cardWidth + gap)) + 'px)';
    dotBtns.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  if (prevBtn) prevBtn.addEventListener('click', function() { slideTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { slideTo(current + 1); });
  dotBtns.forEach(function(d, i) { d.addEventListener('click', function() { slideTo(i); }); });
  window.addEventListener('resize', function() { slideTo(current); });
}

/* ------------------------------------------------
   4. SCROLL REVEAL
   ------------------------------------------------ */
function initScrollReveal() {
  var selectors = ['.why-card','.dest-card','.pkg-card','.testi-card','.section__header','.contact__info','.contact__form','.stat'];
  selectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el, i) {
      el.classList.add('reveal');
      if (i < 5) el.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
}

/* ------------------------------------------------
   5. COUNT UP
   ------------------------------------------------ */
function initCountUp() {
  var nums = document.querySelectorAll('.stat__num');
  if (!nums.length) return;

  function animateNum(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var start  = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1800, 1);
      var e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p;
      var v = Math.round(e * target);
      el.textContent = v >= 1000 ? (v/1000).toFixed(1).replace('.0','')+'k' : v;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target >= 1000 ? (target/1000).toFixed(1).replace('.0','')+'k' : target;
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { animateNum(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });

  nums.forEach(function(n) { observer.observe(n); });
}

/* ------------------------------------------------
   6. CONTACT FORM
   ------------------------------------------------ */
function initContactForm() {
  var form    = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn = form.querySelector('.btn--submit');
    var txt = btn.querySelector('.btn__text');
    btn.disabled = true;
    txt.textContent = 'Sending…';
    setTimeout(function() {
      btn.disabled = false;
      txt.textContent = 'Send My Enquiry';
      if (success) success.classList.add('show');
      form.reset();
      setTimeout(function() { if (success) success.classList.remove('show'); }, 5000);
    }, 1800);
  });
}

/* ------------------------------------------------
   7. NEWSLETTER
   ------------------------------------------------ */
function initNewsletter() {
  var form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var input = form.querySelector('input');
    var btn   = form.querySelector('button');
    if (!input.value.trim()) return;
    btn.textContent = '✓';
    btn.style.background = '#2a9d5c';
    input.value = '';
    input.placeholder = "You're subscribed!";
    setTimeout(function() {
      btn.textContent = '→';
      btn.style.background = '';
      input.placeholder = 'Your email…';
    }, 3000);
  });
}

/* ------------------------------------------------
   START — window.onload guarantees DOM is ready
   ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', function() {
  initSlider();
  initNav();
  initTestimonials();
  initScrollReveal();
  initCountUp();
  initContactForm();
  initNewsletter();
});
