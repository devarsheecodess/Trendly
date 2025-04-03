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

import Sidebar from './components/internal/Sidebar'
import Dashboard from './components/internal/Dashboard'
import Onbording from './components/internal/Onbording'
import ScriptWritting from './components/internal/ScriptWritting'
import VoiceOver from './components/internal/VoiceOver'
import Thumbnail from './components/internal/Thumbnail'
import SEO from './components/internal/SEO'
import Post from './components/internal/Post'
import Profile from './components/internal/Profile'
import History from './components/internal/History'
import Verification from './components/auth/Verification'
import GoogleSignupDetails from './components/auth/GoogleSignupDetails'

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
    path: '/oauth/details',
    element: <div>
      <GoogleSignupDetails />
    </div>
  },
  {
    path: '/verify',
    element: <div>
      <Verification />
    </div>
  },
  {
    path: '/onboarding',
    element: <div>
      <Onbording />
    </div>
  },
  {
    path: '/dashboard',
    element: <div>
      <Sidebar />
      <Dashboard />
    </div>
  },
  {
    path: '/script',
    element: <div>
      <Sidebar />
      <ScriptWritting />
    </div>
  },
  {
    path: '/voiceover',
    element: <div>
      <Sidebar />
      <VoiceOver />
    </div>
  },
  {
    path: '/thumbnail',
    element: <div>
      <Sidebar />
      <Thumbnail />
    </div>
  },
  {
    path: '/seo',
    element: <div>
      <Sidebar />
      <SEO />
    </div>
  },
  {
    path: '/post',
    element: <div>
      <Sidebar />
      <Post />
    </div>
  },
  {
    path: '/profile',
    element: <div>
      <Sidebar />
      <Profile />
    </div>
  },
  {
    path: '/history',
    element: <div>
      <Sidebar />
      <History />
    </div>
  },
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
