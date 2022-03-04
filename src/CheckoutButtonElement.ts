import {css, html, LitElement} from 'lit';
import {svg} from 'lit-html';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import clsx from 'clsx';
import {customElement, property} from 'lit/decorators.js';
import {CheckoutEnvironment, WidgetFlow} from './constants';
import './CheckoutWidgetDialogElement';

import ButtonBackground from './checkout-with-crypto.svg';

const defaultLabel = {
  [WidgetFlow.CheckoutFlow]: svg`${unsafeSVG(ButtonBackground)}`,
};

@customElement('checkout-with-cask-button')
export class CheckoutButtonElement extends LitElement {
  static styles = css`
    :root {
      width: 100%;
      display: block;
    }
    .checkout-with-cask-button {
      margin: 0;
      padding: 0;
      overflow: visible;
      background: transparent;
      line-height: normal;
      position: relative;
      fill: #8156c3;
      height: 92px;
      width: 286px;
      border: none;
      cursor: pointer;
      color: #fff;
      outline: none;
      font-size: 16px;
    }

    .checkout-with-cask-button--loading::after {
      content: '';
      animation: button-loading-spinner 1s ease infinite;
    }

    .checkout-with-cask-button--loading > * {
      visibility: hidden;
      opacity: 0;
    }

    .checkout-with-cask-button--disabled {
      opacity: 0.5;
    }

    @keyframes button-loading-spinner {
      from {
        transform: rotate(0turn);
      }

      to {
        transform: rotate(1turn);
      }
    }
  `;

  @property({type: String})
  provider: string;

  @property({type: String})
  plan: string;

  @property()
  environment: CheckoutEnvironment = CheckoutEnvironment.sandbox;

  @property({type: String})
  class: string;

  @property({type: Boolean})
  loading: boolean;

  @property({type: Boolean})
  disabled: boolean;

  @property({type: Boolean})
  error: boolean;

  @property()
  mode: WidgetFlow = WidgetFlow.CheckoutFlow;

  @property({type: Element})
  checkoutWidgetDialog: Element | null;

  @property({type: String})
  redirect: string;

  @property({type: Function})
  onClose: () => {};

  @property({type: Function})
  onSuccess: () => {};

  // for some reason open does not re-render on property change
  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'disabled' && value === 'false') {
      this.disabled = false;
      this.requestUpdate();
    }

    if (name === 'loading' && value === 'false') {
      this.loading = false;
      this.requestUpdate();
    }

    if (name === 'error' && value === 'false') {
      this.error = false;
      this.requestUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.checkoutWidgetDialog = this.shadowRoot?.children[1] ? this.shadowRoot?.children[1] : null;
  }

  render() {
    const label = this.error ? 'Something went wrong' : defaultLabel['checkout-flow'];

    return html`<button
      part="button"
      ?disabled=${this.loading || this.error || this.disabled}
      class="${clsx('checkout-with-cask-button', {
        'checkout-with-cask-button--loading': this.loading,
        'checkout-with-cask-button--disabled': this.loading || this.disabled,
      })}"
      type="button"
      onClick="(function(el){
          el.setAttribute('loading', true);

          document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
              checkoutWidgetDialog.open = false;
            }
          };

          var checkoutWidgetDialog = document.createElement('checkout-widget-dialog');
          checkoutWidgetDialog.provider='${this.provider}';
          checkoutWidgetDialog.plan='${this.plan}';
          checkoutWidgetDialog.environment='${this.environment}';
          document.body.appendChild(checkoutWidgetDialog);

          checkoutWidgetDialog.addEventListener('click', () => {
            checkoutWidgetDialog.open = false;
            ${this.onClose ? this.onClose + '();' : ''}
          });
          checkoutWidgetDialog.addEventListener('close', () => {
            checkoutWidgetDialog.open = false;
            ${this.onClose ? this.onClose + '();' : ''}
          });
          checkoutWidgetDialog.addEventListener('successCheckout', (event) => {
            ${this.onSuccess ? this.onSuccess + '(event.detail.txHash);' : ''}
            ${this.redirect && this.redirect.indexOf('http') === 0
        ? "window.location='" + this.redirect + "?txHash=' + event.detail.txHash"
        : ''};
          });

          checkoutWidgetDialog.open = true;
          el.setAttribute('loading', false);
          return false;
      })(this);return false;"
    >
      ${this.loading ? '' : label}
    </button> `;
  }
}
