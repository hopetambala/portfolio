import { triggerPageTransition, scrollToHash } from './src/motion';

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (!prevLocation || location.pathname !== prevLocation.pathname) {
    triggerPageTransition();
  }
  scrollToHash(location, prevLocation);
};
