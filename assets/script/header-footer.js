'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const bxMenu = document.querySelector('.bx-menu');
  const bxX = document.querySelector('.bx-x');
  const navBar = document.querySelector('.nav');

  // --- open menu ---
  bxMenu.addEventListener('click', (e) => {
    if (e.target === bxMenu) {
      navBar.classList.add('show-navbar');
      bxMenu.classList.add('hide-bx');
      bxX.classList.add('show-bx');
    }
  });

  // --- close menu ---
  bxX.addEventListener('click', (e) => {
    if (e.target === bxX) {
      navBar.classList.remove('show-navbar');
      bxMenu.classList.remove('hide-bx');
      bxX.classList.remove('show-bx');
    }
  });
});
