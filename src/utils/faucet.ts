import { Network } from '@/@types/network'

enum XRPLNetwork {
  Testnet = 'wss://s.altnet.rippletest.net:51233',
  Devnet = 'wss://s.devnet.rippletest.net:51233',
  AMMDevnet = 'wss://amm.devnet.rippletest.net:51233',
  HooksV3Testnet = 'wss://hooks-testnet-v3.xrpl-labs.com',
}

enum TokenFaucetURl {
  Testnet = 'https://testnet.faucet.tequ.dev',
  Devnet = 'https://devnet.faucet.tequ.dev',
  AMMDevnet = 'https://amm-devnet.faucet.tequ.dev',
  HooksV3Testnet = 'https://hooks-testnet-v3.faucet.tequ.dev',
}

export const getXRPFaucetNetwork = (network: Network): XRPLNetwork => {
  if (network === Network.Testnet) {
    return XRPLNetwork.Testnet
  } else if (network === Network.Devnet) {
    return XRPLNetwork.Devnet
  } else if (network === Network.AMMDevnet) {
    return XRPLNetwork.AMMDevnet
  } else if (network === Network.HooksV3Testnet) {
    return XRPLNetwork.HooksV3Testnet
  } else {
    throw new Error('invalid network')
  }
}

export const getTokenFaucetUrl = (network: Network) => {
  if (network === Network.Testnet) {
    return TokenFaucetURl.Testnet
  } else if (network === Network.Devnet) {
    return TokenFaucetURl.Devnet
  } else if (network === Network.AMMDevnet) {
    return TokenFaucetURl.AMMDevnet
  } else if (network === Network.HooksV3Testnet) {
    return TokenFaucetURl.HooksV3Testnet
  } else {
    throw new Error('invalid network')
  }
}
