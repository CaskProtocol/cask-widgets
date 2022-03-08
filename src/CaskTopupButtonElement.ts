import {css, html, LitElement} from 'lit';
import clsx from 'clsx';
import {customElement, property} from 'lit/decorators.js';
import {ButtonSize, CaskEnvironment} from './constants';
import './CaskTopupDialogElement';


@customElement('cask-topup-button')
export class CaskTopupButtonElement extends LitElement {
  static styles = css`
    :root {
      width: 100%;
      display: block;
    }
    .cask-topup-button {
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
    .cask-topup-button:hover {
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

    .cask-topup-button--loading::after {
      content: '';
      animation: button-loading-spinner 1s ease infinite;
    }

    .cask-topup-button--loading > * {
      visibility: hidden;
      opacity: 0;
    }

    .cask-topup-button--disabled {
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
  label: string = "Topup your Cask Balance";

  @property()
  environment: CaskEnvironment = CaskEnvironment.sandbox;

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

  @property({type: Element})
  caskTopupDialog: Element | null;

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
    this.caskTopupDialog = this.shadowRoot?.children[1] ? this.shadowRoot?.children[1] : null;
  }

  render() {
    return html`<button
      part="button"
      ?disabled=${this.loading || this.error || this.disabled}
      class="${clsx('cask-topup-button', {
        'cask-topup-button--loading': this.loading,
        'cask-topup-button--disabled': this.loading || this.disabled,
      },this.size)}"
      type="button"
      onClick="(function(el){
          el.setAttribute('loading', true);

          document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
              caskTopupDialog.open = false;
            }
          };

          var caskTopupDialog = document.createElement('cask-topup-dialog');
          caskTopupDialog.environment='${this.environment}';
          document.body.appendChild(caskTopupDialog);

          caskTopupDialog.addEventListener('click', () => {
            caskTopupDialog.open = false;
            ${this.onClose ? this.onClose + '();' : ''}
          });
          caskTopupDialog.addEventListener('close', () => {
            caskTopupDialog.open = false;
            ${this.onClose ? this.onClose + '();' : ''}
          });
          caskTopupDialog.addEventListener('successTopup', (event) => {
            ${this.onSuccess ? this.onSuccess + '(event.detail.txHash);' : ''}
            ${this.redirect && this.redirect.indexOf('http') === 0
        ? "window.location='" + this.redirect + "?txHash=' + event.detail.txHash"
        : ''};
          });

          caskTopupDialog.open = true;
          el.setAttribute('loading', false);
          return false;
      })(this);return false;"
    >
      ${this.loading ? '' : this.label}
    </button> `;
  }
}
