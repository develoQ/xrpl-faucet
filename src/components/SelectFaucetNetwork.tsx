import { ChangeEventHandler, FC, useState } from 'react'

import { Network } from '@/@types/network'

type Networks = Network
type Props = {
  onChange: (network: Networks) => void
}

const networkList: Networks[] = [
  Network.Testnet,
  Network.Devnet,
  // Network.NFTDevnet,
  Network.AMMDevnet,
  Network.HooksV2Testnet,
  // Network.HooksV3Testnet,
]

export const SelectFaucetNetwork: FC<Props> = ({ onChange }) => {
  const [selectNetwork, setNetwork] = useState<Networks>(Network.Testnet)

  const handleChangeNetwork: ChangeEventHandler<HTMLInputElement> = (e) => {
    const network = e.target.id as Networks
    setNetwork(e.target.id as Networks)
    onChange(network)
  }

  return (
    <>
      <label className='block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase' html-for='price'>
        ネットワーク
      </label>
      <ul className='grid gap-6 w-full '>
        {networkList.map((network, index) => (
          <li key={index}>
            <input
              type='checkbox'
              id={`${network}`}
              value=''
              className='peer hidden'
              required
              onChange={handleChangeNetwork}
              checked={selectNetwork === network}
            />
            <label
              htmlFor={`${network}`}
              // eslint-disable-next-line tailwindcss/no-custom-classname
              className='inline-flex justify-between items-center p-3 w-full text-left text-gray-500 peer-checked:text-gray-600 hover:text-gray-600 normal-case bg-white peer-checked:bg-blue-200 hover:bg-gray-50 rounded-lg border-2 border-gray-200 peer-checked:border-blue-600 cursor-pointer btn'
            >
              <div className='flex justify-between items-center w-full'>
                <div className='w-full text-sm font-semibold'>{network}</div>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </>
  )
}
