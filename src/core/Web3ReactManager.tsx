import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { useEagerConnect, useInactiveListener } from './hooks';

const Web3ReactManager: React.FC = ({ children }) => {
  const context = useWeb3React();
  const { connector, chainId, active, error } = context;
  const triedEager = useEagerConnect();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector, chainId]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && error) {
    console.error('unknownError');
    return <>unknownError</>;
  }
  return <>{children}</>;
};

export default Web3ReactManager;
