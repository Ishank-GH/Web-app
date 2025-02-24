import './index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router';
import UserContext from './context/UserContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <UserContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContext>  
  </StrictMode>,
)
