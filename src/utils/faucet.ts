import { Network } from '@/@types/network'

enum XRPLNetwork {
  Testnet = 'wss://s.altnet.rippletest.net:51233',
  Devnet = 'wss://s.devnet.rippletest.net:51233',
  XahauTestnet = 'wss://hooks-testnet-v3.xrpl-labs.com' // wss://xahau-test.net',
}

enum TokenFaucetURl {
  Testnet = 'https://testnet.faucet.tequ.dev',
  Devnet = 'https://devnet.faucet.tequ.dev',
  // XahauTestnet = 'https://xahau-test.net',
}

export const getXRPFaucetNetwork = (network: Network): XRPLNetwork => {
  if (network === Network.Testnet) {
    return XRPLNetwork.Testnet
  } else if (network === Network.Devnet) {
    return XRPLNetwork.Devnet
  } else if (network === Network.XahauTestnet) {
    return XRPLNetwork.XahauTestnet
  } else {
    throw new Error('invalid network')
  }
}

export const getTokenFaucetUrl = (network: Network) => {
  if (network === Network.Testnet) {
    return TokenFaucetURl.Testnet
  } else if (network === Network.Devnet) {
    return TokenFaucetURl.Devnet
  } else if (network === Network.XahauTestnet) {
    return undefined
  } else {
    throw new Error('invalid network')
  }
}
