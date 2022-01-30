import React from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';

import { injected } from '../../connectors';
import { useEagerConnect, useInactiveListener } from '../../hooks';

import './App.css';
import logo from './logo.svg';
import ChainId from '../../components/ChainId';
import { Spinner } from '../../components/Spinner';
import Account from '../../components/Account';

enum ConnectorNames {
  Injected = 'Injected',
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
};

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

function Dashboard() {
  const context = useWeb3React<Web3Provider>();
  const { connector, activate, deactivate, active, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const name = ConnectorNames.Injected;
  const currentConnector = connectorsByName[name];
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const disabled = !triedEager || !!activatingConnector || connected || !!error;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Account />
        <ChainId />
        <button
          style={{
            height: '3rem',
            borderRadius: '1rem',
            borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
            cursor: disabled ? 'unset' : 'pointer',
            position: 'relative',
          }}
          disabled={disabled}
          onClick={() => {
            setActivatingConnector(currentConnector);
            activate(connectorsByName[name], (error) => {
              if (error) {
                setActivatingConnector(undefined);
              }
            });
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              color: 'black',
              margin: '0 0 0 1rem',
            }}
          >
            {activating && (
              <Spinner
                color={'black'}
                style={{ height: '25%', marginLeft: '-1rem' }}
              />
            )}
            {connected && (
              <span role="img" aria-label="check">
                ✅
              </span>
            )}
          </div>
          {name}
        </button>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {(active || error) && (
            <button
              style={{
                height: '3rem',
                marginTop: '2rem',
                borderRadius: '1rem',
                borderColor: 'red',
                cursor: 'pointer',
              }}
              onClick={() => {
                deactivate();
              }}
            >
              Deactivate
            </button>
          )}

          {!!error && (
            <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
              {getErrorMessage(error)}
            </h4>
          )}
        </div>
      </header>
    </div>
  );
}

export default Dashboard;
