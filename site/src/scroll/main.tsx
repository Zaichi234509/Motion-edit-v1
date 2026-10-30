import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles.css'
import './scroll.css'
import ScrollApp from './ScrollApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollApp />
  </StrictMode>,
)
