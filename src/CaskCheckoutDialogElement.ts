import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CaskEnvironment, WidgetFlow, WidgetTheme} from './constants';
import './CaskCheckoutElement';

@customElement('cask-checkout-dialog')
export class CaskCheckoutDialogElement extends LitElement {
  static styles = css`
    .modal {
      display: flex;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 5;
      overflow: scroll;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      justify-content: center;
      padding-top: 25px;
    }
    .modal-close-button {
      height: 30px;
      width: 30px;
      border: none;
      left: 494px;
      position: relative;
      top: -15px;
      border-radius: 100px;
      background-color: #99a5b1;
      color: white;
      font-weight: 1000;
      font-size: 18px;
      padding: 2px;
      cursor: pointer;
    }
    .modal--closed {
      display: none;
    }
  `;
  @property()
  environment: CaskEnvironment = CaskEnvironment.testnet;

  @property()
  chains: string = '';

  @property()
  provider: string;

  @property()
  plan: string;

  @property()
  ref: string;

  @property({type: Boolean})
  open: boolean;

  @property()
  mode: WidgetFlow = WidgetFlow.CheckoutFlow;

  @property()
  theme: WidgetTheme = WidgetTheme.Light;

  // for some reason open does not re-render on property change
  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    if (name === 'open' && value === 'false') {
      this.open = false;
      this.requestUpdate();
    }
  }

  renderWidget() {
    return html`<button class="modal-close-button" onClick="this.parentNode.parentNode.host.open = false">X</button>
      <cask-checkout
        mode="${this.mode}"
        chains="${this.chains}"
        provider="${this.provider}"
        plan="${this.plan}"
        ref="${this.ref}"
        environment="${this.environment}"
        theme="${this.theme}"
      ></cask-checkout>`;
  }

  render() {
    return html` <div class=${this.open ? 'modal' : 'modal--closed'}>${this.open && this.renderWidget()}</div> `;
  }
}
