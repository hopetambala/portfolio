import React from 'react';
import { triggerPageTransition, scrollToHash } from './src/motion';
import { ThemeProvider } from './src/theme/theme-provider';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (!prevLocation || location.pathname !== prevLocation.pathname) {
    triggerPageTransition();
  }
  scrollToHash(location, prevLocation);
};
