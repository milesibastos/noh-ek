import { useMemo } from 'react';
import {
  getComptrollerContract,
  getInterestModelContract,
  getPriceOracleContract,
  getTokenContract,
  getVaiTokenContract,
  getVaiUnitrollerContract,
  getVaiVaultContract,
  getVbepContract,
  getVenusLensContract,
  getXvsVaultProxyContract,
  getXvsVaultContract,
  getTokenContractByAddress,
  getGovernorBravoContract,
} from 'core/utilities/contractHelpers';
import { useWeb3React } from '@web3-react/core';

export const useToken = (name) => {
  const web3 = useWeb3React();
  return useMemo(() => getTokenContract(web3, name), [web3, name]);
};

export const useTokenByAddress = (address) => {
  const web3 = useWeb3React();
  return useMemo(
    () => getTokenContractByAddress(web3, address),
    [web3, address]
  );
};

export const useVaiToken = () => {
  const web3 = useWeb3React();
  return useMemo(() => getVaiTokenContract(web3), [web3]);
};

export const useVaiUnitroller = () => {
  const web3 = useWeb3React();
  return useMemo(() => getVaiUnitrollerContract(web3), [web3]);
};

export const useVaiVault = () => {
  const web3 = useWeb3React();
  return useMemo(() => getVaiVaultContract(web3), [web3]);
};

export const useVbep = (name) => {
  const web3 = useWeb3React();
  return useMemo(() => getVbepContract(web3, name), [web3, name]);
};

export const useComptroller = () => {
  const web3 = useWeb3React();
  return useMemo(() => getComptrollerContract(web3), [web3]);
};

export const usePriceOracle = () => {
  const web3 = useWeb3React();
  return useMemo(() => getPriceOracleContract(web3), [web3]);
};

export const useInterestModel = () => {
  const web3 = useWeb3React();
  return useMemo(() => getInterestModelContract(web3), [web3]);
};

export const useVenusLens = () => {
  const web3 = useWeb3React();
  return useMemo(() => getVenusLensContract(web3), [web3]);
};

export const useXvsVault = () => {
  const web3 = useWeb3React();
  return useMemo(() => getXvsVaultContract(web3), [web3]);
};

export const useXvsVaultProxy = () => {
  const web3 = useWeb3React();
  return useMemo(() => getXvsVaultProxyContract(web3), [web3]);
};

export const useGovernorBravo = () => {
  const web3 = useWeb3React();
  return useMemo(() => getGovernorBravoContract(web3), [web3]);
};
