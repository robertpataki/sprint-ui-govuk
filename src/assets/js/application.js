/* global $, window, document */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Import NHSUK modules
import govukAll from 'govuk-frontend/govuk/all';

// Import custom modules
import todaysDate from './modules/todaysDate';
import AlertDialog from './modules/alert-dialog';

// Expose $ on window
window.$ = $;
window.AlertDialog = AlertDialog;

// Initialise GOVUK components
govukAll.initAll();

// Render today's date into the appropriate elements on the page
const todaysDateEls = document.querySelectorAll('[data-module="todays-date"]');
todaysDateEls.forEach((el) => {
  el.innerText = todaysDate();
});

/* let alertDialogOne = new AlertDialog({
  title: 'Hello world',
  warningText: 'This is a warning',
  questionText: 'This is a question, what about it?',
  confirmLabel: 'Persze',
  rejectLabel: 'Tuti nem',
}); */
/* const alertDialogTwo = new AlertDialog({
  title: 'Alert - 2',
});
const alertDialogThree = new AlertDialog({
  title: 'Alert - 3',
}); */

/* setTimeout(() => {
  alertDialogOne.open(() => {
    console.log('[TEST] - alertDialogOne - CONFIRMED');
    alertDialogOne = null;
  }, () => {
    console.log('[TEST] - alertDialogOne - REJECTED');
    alertDialogOne = null;
  });
}, 3000); */

/* setTimeout(() => {
  alertDialogTwo.open(() => {
    console.log('[TEST] - alertDialogTwo - CONFIRMED');
  }, () => {
    console.log('[TEST] - alertDialogTwo - REJECTED');
  });
}, 5000);

setTimeout(() => {
  alertDialogThree.open(() => {
    console.log('[TEST] - alertDialogThree - CONFIRMED');
  }, () => {
    console.log('[TEST] - alertDialogThree - REJECTED');
  });
}, 7000); */

/* var $alertDialogs = Array.from(document.querySelectorAll('[data-module="govuk-alert-dialog"]'));
console.log($alertDialogs);
$alertDialogs.forEach(function ($alertDialog) {
  console.log();
  const config = {
    title: $alertDialog.getAttribute('data-title'),
    warningText: $alertDialog.getAttribute('data-warning-text'),
    questionText: $alertDialog.getAttribute('data-question-text'),
    confirmLabel: $alertDialog.getAttribute('data-confirm-label'),
    rejectLabel: $alertDialog.getAttribute('data-reject-label'),
  };
}); */
