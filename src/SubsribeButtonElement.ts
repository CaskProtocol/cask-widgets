import {css, html, LitElement} from 'lit';
import clsx from 'clsx';
import {customElement, property} from 'lit/decorators.js';
import {WidgetFlow} from './constants';

const defaultLabel = {
  [WidgetFlow.SubscriptionFlow]: 'Subscribe with',
};

@customElement('subscribe-with-cask-button')
export class SubsribeButtonElement extends LitElement {
  static styles = css`
    :root {
      width: 100%;
      display: block;
    }
    .subscribe-with-cask-button {
      position: relative;
      background: linear-gradient(90deg, #7622a9 0%, #7622a9 100%);
      min-height: 50px;
      min-width: 286px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      color: #fff;
      outline: none;
      font-size: 16px;
    }

    .subscribe-with-cask-button::after {
      content: 'Cask';
      color: #ffffff;
      font-size: 16px;
      border-radius: 8px;
    }

    .subscribe-with-cask-button--loading {
      text-align: left;
    }

    .subscribe-with-cask-button--loading::after {
      content: '';
      background-color: transparent;
      position: absolute;
      width: 16px;
      height: 16px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      border: 4px solid transparent;
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: button-loading-spinner 1s ease infinite;
    }

    .subscribe-with-cask-button--loading > * {
      visibility: hidden;
      opacity: 0;
    }

    .subscribe-with-cask-button--disabled {
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
  class: string;

  @property({type: Boolean})
  loading: boolean;

  @property({type: Boolean})
  disabled: boolean;

  @property({type: Boolean})
  error: boolean;

  @property()
  mode: WidgetFlow = WidgetFlow.SubscriptionFlow;

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

  render() {
    const label = this.error ? 'Something went wrong' : defaultLabel[this.mode];

    return html`<button
      part="button"
      ?disabled=${this.loading || this.error || this.disabled}
      class="${clsx('subscribe-with-cask-button', {
        'subscribe-with-cask-button--loading': this.loading,
        'subscribe-with-cask-button--disabled': this.loading || this.disabled,
      })}"
      type="button"
    >
      ${this.loading ? '' : label}
    </button> `;
  }
}
