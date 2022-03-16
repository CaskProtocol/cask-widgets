import {css, html, LitElement} from 'lit';
import clsx from 'clsx';
import {customElement, property, query} from 'lit/decorators.js';

import {
  CheckoutAction,
  CaskEnvironment,
  CaskAppUrl,
  IframeEvents,
  WidgetFlow,
  CASK_settings,
  WidgetTheme,
} from './constants';
import {appendStyle} from './utils';

@customElement('cask-checkout')
export class CaskCheckoutElement extends LitElement {
  static styles = css`
    iframe {
      width: 374px;
      height: 521px;
      border: 1px solid gray;
      border-radius: 15px;
    }
    .dark-theme {
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.06);
    }
  `;

  @property()
  environment: CaskEnvironment = CaskEnvironment.testnet;

  @property()
  provider: string;

  @property()
  plan: string;

  @property()
  ref: string;

  @property()
  mode: WidgetFlow = WidgetFlow.CheckoutFlow;

  @property()
  theme: WidgetTheme;

  connectedCallback() {
    super.connectedCallback();
    if (this.mode === WidgetFlow.CheckoutFlow && !this.plan)
      throw new Error("plan is required attribute in 'cask-checkout-flow' mode");

    window.addEventListener('message', (event) => this.handleMessage(event));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('message', this.handleMessage);
  }

  handleMessage(event: MessageEvent<CheckoutAction>) {
    // doesn't work!
    // if (this.iframe && this.iframe.contentWindow?.document.body.scrollWidth)
    //   this.iframe.setAttribute('width', this.iframe.contentWindow?.document.body.scrollWidth.toString() + 'px');
    // if (this.iframe && this.iframe.contentWindow?.document.body.scrollHeight)
    //   this.iframe.setAttribute('height', this.iframe.contentWindow?.document.body.scrollHeight.toString() + 'px');

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

    if (action?.type === IframeEvents.successCheckout) {
      this.requestUpdate();
    }
  }

  @query('#cask-checkout-iframe')
  iframe!: HTMLIFrameElement;

  render() {
    const source = CaskAppUrl[this.environment] + '/#/subscribe/' + this.provider + '/' + this.plan;
    return html`<iframe
      class="${clsx({'dark-theme': this.theme === WidgetTheme.Dark})}"
      id="cask-checkout-iframe"
      title="Cask Checkout Widget"
      src="${source}"
    ></iframe> `;
  }
}
