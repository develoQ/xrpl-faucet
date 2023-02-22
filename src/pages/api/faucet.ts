import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { Client } from 'xrpl'

import { Network } from '@/@types/network'
import { getXRPFaucetNetwork, getTokenFaucetUrl } from '@/utils/faucet'

export type FaucetRequestBody =
  | {
      type: 'XRP'
      account?: string
      network: Network
    }
  | {
      type: 'TOKEN'
      account?: string
      network: Network
      currency: string
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
  if (body.type === 'XRP') {
    const server = getXRPFaucetNetwork(body.network)
    const { account, network } = body
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
  } else {
    const url = getTokenFaucetUrl(body.network)
    const { account, currency, network } = body
    const response = await fetch(`${url}/accounts`, {
      method: 'POST',
      body: JSON.stringify({
        currency,
        ...(account ? { destination: account } : {}),
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
      const data = (await response.json()) as any
      console.log(data)
      res.status(400).json({
        message: data.error as string,
      })
      return
    }
    const data = (await response.json()) as any
    res.status(200).json({
      network: network,
      address: data.account.classicAddress,
      secret: data.account?.seed,
      balance: data.balance,
    })
  }
}
