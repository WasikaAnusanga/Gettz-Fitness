import { useState } from 'react'
import './App.css'
import LoginPage from './pages/loginPage'
import AdminLayout from "./pages/adminPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Testing from './pages/testing'
import { Toaster } from 'react-hot-toast'
import SignupPage from './pages/Signup'
import Homepage from './pages/homepage'
import AdminLoginForm from './pages/admin/adminLogging'
import Video from './pages/admin/VideoPage';
import TestingCheckout from './pages/testingCheckout'
import PaymentSuccess from './pages/client/paymentSuccess'
import TrainerLayout from './dashboard/trainerDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Toaster position='top-right' />
      <Routes path="/*">

        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<TestingCheckout></TestingCheckout>}/>
        <Route path="/testing" element={<Testing />} />
        <Route path="/register" element={<SignupPage/>} />
        <Route path="/adminLog" element={<AdminLoginForm/>}/>        
        <Route path="/video" element={<Video/>}/>
        <Route path="/payment-success" element={<PaymentSuccess></PaymentSuccess>}/>
        <Route path="/*" element={<Homepage />} />
        <Route path="/trainerDashboard/*" element={<TrainerLayout/>} />
        

      </Routes>

    </BrowserRouter>

  )
}

export default App
