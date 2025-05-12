import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ChessGame from './App'
import { UserProvider } from './UserContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <ChessGame />
      
    </UserProvider>
  </StrictMode>
)
