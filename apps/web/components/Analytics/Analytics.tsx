import { useEffect } from 'react';
import { useDapp } from '../../hooks/useDapp';
import initializeAnalytics from '@app/utils/analytics';

const Analytics = () => {
  const { wallet } = useDapp();

  useEffect(() => {
    if (wallet.publicKey) {
      initializeAnalytics(wallet.publicKey.toString());
    }
  }, [wallet.publicKey]);

  return null;
};

export default Analytics;
