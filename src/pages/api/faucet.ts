import type { NextApiRequest, NextApiResponse } from 'next'
import { Client } from 'xrpl'

import { Network } from '@/@types/network'

enum XRPLNetwork {
  Testnet = 'wss://s.altnet.rippletest.net:51233',
  Devnet = 'wss://s.devnet.rippletest.net:51233',
  NFTDevnet = 'wss://xls20-sandbox.rippletest.net:51233',
  AMMDevnet = 'wss://amm.devnet.rippletest.net:51233',
  HooksTestnetV2 = 'wss://hooks-testnet-v2.xrpl-labs.com',
}

export type FaucetRequestBody = {
  account?: string
  network: Network
}

export type FaucetResponse = {
  address: string
  secret?: string
  balance: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<FaucetResponse>) {
  if (req.method !== 'POST') {
    res.status(404).end()
  }
  const { account, network } = JSON.parse(req.body) as FaucetRequestBody

  let server: XRPLNetwork
  if (network === Network.Testnet) {
    server = XRPLNetwork.Testnet
  } else if (network === Network.Devnet) {
    server = XRPLNetwork.Devnet
  } else if (network === Network.NFTDevnet) {
    server = XRPLNetwork.NFTDevnet
  } else if (network === Network.AMMDevnet) {
    server = XRPLNetwork.AMMDevnet
  } else if (network === Network.HooksTestnetV2) {
    server = XRPLNetwork.HooksTestnetV2
  } else {
    throw new Error('invalid network')
  }

  const faucetHost = server === XRPLNetwork.AMMDevnet ? 'ammfaucet.devnet.rippletest.net' : server === XRPLNetwork.HooksTestnetV2 ? 'hooks-testnet-v2.xrpl-labs.com' : undefined

  const client = new Client(server)
  await client.connect()
  const response = await client.fundWallet(account && { classicAddress: account } as any, {
    // TODO: remove this line if xrpl.js corresponds to amm-devnet
    faucetHost
  })
  await client.disconnect()
  res.status(200).json({ address: response.wallet.classicAddress, secret: response.wallet.seed, balance: response.balance })
}
