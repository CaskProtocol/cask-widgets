import {css, html, LitElement} from 'lit';
import clsx from 'clsx';
import {customElement, property, query} from 'lit/decorators.js';

import {CheckoutAction, CheckoutEnvironment, IframeEvents, WidgetFlow, CASK_settings, WidgetTheme} from './constants';
import {appendStyle} from './utils';

const environmentUrls = {
  development: '//localhost:3000/#/subscribe/',
  integration: '//app.beta.cask.fi/#/subscribe/',
  sandbox: '//app.sandbox.cask.fi/#/subscribe/',
  production: '//app.cask.fi/#/subscribe/',
};

@customElement('checkout-widget')
export class CheckoutWidgetElement extends LitElement {
  static styles = css`
    iframe {
      width: 450px;
      height: 700px;
      border: 1px solid gray;
      border-radius: 15px;
    }
    .dark-theme {
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.06);
    }
  `;

  @property()
  environment: CheckoutEnvironment = CheckoutEnvironment.sandbox;

  @property()
  provider: string;

  @property()
  plan: string;

  @property()
  mode: WidgetFlow = WidgetFlow.SubscriptionFlow;

  @property()
  theme: WidgetTheme;

  connectedCallback() {
    super.connectedCallback();
    if (this.mode === WidgetFlow.SubscriptionFlow && !this.plan)
      throw new Error("plan is required attribute in 'subscription-flow' mode");

    window.addEventListener('message', (event) => this.handleMessage(event));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('message', this.handleMessage);
  }

  handleMessage(event: MessageEvent<CheckoutAction>) {
    const action = event.data;
    this.dispatchEvent(new CustomEvent(action.type, {detail: event.data, bubbles: true, composed: true}));

    if (action.type === IframeEvents.styles) {
      appendStyle(this.iframe, action.payload as Record<string, string>);
    }

    if (action?.type === IframeEvents.settings) {
      const payload = action.payload as string;
      localStorage.setItem(CASK_settings, payload);
    }

    if (action?.type === IframeEvents.close) {
      this.requestUpdate();
    }

    if (action?.type === IframeEvents.successSubscription) {
      this.requestUpdate();
    }
  }

  @query('#checkout-iframe')
  iframe!: HTMLIFrameElement;

  render() {
    const source = environmentUrls[this.environment] + this.provider + '/' + this.plan;
    return html`<iframe
      class="${clsx({'dark-theme': this.theme === WidgetTheme.Dark})}"
      id="checkout-iframe"
      title="Cask Checkout Widget"
      src="${source}"
    ></iframe> `;
  }
}
