import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './UserContext'
import ModalInicio from './components/modals/Index'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FunctionsProvider } from "./UserFunctionsContext"; // Importe o Provider
import { Game } from './components/game/index'

const router = createBrowserRouter([
  {
    path:"/",
    element:(
      <FunctionsProvider>
        <ModalInicio/>
      </FunctionsProvider>
    )
  },{
    path:"/game",
    element: (
      <FunctionsProvider>
        <Game/>
      </FunctionsProvider>
    )
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      {/* RouterProvider agora envolve os componentes que usarão FunctionsProvider */}
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
