import React, { useEffect, useState, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import { useVaiUser } from 'core/hooks/useVaiUser';
import { useMarketsUser } from 'core/hooks/useMarketsUser';
import { useVaiVault } from 'core/hooks/useContract';
import { getBigNumber } from 'core/utilities/common';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

function WalletBalance() {
  const [netAPY, setNetAPY] = useState(0);
  const [withXVS, setWithXVS] = useState(true);
  const { userVaiMinted } = useVaiUser();
  const { userMarketInfo } = useMarketsUser();

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBorrow, setTotalBorrow] = useState(new BigNumber(0));
  const { account } = useWeb3React();
  const vaultContract = useVaiVault();

  let isMounted = true;

  const addVAIApy = useCallback(async (apy) => {
    if (!account) {
      return;
    }
    const { 0: staked } = await vaultContract.userInfo(account);
    const amount = new BigNumber(staked).div(1e18);

    if (!isMounted) {
      return;
    }

    if (amount.isNaN() || amount.isZero()) {
      setNetAPY(apy.dp(2, 1).toNumber());
    } else {
      setNetAPY(apy.plus(0).dp(2, 1).toNumber());
    }
  }, []);

  const updateNetAPY = useCallback(async () => {
    let totalSum = new BigNumber(0);
    let totalSupplied = new BigNumber(0);
    let totalBorrowed = userVaiMinted;

    userMarketInfo.forEach((asset) => {
      if (!asset) return;
      const {
        supplyBalance,
        borrowBalance,
        tokenPrice,
        supplyApy,
        borrowApy,
        xvsSupplyApy,
        xvsBorrowApy,
      } = asset;
      const supplyBalanceUSD = getBigNumber(supplyBalance).times(
        getBigNumber(tokenPrice)
      );
      const borrowBalanceUSD = getBigNumber(borrowBalance).times(
        getBigNumber(tokenPrice)
      );
      totalSupplied = totalSupplied.plus(supplyBalanceUSD);
      totalBorrowed = totalBorrowed.plus(borrowBalanceUSD);
      const supplyApyWithXVS = withXVS
        ? getBigNumber(supplyApy).plus(getBigNumber(xvsSupplyApy))
        : getBigNumber(supplyApy);
      const borrowApyWithXVS = withXVS
        ? getBigNumber(xvsBorrowApy).plus(getBigNumber(borrowApy))
        : getBigNumber(borrowApy);

      // const supplyApyWithXVS = getBigNumber(supplyApy);
      // const borrowApyWithXVS = getBigNumber(borrowApy).times(-1);
      totalSum = totalSum.plus(
        supplyBalanceUSD
          .times(supplyApyWithXVS.div(100))
          .plus(borrowBalanceUSD.times(borrowApyWithXVS.div(100)))
      );
    });

    let apy;

    if (totalSum.isZero() || totalSum.isNaN()) {
      apy = new BigNumber(0);
    } else if (totalSum.isGreaterThan(0)) {
      apy = totalSupplied.isZero() ? 0 : totalSum.div(totalSupplied).times(100);
    } else {
      apy = totalBorrowed.isZero() ? 0 : totalSum.div(totalBorrowed).times(100);
    }
    if (!isMounted) {
      return;
    }
    setTotalSupply(totalSupplied);
    setTotalBorrow(totalBorrowed);
    addVAIApy(apy);
  }, [userMarketInfo, withXVS]);

  useEffect(() => {
    if (account && userMarketInfo && userMarketInfo.length > 0) {
      updateNetAPY();
    }
    return () => {
      isMounted = false;
    };
  }, [account, updateNetAPY]);

  const formatValue = (value: any) => {
    return `$${format(getBigNumber(value).dp(2, 1).toString(10))}`;
  };

  return (
    <div>
      <div className="flex just-between">
        <div>
          <div>
            <div>
              <p className="label">Supply Balance</p>
              <p className="value">{totalSupply.dp(2, 1).toString(10)}</p>
            </div>
          </div>
          <div>{netAPY}</div>
          <div>
            <div>
              <p className="label">Borrow Balance</p>
              <p className="value">{totalBorrow.dp(2, 1).toString(10)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletBalance;
