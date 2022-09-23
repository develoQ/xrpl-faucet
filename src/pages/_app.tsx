import '../../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>XRP Ledger Faucet</title>
        <meta name='description' content='Provides XRP to XRP Ledger&#39;s testnet address.' />
        <link rel='icon' href='/favicon.svg' />
      </Head>
      <Header />
      <main className=''>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

export default MyApp
