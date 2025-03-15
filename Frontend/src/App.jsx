import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import './App.css'
import { createBrowserRouter, RouterProvider, Router } from 'react-router-dom'

import ErrorPage from './components/external/ErrorPage'

import Header from './components/external/Header'
import Landing from './components/external/Landing'
import Footer from './components/external/Footer'
import Auth from './components/auth/Auth'

import Dashboard from './components/internal/Dashboard'

const router = createBrowserRouter([
  {
    path: '*',
    element: <div>
      <ErrorPage />
    </div>
  },
  {
    path: '/',
    element: <div className='bg-stone-800'>
      <Header />
      <Landing />
      <Footer />
    </div>
  },
  {
    path: '/auth',
    element: <div>
      <Auth />
    </div>
  },
  {
    path: '/dashboard',
    element: <div>
      <Dashboard />
    </div>
  }
])


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
