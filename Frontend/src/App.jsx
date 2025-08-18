import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/Auth/LoginPage'



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
