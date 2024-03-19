import { ChangeEventHandler, FC, useState } from 'react'

import { Network } from '@/@types/network'

type Networks = Network
type Props = {
  onChange: (network: Networks) => void
}

const networkList: Networks[] = [Network.Testnet, Network.Devnet, Network.XahauTestnet, Network.Local]

export const SelectFaucetNetwork: FC<Props> = ({ onChange }) => {
  const [selectNetwork, setNetwork] = useState<Networks>(Network.Testnet)

  const handleChangeNetwork: ChangeEventHandler<HTMLInputElement> = (e) => {
    const network = e.target.id as Networks
    setNetwork(e.target.id as Networks)
    onChange(network)
  }

  return (
    <>
      <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' html-for='price'>
        Network
      </label>
      <ul className='grid w-full gap-6 '>
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
              className='btn inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-3 text-left normal-case text-gray-500 hover:bg-gray-50 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:bg-blue-200 peer-checked:text-gray-600'
            >
              <div className='flex w-full items-center justify-between'>
                <div className='w-full text-sm font-semibold'>{network}</div>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </>
  )
}
