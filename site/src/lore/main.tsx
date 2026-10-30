import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import './lore.css'
import LoreApp from './LoreApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoreApp />
  </StrictMode>,
)
