import {css, html, LitElement} from 'lit';
import clsx from 'clsx';
import {customElement, property} from 'lit/decorators.js';
import {ButtonSize, CaskEnvironment, WidgetFlow} from './constants';
import './CaskCheckoutDialogElement';

@customElement('cask-checkout-button')
export class CaskCheckoutButtonElement extends LitElement {
  static styles = css`
    :root {
      width: 100%;
      display: block;
    }
    .cask-checkout-button {
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
    .cask-checkout-button:hover {
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

    .cask-checkout-button--loading::after {
      content: '';
      animation: button-loading-spinner 1s ease infinite;
    }

    .cask-checkout-button--loading > * {
      visibility: hidden;
      opacity: 0;
    }

    .cask-checkout-button--disabled {
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
  label: string = 'Checkout with Crypto';

  @property({type: String})
  chains: string = '';

  @property({type: String})
  provider: string;

  @property({type: String})
  plan: string;

  @property({type: String})
  ref: string;

  @property()
  environment: CaskEnvironment = CaskEnvironment.testnet;

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
  caskCheckoutDialog: Element | null;

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
    this.caskCheckoutDialog = this.shadowRoot?.children[1] ? this.shadowRoot?.children[1] : null;
  }

  render() {
    return html`<button
      part="button"
      ?disabled=${this.loading || this.error || this.disabled}
      class="${clsx(
        'cask-checkout-button',
        {
          'cask-checkout-button--loading': this.loading,
          'cask-checkout-button--disabled': this.loading || this.disabled,
        },
        this.size
      )}"
      type="button"
      onClick="(function(el){
          el.setAttribute('loading', true);

          document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
              caskCheckoutDialog.open = false;
              ${this.onClose ? 'window.' + this.onClose + '();' : ''}

            }
          };

          var caskCheckoutDialog = document.createElement('cask-checkout-dialog');
          caskCheckoutDialog.chains='${this.chains}';
          caskCheckoutDialog.provider='${this.provider}';
          caskCheckoutDialog.plan='${this.plan}';
          caskCheckoutDialog.ref='${this.ref}';
          caskCheckoutDialog.environment='${this.environment}';
          document.body.appendChild(caskCheckoutDialog);

          caskCheckoutDialog.addEventListener('close', () => {
            caskCheckoutDialog.open = false;
            ${this.onClose ? 'window.' + this.onClose + '();' : ''}
          });
          caskCheckoutDialog.addEventListener('successCheckout', (event) => {
            ${this.onSuccess ? 'window.' + this.onSuccess + '(event.detail.txHash);' : ''}
            ${this.redirect && this.redirect.indexOf('http') === 0
        ? "window.location='" + this.redirect + "?txHash=' + event.detail.txHash"
        : ''};
          });

          caskCheckoutDialog.open = true;
          el.setAttribute('loading', false);
          return false;
      })(this);return false;"
    >
      ${this.loading ? '' : this.label}
    </button> `;
  }
}
