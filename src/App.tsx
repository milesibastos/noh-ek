import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import Pages from './pages';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Pages />
    </Web3ReactProvider>
  );
}

export default App;
