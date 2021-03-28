import '../styles/globals.css'
import { AppProps } from 'next/app'
import { Store } from "../components/provider"
import "antd/dist/antd.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Store><Component {...pageProps} /></Store>
    </>

  )
}

export default App
