declare global {
  interface Window {
    pendo: {
      initialize: (any) => void;
      track: (eventName: string, properties: any) => void;
    };
  }
}

const initialize = (id: string) => {
  window.pendo.initialize({
    visitor: {
      id,
    },
    account: {
      id,
    },
  });
};

export const trackEvent = <T>(name: string, properties: T) => {
  window.pendo.track('Registered', properties);
};

export default initialize;
