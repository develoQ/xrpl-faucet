import type { NextApiRequest, NextApiResponse } from 'next'
import { Xumm } from 'xumm'

export type SetTrustLineRequestBody = {
  issuer: string
  currency: string
}

export type SetTrustlineResponse = {
  payload_url: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SetTrustlineResponse>) {
  if (req.method !== 'POST') {
    res.status(404).end()
  }
  const xumm = new Xumm(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET)

  const { issuer, currency } = JSON.parse(req.body) as SetTrustLineRequestBody

  const payload = await xumm.payload?.create({
    txjson: {
      TransactionType: 'TrustSet',
      LimitAmount: {
        issuer,
        currency,
        value: '10000000',
      },
    },
  })
  if (!payload) {
    res.status(500).json({} as any)
    return
  }

  res.status(200).json({
    payload_url: payload.next.always,
  })
}
