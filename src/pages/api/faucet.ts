import type { NextApiRequest, NextApiResponse } from 'next'
import { Client, Wallet } from 'xrpl'

import { LimitChecker } from "../../lib/limitchecker";

const limiter = LimitChecker();

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
type LimitData = {
  text: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<FaucetResponse | LimitData>) {
  if (req.method !== 'POST') {
    res.status(404).end()
  }

  // @ts-ignore
  let ip = req.ip ?? req.headers['x-real-ip'] ?? "";
  const forwardedFor = req.headers["x-forwarded-for"] as string;
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "Unknown";
  }
  try {
    // limit 10 requests per 5 minutes from the same IP
    await limiter.check(10, ip);
  } catch (error) {
    console.error('ip limiting')
    console.error(req.body)
    res.status(429).json({ text: "Rate Limited" });
    return;
  }

  const body = JSON.parse(req.body) as FaucetRequestBody

  try {
    if (body.account) {
      const blockedAddresses = process.env.BLOCKED_ADDRESS?.split(',')
      if (blockedAddresses?.includes(body.account)) {
        console.error('blocked address')
        throw new Error('Address is blocked')
      }
      // limit 1 requests per 5 minutes from the same address
      await limiter.check(1, body.account);
    }
  } catch (error) {
    console.error('account limiting')
    console.error(req.body)
    res.status(429).json({ text: "Rate Limited" });
    return;
  }

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
