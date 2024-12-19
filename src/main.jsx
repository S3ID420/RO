import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import Parameters from './Components/Parametres/Parameters.jsx';




createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App></App>
    
  </StrictMode>,
)
