import React from 'react';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { useAsync } from 'react-use';

import {
  useComptroller,
  useVaiToken,
  useVaiUnitroller,
} from 'core/hooks/useContract';
import { getVaiUnitrollerAddress } from 'core/utilities/addressHelpers';

const VaiContext = React.createContext({
  userVaiMinted: new BigNumber(0),
  userVaiBalance: new BigNumber(0),
  userVaiEnabled: false,
  mintableVai: new BigNumber(0),
});

const VaiContextProvider: React.FC = ({ children }) => {
  const comptrollerContract = useComptroller();
  const vaiControllerContract = useVaiUnitroller();
  const vaiContract = useVaiToken();
  const { account } = useWeb3React();

  const { loading, value } = useAsync(async () => {
    const [userVaiBalance, userVaiMinted, { 1: mintableVai }, userVaiEnabled] =
      await Promise.all([
        vaiContract.balanceOf(account) as BigNumber,
        comptrollerContract.mintedVAIs(account),
        vaiControllerContract.getMintableVAI(account),
        vaiContract.allowance(account, getVaiUnitrollerAddress()),
      ]);
    return {
      userVaiBalance,
      userVaiMinted,
      userVaiEnabled: userVaiEnabled.gte(userVaiMinted),
      mintableVai,
    };
  }, []);

  if (loading || !value) return null;

  return <VaiContext.Provider value={value}>{children}</VaiContext.Provider>;
};

export { VaiContext, VaiContextProvider };
