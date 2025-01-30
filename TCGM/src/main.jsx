import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {TCGMCard} from "./TCGMCard.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TCGMCard />
  </StrictMode>,
)
