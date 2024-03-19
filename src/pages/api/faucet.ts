import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, Wallet } from 'xrpl'

import { Network } from '@/@types/network'
import { getXRPFaucetNetwork } from '@/utils/faucet'

export type FaucetRequestBody = {
  type: 'XRP'
  account?: string
  network: Network
}

export type FaucetDataResponse = { network: Network; address: string; secret?: string; balance: number }
export type FaucetResponse =
  | FaucetDataResponse
  | {
    message: string
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse<FaucetResponse>) {
  if (req.method !== 'POST') {
    res.status(404).end()
  }
  const body = JSON.parse(req.body) as FaucetRequestBody
  const { account, network } = body
  if (network === Network.Local) {
    const wallet = Wallet.generate()
    res.status(200).json({
      network: network,
      address: wallet.address,
      secret: wallet.seed,
      balance: 0,
    })
  } else {
    const server = getXRPFaucetNetwork(network)
    const client = new Client(server)
    await client.connect()
    const response = await client.fundWallet(account && ({ classicAddress: account } as any))
    await client.disconnect()
    res.status(200).json({
      network: network,
      address: response.wallet.classicAddress,
      secret: response.wallet.seed,
      balance: response.balance,
    })
  }
}
