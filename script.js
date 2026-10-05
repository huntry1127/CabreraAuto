const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
menu.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('header')) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
const appointmentDialog = document.querySelector('#appointment-dialog');
document.querySelectorAll('.appointment').forEach(button => button.addEventListener('click', () => { closeMenu(); appointmentDialog.showModal(); document.body.classList.add('dialog-open'); }));
document.querySelector('.dialog-close').addEventListener('click', () => appointmentDialog.close());
appointmentDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
appointmentDialog.addEventListener('click', event => { if (event.target === appointmentDialog) { const box = appointmentDialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) appointmentDialog.close(); } });
