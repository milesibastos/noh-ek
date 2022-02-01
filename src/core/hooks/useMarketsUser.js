import { useContext } from 'react';
import { MarketContext } from 'core/context/MarketContext';

export const useMarketsUser = () => {
  const {
    userMarketInfo,
    userTotalSupplyBalance,
    userTotalBorrowLimit,
    userTotalBorrowBalance,
    userXVSBalance
  } = useContext(MarketContext);
  return {
    userMarketInfo,
    userTotalSupplyBalance,
    userTotalBorrowLimit,
    userTotalBorrowBalance,
    userXVSBalance
  };
};
