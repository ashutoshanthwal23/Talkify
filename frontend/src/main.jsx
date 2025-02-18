// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
     <Provider store={store}>
        <App />
        <ToastContainer newestOnTop={false} />
     </Provider>
  // </StrictMode>,
)
