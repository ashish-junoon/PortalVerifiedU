import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/Context/AuthContext.jsx';
import { SidebarProvider } from './components/Context/SidebarContext.jsx';

createRoot(document.getElementById('root')).render(
<StrictMode>
  <AuthProvider>
    <SidebarProvider>
      <App />
      <ToastContainer />
    </SidebarProvider>
  </AuthProvider>
</StrictMode>
)
