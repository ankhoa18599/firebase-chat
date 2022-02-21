import { AppProvider, AuthProvider } from '../context/provider'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  )

}

export default MyApp
