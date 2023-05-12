/* eslint-disable */

const hideAlert = () => {
  document.querySelector('.alert').remove();
};

export const showAlert = (type, msg) => {
  document
    .querySelector('body')
    .insertAdjacentHTML(
      'afterbegin',
      `<div class="alert alert--${type}">${msg}</div>`
    );
  setTimeout(() => {
    hideAlert();
  }, 4000);
};
