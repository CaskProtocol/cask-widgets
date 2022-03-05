import {css, html, LitElement} from 'lit';
import clsx from 'clsx';
import {customElement, property} from 'lit/decorators.js';
import {ButtonSize, CheckoutEnvironment, WidgetFlow} from './constants';
import './CheckoutWidgetDialogElement';


@customElement('checkout-with-cask-button')
export class CheckoutButtonElement extends LitElement {
  static styles = css`
    :root {
      width: 100%;
      display: block;
    }
    .checkout-with-cask-button {
      margin: 0;
      overflow: visible;
      position: relative;
      background-color: #8156c3;
      border: none;
      cursor: pointer;
      color: #fff;
      outline: none;
      font-family: inherit;
      border-radius: 5px;
      padding: 0 16px;
      height: 33px;
      font-size: 14px;
      line-height: 30px;
    }
    .checkout-with-cask-button:hover {
      box-shadow: inset 0 0 20px 20px rgb(0 0 0 / 10%);
    }

    .small {
      height: 23px;
      line-height: 20px;
      font-size: 10px;
    }
    
    .large {
      height: 43px;
      line-height: 40px;
      font-size: 24px;
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
  label: string;

  @property({type: String})
  provider: string;

  @property({type: String})
  plan: string;

  @property({type: String})
  ref: string;

  @property()
  environment: CheckoutEnvironment = CheckoutEnvironment.sandbox;

  @property({type: String})
  size: ButtonSize = ButtonSize.Regular;

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
    return html`<button
      part="button"
      ?disabled=${this.loading || this.error || this.disabled}
      class="${clsx('checkout-with-cask-button', {
        'checkout-with-cask-button--loading': this.loading,
        'checkout-with-cask-button--disabled': this.loading || this.disabled,
      },this.size)}"
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
          checkoutWidgetDialog.ref='${this.ref}';
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
      ${this.loading ? '' : this.label}
    </button> `;
  }
}
