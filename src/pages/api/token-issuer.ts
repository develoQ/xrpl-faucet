import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

import { Network } from '@/@types/network'
import { getTokenFaucetUrl } from '@/utils/faucet'

export type TokenIssuerRequestBody = {
  network: Network
}

export type TokenIssuerResponse = {
  issuer: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TokenIssuerResponse>) {
  if (req.method !== 'POST') {
    res.status(404).end()
  }
  const body = JSON.parse(req.body) as TokenIssuerRequestBody

  const url = getTokenFaucetUrl(body.network)
  const response = await fetch(`${url}/issuer`)

  const data = (await response.json()) as any
  res.status(200).json({
    issuer: data.issuer,
  })
}
