import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import {
  useComptroller,
  useVaiToken,
  useVaiUnitroller,
} from '../hooks/useContract';
import { getVaiUnitrollerAddress } from 'core/utilities/addressHelpers';

const VaiContext = React.createContext({
  userVaiMinted: new BigNumber(0),
  userVaiBalance: new BigNumber(0),
  userVaiEnabled: false,
  mintableVai: new BigNumber(0),
});

// This context provide a way for all the components to share the market data, thus avoid
// duplicated requests
const VaiContextProvider = ({ children }) => {
  const [userVaiMinted, setMintedAmount] = useState(new BigNumber(0));
  const [userVaiBalance, setWalletAmount] = useState(new BigNumber(0));
  const [userVaiEnabled, setEnabled] = useState(false);
  const [mintableVai, setMintableAmount] = useState(new BigNumber(0));

  const comptrollerContract = useComptroller();
  const vaiControllerContract = useVaiUnitroller();
  const vaiContract = useVaiToken();
  const { account } = useWeb3React();

  useEffect(() => {
    let isMounted = true;
    const update = async () => {
      if (!account) {
        return;
      }
      const [
        userVaiBalanceTemp,
        userVaiMintedTemp,
        { 1: mintableVaiTemp },
        allowBalanceTemp,
      ] = await Promise.all([
        vaiContract.balanceOf(account),
        comptrollerContract.mintedVAIs(account),
        vaiControllerContract.getMintableVAI(account),
        vaiContract.allowance(account, getVaiUnitrollerAddress()),
      ]);
      if (!isMounted) {
        return;
      }

      setMintedAmount(userVaiMintedTemp.div(1e18));
      setWalletAmount(userVaiBalanceTemp.div(1e18));
      setEnabled(allowBalanceTemp.gte(userVaiMintedTemp));
      setMintableAmount(mintableVaiTemp.div(1e18));
    };
    update();
    return () => {
      isMounted = false;
    };
  }, [vaiControllerContract, vaiContract, comptrollerContract, account]);

  return (
    <VaiContext.Provider
      value={{
        userVaiMinted,
        userVaiBalance,
        userVaiEnabled,
        mintableVai,
      }}
    >
      {children}
    </VaiContext.Provider>
  );
};

export { VaiContext, VaiContextProvider };
