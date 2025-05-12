import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ChessGame from './App'
import { UserProvider } from './UserContext'
import ModalInicio from './Modal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <ChessGame />
      <ModalInicio/>
    </UserProvider>
  </StrictMode>
)
