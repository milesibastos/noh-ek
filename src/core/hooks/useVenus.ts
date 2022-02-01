import { useMarketsUser } from './useMarketsUser';

const useVenus = () => {
  const { userTotalSupplyBalance, userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  return {
    supplyBalance: userTotalSupplyBalance,
    borrowBalance: userTotalBorrowBalance,
    borrowLimit: userTotalBorrowLimit,
  };
};

export default useVenus;
