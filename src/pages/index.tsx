import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ChangeEventHandler, useCallback, useEffect, useState } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'
import { isValidClassicAddress } from 'xrpl/dist/npm/utils'

import { FaucetDataResponse, FaucetRequestBody, FaucetResponse } from './api/faucet'
import { TokenIssuerResponse } from './api/token-issuer'
import { SetTrustLineRequestBody, SetTrustlineResponse } from './api/trustline'

import { Network } from '@/@types/network'
import { Button } from '@/components/Button'
import { SelectFaucetNetwork } from '@/components/SelectFaucetNetwork'
import { isValidRepresentation } from '@/utils/currency'

const TOKEN_TYPE = ['XRP', 'TOKEN'] as const

const Home: NextPage = () => {
  const route = useRouter()
  const [error, setError] = useState<string>()
  const [address, setAddress] = useState<string>('')
  const [issuer, setIssuer] = useState<string>('')
  const [tokenCode, setTokenCode] = useState<string>('')
  const [faucetResult, setFaucetResult] = useState<FaucetDataResponse | null>(null)
  const [network, setNetwork] = useState<Network>(Network.Testnet)
  const [tokenType, setTokenType] = useState<typeof TOKEN_TYPE[number]>('XRP')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const f = async () => {
      const response: TokenIssuerResponse = await (
        await fetch('/api/token-issuer', {
          method: 'POST',
          body: JSON.stringify({ network }),
        })
      ).json()
      setIssuer(response.issuer)
    }
    f()
  }, [network])

  const getFaucet = async (network: Network, address?: string) => {
    let body: FaucetRequestBody
    if (tokenType === 'XRP') {
      body = {
        type: tokenType,
        account: address,
        network: network,
      }
    } else {
      body = {
        type: tokenType,
        account: address,
        network: network,
        currency: tokenCode,
      }
    }

    const response: FaucetResponse = await (
      await fetch('/api/faucet', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    ).json()
    return response
  }

  const handleAddressChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setError(undefined)
    if (value !== '' && !isValidClassicAddress(value)) {
      setError('Invalid Address')
    }
    setAddress(value)
  }

  const handleTokenCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value
    setError(undefined)
    if (value === '' || !isValidRepresentation(value)) {
      setError('Invalid TokenCode')
    }
    setTokenCode(value)
  }

  const handleGetFaucet = async () => {
    setLoading(true)
    setFaucetResult(null)
    try {
      const data = (await getFaucet(network, address)) as any
      if (!data?.message) {
        setFaucetResult(data)
      } else {
        setError(data.message)
      }
    } catch (e) {
      setError('Error')
    }
    setLoading(false)
  }

  const handleSetTrustLine = useCallback(async () => {
    const body: SetTrustLineRequestBody = {
      currency: tokenCode,
      issuer,
    }
    const response: SetTrustlineResponse = await (
      await fetch('/api/trustline', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    ).json()
    const { payload_url } = response
    window.open(payload_url, '_blank')
  }, [issuer, tokenCode])

  return (
    <div className='flex justify-center'>
      <div className='mb-3 w-full max-w-xl py-36 px-3'>
        <h1 className='mb-12 flex-grow text-center font-title text-5xl'>XRP Ledger Faucet</h1>
        <div className='my-8'>
          <SelectFaucetNetwork onChange={(n) => setNetwork(n)} />
        </div>

        <div className='mt-12 mb-8 flex justify-center'>
          <div className='btn-group w-full max-w-xs'>
            {TOKEN_TYPE.map((type) => (
              <button
                key={type}
                className={overrideTailwindClasses(
                  `btn btn-primary w-1/2 ${tokenType === type ? 'btn-active' : 'btn-outline'}`
                )}
                onClick={() => setTokenType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {tokenType === 'TOKEN' && (
          <>
            Token Issuer: <span className='text-sm sm:text-base'>{issuer}</span>
          </>
        )}
        <div className='items-center focus:bg-white sm:flex'>
          <div className='w-full space-y-2'>
            {tokenType === 'TOKEN' && (
              <input
                className={`input block w-full appearance-none rounded border bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:outline-none ${
                  error && 'border-red-500'
                }`}
                type='text'
                placeholder='Token Code (USD/EUR...)'
                value={tokenCode}
                onChange={handleTokenCodeChange}
                autoFocus
              />
            )}
            <input
              className={`input block w-full appearance-none rounded border bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:outline-none ${
                error && 'border-red-500'
              }`}
              type='text'
              placeholder='XRPL Address (r...)'
              value={address}
              onChange={handleAddressChange}
              autoFocus
            />
          </div>
          <div className='flex justify-center pt-4 sm:block sm:space-y-2 sm:pt-0'>
            {tokenType === 'TOKEN' && (
              <Button
                variant='outline'
                className='ml-2 w-36 p-1 text-sm normal-case md:w-40'
                disabled={loading || !!error}
                onClick={handleSetTrustLine}
              >
                Set TrustLine
              </Button>
            )}
            <Button
              variant='contained'
              className='ml-2 w-36 p-1 text-sm md:w-40'
              disabled={loading || !!error}
              onClick={handleGetFaucet}
            >
              <div className='relative flex items-center justify-center text-center normal-case'>
                {loading && (
                  <svg
                    className='absolute mr-2 h-8 w-8 animate-spin text-blue-700'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                )}
                Get Faucet
              </div>
            </Button>
          </div>
        </div>
        {error && <span className='ml-2 text-sm text-red-600'>{error}</span>}
        {faucetResult && (
          <div className='mt-12'>
            <div>Network: {faucetResult?.network}</div>
            <div>
              Account: <span className='text-sm sm:text-base'>{faucetResult.address}</span>
            </div>
            {faucetResult.secret && <div>Secret: {faucetResult.secret}</div>}
            <div>Balance: {faucetResult.balance}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
