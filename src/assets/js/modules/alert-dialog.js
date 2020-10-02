/*
 Accessible Alert Dialog component for GovUK Front-end
 by Rob Pataki <robert@robertpataki.com>.
 The implementation is based on the detailed criteria
 defined by Hanna Laakso. The crtieria can be found here:
 (https://github.com/alphagov/govuk-design-system-backlog/issues/30#issuecomment-553932293).
*/

/* global document performance */
export default class AlertDialog {
  constructor(params) {
    this.init(params);

    return this;
  }

  init(params) {
    AlertDialog.bodyEl = document.body;
    AlertDialog.htmlEl = document.querySelector('html');
    AlertDialog.rootEls = Array.from(AlertDialog.bodyEl.childNodes).filter((el) => {
      if (el.tagName && el.tagName !== 'SCRIPT' && el.className && el.className.indexOf('govuk-alert-dialogs') < 0) {
        return el;
      }
      return null;
    });

    this.id = AlertDialog.uid();
    this.template = AlertDialog.createDOM(this.id, params);

    // Create the parent element of all alerts
    this.rootEl = document.querySelector('.govuk-alert-dialogs');
    if (!this.rootEl) {
      this.rootEl = document.createElement('div');
      this.rootEl.classList.add('govuk-alert-dialogs');
      document.body.appendChild(this.rootEl);
    }

    this.onKeyDownBind = this.onKeyDown.bind(this);
    this.onKeyUpBind = this.onKeyUp.bind(this);
    this.onConfirmButtonClickBind = this.onConfirmButtonClick.bind(this);
    this.onRejectButtonClickBind = this.onRejectButtonClick.bind(this);
    this.onCloseButtonClickBind = this.onCloseButtonClick.bind(this);
  }

  open(confirmCallback, rejectCallback) {
    this.confirmCallback = confirmCallback;
    this.rejectCallback = rejectCallback;

    // Container element
    this.rootEl.insertAdjacentHTML('beforeend', this.template);

    // Dialog element
    this.dialogEl = document.querySelector(`#${this.id}`);

    // Buttons
    this.closeButton = this.dialogEl.querySelector('.govuk-alert-dialog__close-button');
    this.confirmButton = this.dialogEl.querySelector('.govuk-alert-dialog__confirm-button');
    this.rejectButton = this.dialogEl.querySelector('.govuk-alert-dialog__reject-button');

    /* Cache the active element, so that we can restore the focus
     when the dialog is closed */
    this.cachedActiveElement = document.activeElement;
    AlertDialog.activeElement = this.cachedActiveElement;

    this.buttons = [this.confirmButton, this.rejectButton, this.closeButton];
    this.activeButtonIndex = 0;

    this.isOpen = true;
    AlertDialog.onDialogOpen(this);
  }

  close() {
    this.dialogEl.parentNode.removeChild(this.dialogEl);

    this.isOpen = false;
    AlertDialog.onDialogClose(this);
  }

  activate() {
    document.addEventListener('keydown', this.onKeyDownBind);
    document.addEventListener('keyup', this.onKeyUpBind);
    this.confirmButton.addEventListener('click', this.onConfirmButtonClickBind);
    this.rejectButton.addEventListener('click', this.onRejectButtonClickBind);
    this.closeButton.addEventListener('click', this.onCloseButtonClickBind);

    // Restore the focus internally
    setTimeout(() => {
      this.buttons[this.activeButtonIndex].focus();
    }, 10);
  }

  deactivate() {
    document.removeEventListener('keydown', this.onKeyDownBind);
    document.removeEventListener('keyup', this.onKeyUpBind);
    this.confirmButton.removeEventListener('click', this.onConfirmButtonClickBind);
    this.rejectButton.removeEventListener('click', this.onRejectButtonClickBind);
    this.closeButton.removeEventListener('click', this.onCloseButtonClickBind);
  }

  onKeyDown(event) {
    if (typeof this.activeButtonIndex === 'undefined') {
      this.activeButtonIndex = 0;
    }

    if (event.keyCode === AlertDialog.keyCodes.SHIFT) {
      this.shiftDirection = true;
    }

    if (event.keyCode === AlertDialog.keyCodes.ESCAPE) {
      this.close();
    } else if (event.keyCode === AlertDialog.keyCodes.TAB) {
      event.preventDefault();
      event.stopPropagation();

      if (!this.shiftDirection) {
        this.activeButtonIndex = this.activeButtonIndex < this.buttons.length - 1
        ? this.activeButtonIndex + 1 : 0;
      } else {
        this.activeButtonIndex = this.activeButtonIndex > 0
        ? this.activeButtonIndex - 1 : this.buttons.length - 1;
      }

      this.buttons[this.activeButtonIndex].focus();
    }
  }

  onKeyUp(event) {
    if (event.keyCode === AlertDialog.keyCodes.SHIFT) {
      this.shiftDirection = false;
    }
  }

  onConfirmButtonClick() {
    this.close();
    if (this.confirmCallback && typeof this.confirmCallback === 'function') {
      this.confirmCallback.call(this);
    }
  }

  onRejectButtonClick() {
    this.close();
    if (this.rejectCallback && typeof this.rejectCallback === 'function') {
      this.rejectCallback.call(this);
    }
  }

  onCloseButtonClick() {
    // Close = Confirm
    this.onConfirmButtonClick();
  }
}

// Static methods and properties
AlertDialog.dialogs = [];
AlertDialog.keyCodes = {
  ESCAPE: 27,
  TAB: 9,
  SHIFT: 16,
};

AlertDialog.uid = () => `govuk-alert-dialog-${(performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, '')}`;

AlertDialog.createDOM = (id, params = {}) => {
  const title = params.title ? params.title : 'Warning';
  const warningText = params.warningText ? params.warningText : 'This is a generic warning message.';
  const warningHtml = params.warningHtml ? params.warningHtml : `<p>${warningText}</p>`;
  const questionText = params.questionText ? params.questionText : 'Would you like to continue?';
  const questionHtml = params.questionHtml ? params.questionHtml : `<p>${questionText}</p>`;
  const confirmLabel = params.confirmLabel ? params.confirmLabel : 'Yes';
  const rejectLabel = params.rejectLabel ? params.rejectLabel : 'No';

  return `<div class="govuk-alert-dialog" id="${id}" role="alertdialog" aria-modal="true" aria-labelledby="${id}-label" aria-describedby="${id}-description" tabindex="0">
    <div class="govuk-alert-dialog__box">
      <div class="govuk-alert-dialog__header">
        <span class="govuk-alert-dialog__title">
          <svg aria-hidden="true" focusable="false" class="govuk-header__logotype-crown" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 97" height="30" width="36">
            <path fill="currentColor" fill-rule="evenodd" d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z"></path>
            <image src="/assets/images/govuk-logotype-crown.png" xlink:href="" class="govuk-header__logotype-crown-fallback-image" width="36" height="32"></image>
          </svg>
          <h2 class="govuk-alert-dialog__title-text" id="${id}-label">${title}</h2>
        </span>
        <button class="govuk-alert-dialog__close-button" aria-label="Close the dialog and ignore the warning" type="button"></button>
      </div>

      <div class="govuk-alert-dialog__body">
        <div id="${id}-description">
          <div class="govuk-warning-text">
            <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
            <div class="govuk-warning-text__text">
              <span class="govuk-warning-text__assistive" aria-hidden="true">Warning</span>
              <div>${warningHtml || warningText}</div>
            </div>
          </div>
          <div>${questionHtml || questionText}</div>

          <div class="govuk-alert-dialog__buttons">
            <button class="govuk-button govuk-alert-dialog__confirm-button" type="button">${confirmLabel}</button>
            <button class="govuk-button govuk-alert-dialog__reject-button" type="button">${rejectLabel}</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

AlertDialog.setScreenReaderVisibility = (els, makeHidden = false) => {
  els.map((el) => {
    if (makeHidden) {
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-hidden', makeHidden.toString());
    } else {
      el.removeAttribute('tabindex');
      el.removeAttribute('aria-hidden');
    }
    return null;
  });
};

AlertDialog.deactivateAll = () => {
  AlertDialog.dialogs.map((dialog) => {
    dialog.deactivate();
    return null;
  });
};

AlertDialog.onDialogOpen = (dialog) => {
  AlertDialog.deactivateAll();
  AlertDialog.dialogs.push(dialog);
  AlertDialog.htmlEl.classList.add('js-show-alert-dialog');
  AlertDialog.setScreenReaderVisibility(AlertDialog.rootEls, true);
  dialog.activate();
};

AlertDialog.onDialogClose = (dialogToRemove) => {
  const index = AlertDialog.dialogs.findIndex((dialog) => dialog.id === dialogToRemove.id);
  if (index >= 0) {
    dialogToRemove.deactivate();
    AlertDialog.dialogs.splice(index, 1);
  }

  if (!AlertDialog.dialogs.length) {
    AlertDialog.htmlEl.classList.remove('js-show-alert-dialog');
    AlertDialog.setScreenReaderVisibility(AlertDialog.rootEls);
  } else {
    AlertDialog.dialogs[AlertDialog.dialogs.length - 1].activate();
  }

  // Restore the focus
  AlertDialog.activeElement = dialogToRemove.cachedActiveElement;
  AlertDialog.activeElement.focus();
};
