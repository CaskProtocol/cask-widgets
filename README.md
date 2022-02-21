# Overview

The repo contains the Cask Protocol checkout widget that can be integrated into your website.

# Installation

To install the stable version:

```
npm install --save @caskprotocol/checkout-widget
```

or using yarn:

```
yarn add @caskprotocol/checkout-widget
```

# Usage

Add this import to starting point of your project such as: index.js or index.ts files

```ts
import '@caskprotocol/checkout-widget';
```

Create a `<checkout-widget-dialog/>` element with required attributes mentioned below.

```html
<checkout-widget-dialog mode="subscription-flow" environment="sandbox" subcribeLink="<PROVIDER_ADDRES>/<PLAN_ID>" />
```

### Attributes:

| name        | Required |                                                                                                 Description |
| ----------- | :------: | ----------------------------------------------------------------------------------------------------------: |
| mode        |          |                                                            Currently only `subscription-flow` is supported. |
| environment |    ✔     | Environment you want to use. If you want test widget use `sandbox`. Possible values: `sandbox`,`production` |
| plan        |          |                                             Your provider wallet address and plan id, separated with a `/`. |
| theme       |          |                                                                  Widget theme. Possible values: dark, light |

### Events:

| name                |                        Description |
| ------------------- | ---------------------------------: |
| close               |          Fires after widget closes |
| successSubscription | Fires when user subscribes to plan |

Create a `<subscribe-with-cask-button/>` element with required attributes mentioned below.

```html
<subscribe-with-cask-button disabled="false" loading="false" error="false" mode="subscription-flow" />
```

### Attributes:

| name     | Required |                                     Description |
| -------- | :------: | ----------------------------------------------: |
| disabled |          |                       Disables button when true |
| loading  |          |                         Shows loading indicator |
| error    |          |                           Shows error indicator |
| mode     |          | Currently only `subscription-flow` is supported |

### Styling:

`subscribe-with-cask-button` uses [Shadow CSS ::part](https://github.com/fergald/docs/blob/master/explainers/css-shadow-parts-1.md) spec. It has button inside defined as `button` part
![img.png](docs/button_part.png)

```html
<style>
  .subscribe-with-cask::part(button) {
    width: 100%; /* Those styles apply to button in shadow root */
  }
</style>
<subscribe-with-cask-button
  class="subscribe-with-cask"
  disabled="false"
  loading="false"
  error="false"
  mode="subscription-flow"
/>
```

See more about `::part()` on https://developer.mozilla.org/en-US/docs/Web/CSS/::part

### Events:

| name  |           Description |
| ----- | --------------------: |
| click | Fires on button click |

`<subscribe-with-cask-button>` extends all button events
