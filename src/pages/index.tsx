import type { NextPage } from 'next'
import { ChangeEventHandler, useState } from 'react'
import { isValidClassicAddress } from 'xrpl/dist/npm/utils'

import { FaucetRequestBody, FaucetResponse } from './api/faucet'

import { Network } from '@/@types/network'
import { Button } from '@/components/Button'
import { SelectNFTokenMitFlags } from '@/components/SelectFaucetNetwork'

const Home: NextPage = () => {
  const [error, setError] = useState<string>()
  const [address, setAddress] = useState<string>('')
  const [faucetResult, setFaucetResult] = useState<FaucetResponse | null>(null)
  const [network, setNetwork] = useState<Network>(Network.Testnet)
  const [loading, setLoading] = useState(false)

  const getFaucet = async (network: Network, address?: string) => {
    const body: FaucetRequestBody = {
      account: address,
      network: network,
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
      setError('不正な入力です')
    }
    setAddress(value)
  }

  const handleGetFaucet = async () => {
    setLoading(true)
    setFaucetResult(null)
    const data = await getFaucet(network, address)
    setFaucetResult(data)
    setLoading(false)
  }

  return (
    <div className='flex justify-center'>
      <div className='px-3 mt-36 mb-3 w-full max-w-xl'>
        <h1 className='flex-grow mb-12 text-4xl text-center'>XRP Ledger Faucet</h1>
        <div className='my-8'>
          <SelectNFTokenMitFlags onChange={(n) => setNetwork(n)} />
        </div>

        <div className='items-center focus:bg-white sm:flex'>
          <input
            className={`block w-full appearance-none rounded border bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:outline-none ${
              error && 'border-red-500'
            }`}
            type='text'
            placeholder='XRPL Address'
            value={address}
            onChange={handleAddressChange}
            autoFocus
          />
          <div className='flex justify-center pt-4 sm:pt-0'>
            <Button
              variant='contained'
              className='p-1 ml-2 w-40 text-sm'
              disabled={loading || !!error}
              onClick={handleGetFaucet}
            >
              <div className='flex relative justify-center items-center text-center'>
                {loading && (
                  <svg
                    className='absolute left-0 mr-2 w-4 h-4 text-blue-100 animate-spin'
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
            <div>Account: {faucetResult.address}</div>
            <div>Balance: {faucetResult.balance}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
