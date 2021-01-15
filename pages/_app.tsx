import '../styles/globals.css'
import { AppProps } from 'next/app'
//import { makeServer } from '../lib/services/api-service'

function App({ Component, pageProps }: AppProps) {
  //const environment = "development";
  //if(process.env.NODE_ENV === environment) {
    //makeServer({ environment })
  //}
  return <Component {...pageProps} />
}

export default App
