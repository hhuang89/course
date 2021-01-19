import '../styles/globals.css'
import { AppProps } from 'next/app'
import { makeServer } from '../mock/index'
import { environment } from '../lib/services/api-service'


if(process.env.NODE_ENV === 'development') {
    makeServer( {environment: 'development'} )
}

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
