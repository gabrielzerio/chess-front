import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './UserContext'
import ModalInicio from './components/modals/Modal'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Game } from './components/game/index'

const router = createBrowserRouter([
  {
    path:"/",
    element:<ModalInicio/>
  },{
    path:"/game",
    element: <Game/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
