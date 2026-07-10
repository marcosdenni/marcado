import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { ListasPage } from './pages/ListasPage'
import { ListaDetalhePage } from './pages/ListaDetalhePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ListasPage /> },
      { path: 'listas/:id', element: <ListaDetalhePage /> },
    ],
  },
])
