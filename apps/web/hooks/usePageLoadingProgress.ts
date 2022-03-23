import { useEffect } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

const usePageLoadingProgress = (parent = '#__next') => {
  NProgress.configure({ parent });

  useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      NProgress.start();
    });
    Router.events.on('routeChangeComplete', () => {
      NProgress.done();
    });
    Router.events.on('routeChangeError', () => {
      NProgress.done();
    });
  }, []);
};

export default usePageLoadingProgress;
