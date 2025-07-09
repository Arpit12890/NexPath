import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {Provider} from 'react-redux'
import {appStore} from './app/store'
import { Toaster } from './components/ui/sonner'
import { useLoadUserQuery } from './features/api/authApi.js'
import { EnhancedLoadingSpinner } from './components/ui/EnhancedLoadingSpinner.jsx'

//for loading screen when data is fetching
const Custom=({children})=>{
    const {isLoading}=useLoadUserQuery();
    return (
    <>
    {
        isLoading? <EnhancedLoadingSpinner
      />:<>{children}</>
    }
    </>
    )
}
createRoot(document.getElementById('root')).render(

<StrictMode>
    <Provider store={appStore}>
    <Custom>
        <App />
        <Toaster/>
    </Custom>
    </Provider>
</StrictMode>
)
