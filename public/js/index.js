/* eslint-disable */

import 'core-js/stable';
import { login, logout } from './login';
import { displayMap } from './leafletMap';
import { updatePassword, updateSettings, forgotPassword } from './account';
import { bookTour } from './booking';

// DOM Elements
const loginForm = document.querySelector('.login-form form');
const accSettingsForm = document.querySelector('.form-user-data');
const accPasswordForm = document.querySelector('.form-user-settings');
const emailForm = document.querySelector('.email-form form');
const reviewForm = document.querySelector('.review-form form');

const map = document.getElementById('map');

//tabs
const sideNav = document.querySelector('.side-nav');
const sideNavBtns = document.querySelectorAll('.side-nav__item');
const userTabs = document.querySelectorAll('.user-tab');

const btnLogOut = document.querySelector('.nav__el--logout');
const btnBookTour = document.getElementById('bookTourBtn');

// --- Delegation ---

// Login form
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    login(email, password);
  });
}

// Password forgot email form
if (emailForm) {
  emailForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = e.target.elements.email.value;

    forgotPassword(email);
  });
}

// Settings form
if (accSettingsForm) {
  accSettingsForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', e.target.elements.name.value);
    formData.append('email', e.target.elements.email.value);
    formData.append('photo', e.target.elements.photo.files[0]);

    updateSettings(formData);
  });
}

// Password form
if (accPasswordForm) {
  accPasswordForm.addEventListener('submit', e => {
    e.preventDefault();

    const passwordCurrent = e.target.elements.passwordCurrent.value;
    const password = e.target.elements.password.value;
    const passwordConfirm = e.target.passwordConfirm.value;

    updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'update-password'
    );
  });
}

// Review form
if (reviewForm) {
  const ratingEl = document.getElementById('ratingValue');

  reviewForm.querySelector('#rating').addEventListener('input', e => {
    ratingEl.textContent = e.target.value;
  });
}

if (sideNav) {
  sideNav.addEventListener('click', e => {
    // Get the target
    const target = e.target.closest('.side-nav__item');
    if (!target) return;

    const id = target.dataset.id;

    // Remove all active states
    sideNavBtns.forEach((btn, i) => {
      btn.classList.remove(`side-nav--active`);
      userTabs[i].classList.remove(`user-tab--active`);
    });

    // Add active state to a btn and tab
    document
      .querySelector(`.side-nav__item--${id}`)
      .classList.add('side-nav--active');
    document
      .querySelector(`.user-tab--${id}`)
      .classList.add('user-tab--active');
  });
}

// Map display
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

// Log out btn
if (btnLogOut) {
  btnLogOut.addEventListener('click', logout);
}

// Book tour btn
if (btnBookTour) {
  btnBookTour.addEventListener('click', e => {
    e.target.textContent = 'Proccessing...';
    const tourId = e.target.dataset.tourid;

    bookTour(tourId);
  });
}
