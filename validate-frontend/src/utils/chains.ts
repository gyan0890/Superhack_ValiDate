import Chain from '../hooks/chain';

export const gnosisChain: Chain = {
  id: '0x64',
  token: 'xDai',
  shortName: 'gno',
  label: 'Gnosis Chain',
  rpcUrl: 'https://rpc.gnosischain.com',
  blockExplorerUrl: 'https://gnosisscan.io',
  color: '#3e6957',
  transactionServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global',
  isStripePaymentsEnabled: false
}

export const goerliChain: Chain = {
  id: '0x5',
  token: 'gETH',
  label: 'Görli',
  shortName: 'gor',
  rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  color: '#fbc02d',
  transactionServiceUrl: 'https://safe-transaction-goerli.safe.global',
  isStripePaymentsEnabled: false
}

export const modeChain: Chain = {
  id: '0x397',
  token: 'ETH',
  label: 'Mode Testnet',
  shortName: 'ETH',
  rpcUrl: 'https://sepolia.mode.network',
  blockExplorerUrl: 'https://sepolia.explorer.mode.network',
  color: '#DDDDDD',
  isStripePaymentsEnabled: true,
  faucetUrl: ''
}

export const baseGoerli: Chain = {
  id: '0x14a33',
  token: 'ETH',
  shortName: 'ETH',
  label: 'Base Goerli',
  rpcUrl: 'https://base-goerli.public.blastapi.io',
  blockExplorerUrl: 'https://goerli.basescan.org',
  color: '#8248E5',
  isStripePaymentsEnabled: true,
  faucetUrl: 'https://mumbaifaucet.com/'
}

export const optimismGoerli: Chain = {
  id: '0x1a4',
  token: 'ETH',
  shortName: 'ETH',
  label: 'Optimism Goerli',
  rpcUrl: 'https://goerli.optimism.io/',
  blockExplorerUrl: 'https://goerli-optimism.etherscan.io',
  color: '#8248E5',
  isStripePaymentsEnabled: true,
  faucetUrl: 'https://faucet.quicknode.com/base/goerli'
}

const chains: Chain[] = [gnosisChain, goerliChain, modeChain, baseGoerli, optimismGoerli]

export const initialChain = optimismGoerli

export default chains
