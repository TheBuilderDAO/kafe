import {
  BDR_DECIMAL,
  KAFE_DECIMAL,
  SOL_DECIMAL,
  useBalance,
} from 'hooks/useBalance';

export const Balance = () => {
  const { balance } = useBalance();
  const format = (number: Number) => number.toFixed(2).replace(/\.00$/, '');
  return (
    <div className="flex justify-between p-2">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kafepurple text-kafeblack">
        {' '}
        SOL {format(balance.sol_balance / SOL_DECIMAL)}{' '}
      </span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kafegold text-kafeblack">
        {' '}
        KAFE {format(balance.kafe_balance / KAFE_DECIMAL)}
      </span>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-kafedarkred text-kafeblack">
        {' '}
        BDR {format(balance.bdr_balance / BDR_DECIMAL)}
      </span>
    </div>
  );
};
