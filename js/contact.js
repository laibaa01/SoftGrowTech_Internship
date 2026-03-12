const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  const original = btn.textContent;

  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#4ade80';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
    contactForm.reset();
  }, 3000);
});
