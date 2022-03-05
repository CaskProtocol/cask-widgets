export const CASK_settings = '__CASK_settings';

export enum WidgetFlow {
  CheckoutFlow = 'checkout-flow',
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
  settings = 'settings',
}

export enum CheckoutEnvironment {
  development = 'development',
  integration = 'integration',
  sandbox = 'sandbox',
  production = 'production',
}

export interface CheckoutAction<P = unknown> {
  type: IframeEvents;
  payload: P;
}
