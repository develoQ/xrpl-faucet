import '../../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>XRP Ledger Faucet</title>
        <meta name='description' content='Provides XRP to XRP Ledger testnet account.' />
        <link rel='icon' href='/favicon.svg' />
        <meta name='viewport' content='width=device-width,initial-scale=1.0' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://faucet.tequ.dev' />
        <meta property='og:title' content='XRP Ledger Faucet' />
        <meta property='og:image' content='https://faucet.tequ.dev/ogp.png' />
        <meta name='og:description' content='Provides XRP to XRP Ledger testnet account.' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:creator' content='@_tequ_' />
      </Head>
      <Header />
      <main className=''>
        <Component {...pageProps} />
        <Analytics />
      </main>
      <Footer />
    </>
  )
}

export default MyApp
