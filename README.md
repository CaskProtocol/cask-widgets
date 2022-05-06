# Overview

The repo contains the Cask Protocol buttons/widgets that can be integrated into your website. This includes a
checkout button that can be used to provide simple signup experience as well as a top-up button that can be added
to your app/website to allow users to ensure they maintain a healthy cask balance.

# Installation

To install the stable version:

```
npm install --save @caskprotocol/cask-widgets
```

or using yarn:

```
yarn add @caskprotocol/cask-widgets
```

# Usage

Add this import to starting point of your project such as: index.js or index.ts files

```ts
import '@caskprotocol/cask-widgets';
```

Create a `<cask-checkout-button/>` element with required attributes mentioned below.

```html
<cask-checkout-button
  class="cask-checkout-button"
  provider="0x...."
  plan="123456"
  environment="testnet"
  onClose="close"
  onSuccess="success"
  label="Checkout with Crypto"
></cask-checkout-button>
```

### Attributes:

| name        | Required |                                                                                  Description |
|-------------|:--------:|---------------------------------------------------------------------------------------------:|
| class       |          |                                                                          CSS classes to add. |
| environment |          |           Environment. Possible values: `testnet` or `production`. Defaults to `production`. |
| provider    |    ✔     |                                                                Your provider wallet address. |
| plan        |    ✔     |                                                                           Your Cask plan id. |
| label       |          |                                                                Message to put on the button. |
| ref         |          |                           Include a custom value associated with the Cask subscription data. |
| size        |          |           Button size. Possible values:`regular`, `large` or `small`. Defaults to `regular`. |
| theme       |          |                        Widget theme. Possible values: `dark` or `light`. Defaults to `dark`. |
| redirect    |          |   Redirect to URL upon successful subscribe. Does not call `onSuccess` handler, if supplied. |
| onClose     |          |                                                                  Callback for `close` event. |
| onSuccess   |          |                                                    Callback for `successSubscription` event. |

### Events:

| name                |                        Description |
| ------------------- | ---------------------------------: |
| close               |          Fires after widget closes |
| successSubscription | Fires when user subscribes to plan |


### Styling:

`cask-checkout-button` uses [Shadow CSS ::part](https://github.com/fergald/docs/blob/master/explainers/css-shadow-parts-1.md) spec. It has button inside defined as `button` part
![img.png](docs/button_part.png)

```html
<style>
  .cask-checkout-button::part(button) {
    background-color: aqua;
    width: 100%; /* Those styles apply to button in shadow root */
  }
</style>
<cask-checkout-button
  class="cask-checkout-button"
  label="Pay with Crypto"
/>
```

See more about `::part()` on https://developer.mozilla.org/en-US/docs/Web/CSS/::part
