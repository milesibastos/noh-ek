import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useMarketsUser } from 'core/hooks/useMarketsUser';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

function BorrowLimit() {
  const [available, setAvailable] = useState('0');
  const [borrowPercent, setBorrowPercent] = useState(0);
  const { account } = useWeb3React();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useMarketsUser();
  useEffect(() => {
    if (account) {
      const total = BigNumber.maximum(userTotalBorrowLimit, 0);
      setAvailable(total.dp(2, 1).toString(10));
      setBorrowPercent(
        total.isZero() || total.isNaN()
          ? 0
          : userTotalBorrowBalance.div(total).times(100).dp(0, 1).toNumber()
      );
    }
  }, [userTotalBorrowBalance, userTotalBorrowLimit]);

  return (
    <div>
      <div>
        <p className="usd-price">
          ${format(userTotalBorrowLimit.dp(2, 1).toString(10))}
        </p>
        <p className="credit-text">Available Credit</p>
        <p>{borrowPercent}</p>
      </div>
    </div>
  );
}

export default BorrowLimit;
