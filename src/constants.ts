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
  integration = 'integration',
  sandbox = 'sandbox',
  production = 'production',
}

export interface CheckoutAction<P = unknown> {
  type: IframeEvents;
  payload: P;
}

export interface TopupAction<P = unknown> {
  type: IframeEvents;
  payload: P;
}
