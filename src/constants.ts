export const CASK_settings = '__CASK_settings';

export enum WidgetFlow {
  CheckoutFlow = 'cask-checkout-flow',
}

export enum WidgetTheme {
  Dark = 'dark',
  Light = 'light',
}

export enum ButtonSize {
  Small = 'small',
  Regular = '',
  Large = 'large',
}

export enum IframeEvents {
  styles = 'styles',
  close = 'close',
  redirect = 'redirect',
  successCheckout = 'successCheckout',
  successTopup = 'successTopup',
  settings = 'settings',
}

export enum CaskEnvironment {
  development = 'development',
  internal = 'internal',
  testnet = 'testnet',
  production = 'production',
}

export enum CaskDefaultChain {
  development = 'mumbai',
  internal = 'mumbai',
  testnet = 'mumbai',
  production = 'polygon',
}

export const CaskAppUrl = {
  development: '//localhost:3000',
  internal: '//app.internal.cask.fi',
  testnet: '//app.testnet.cask.fi',
  production: '//app.cask.fi',
};

export interface CheckoutAction<P = unknown> {
  type: IframeEvents;
  payload: P;
}

export interface TopupAction<P = unknown> {
  type: IframeEvents;
  payload: P;
}
