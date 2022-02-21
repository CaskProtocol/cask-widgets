import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {CheckoutEnvironment, WidgetFlow, WidgetTheme} from './constants';
import './CheckoutWidgetElement';

@customElement('checkout-widget-dialog')
export class CheckoutWidgetDialogElement extends LitElement {
  static styles = css`
    .modal {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      z-index: 5;
      overflow: scroll;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      align-items: center;
      justify-content: center;
    }
    .modal--closed {
      display: none;
    }
  `;
  @property()
  environment: CheckoutEnvironment = CheckoutEnvironment.sandbox;

  @property()
  plan: string;

  @property({type: Boolean})
  open: boolean;

  @property()
  mode: WidgetFlow = WidgetFlow.SubscriptionFlow;

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
    return html`<checkout-widget
      mode="${this.mode}"
      plan="${this.plan}"
      environment="${this.environment}"
      theme="${this.theme}"
    ></checkout-widget>`;
  }

  render() {
    return html` <div class=${this.open ? 'modal' : 'modal--closed'}>${this.open && this.renderWidget()}</div> `;
  }
}
