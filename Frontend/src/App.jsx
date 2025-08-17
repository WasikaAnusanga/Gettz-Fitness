import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage'
import AdminPage from './pages/adminPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Testing from './pages/testing'
import { Toaster } from 'react-hot-toast'
import RegisterPage from "./pages/client/register"
import Homepage from './pages/homepage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Toaster position='top-right' />
      <Routes path="/*">
        <Route path="/login" element={<LoginPage />} />
      </Routes>

    </BrowserRouter>

  )
}

export default App
