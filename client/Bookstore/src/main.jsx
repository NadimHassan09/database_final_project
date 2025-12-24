import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/Components.css';
import './styles/Header.css';
import './styles/Navbar.css';
import './styles/SearchBar.css';
import './styles/Footer.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
