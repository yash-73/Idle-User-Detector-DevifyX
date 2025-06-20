import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store , {persistor} from './store/store'
import LoggedOut from './components/LoggedOut'
import { PersistGate } from 'redux-persist/integration/react'

const router = createBrowserRouter([

    {
        path: '',
        element: <App/>,
    },
    {
        path: 'timeout',
        element: <LoggedOut/>
    }
])



createRoot(document.getElementById('root')).render(
  
<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}></PersistGate>
    <RouterProvider router={router}></RouterProvider>
</Provider>
  
)
