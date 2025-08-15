document.addEventListener('DOMContentLoaded', () => {
  fetch('../Pages/Footer.html')
    .then(res => res.text())
    .then(data => {
      const container = document.getElementById('footer-placeholder');
      if (container) {
        container.innerHTML = data;
      } else {
        console.warn('No element with id="Footer-placeholder" found.');
      }
    })
    .catch(err => console.error('Footer load failed:', err));
});