import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './UserContext'
import { MenuInicio } from './components/gameLogin/Index'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FunctionsProvider } from "./UserFunctionsContext"; // Importe o Provider
import { Game } from './components/game/index'
import { GameGuard } from './GameGuard'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FunctionsProvider>
        <MenuInicio />
      </FunctionsProvider>
    )
  }, {
    path: "/game",
    element: (
      <FunctionsProvider>
        <GameGuard>
          <Game />
        </GameGuard>
      </FunctionsProvider>
    ),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      {/* RouterProvider agora envolve os componentes que usarão FunctionsProvider */}
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
