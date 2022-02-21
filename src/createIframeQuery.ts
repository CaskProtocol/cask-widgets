import {IframeEvents, WidgetFlow, WidgetTheme} from './constants';

export const createIframeQuery = ({
  plan,
  mode,
  themeMode,
}: {
  plan: string;
  mode: WidgetFlow;
  themeMode?: WidgetTheme;
}) => ({
  settings: localStorage.getItem(IframeEvents.settings),
  origin: window.location.origin,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  appConfig: JSON.stringify({
    mode,
    themeMode,
  }),
  plan,
});
