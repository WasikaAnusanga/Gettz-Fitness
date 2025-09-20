import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/loginPage";
import AdminLayout from "./pages/adminPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Testing from "./pages/testing";
import { Toaster } from "react-hot-toast";
import SignupPage from "./pages/Signup";
import Homepage from "./pages/homepage";
import AdminLoginForm from "./pages/admin/adminLogging";
import TestingCheckout from "./pages/testingCheckout";
import PaymentSuccess from "./pages/client/paymentSuccess";
import { GoogleOAuthProvider } from "@react-oauth/google";
import VideoPortal from "./pages/client/VideoPortal";
import VideoDetails from "./pages/client/VideoDetails";
import EquipmentManagerLayout from "./dashboard/equipmentManagerDashboard";
import TrainerLayout from "./dashboard/trainerDashboard";
import UserLayout from "./dashboard/userDashboard";
import CommunityFeed from './pages/client/communityPosts';
import ChallengesPage from './pages/client/challengesPage';
import AddNotification from './pages/AddNotification';
import Leaderboard from './pages/leaderboard';
import ChatBot from './components/ChatBot/chatBot';


function App() {
  const [count, setCount] = useState(0);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/trainerDashboard/*" element={<TrainerLayout />} />
          <Route path="/userDashboard/*" element={<UserLayout />} />
            <Route path="/login" element={<LoginPage />} />
          <Route
            path="/checkout"
            element={<TestingCheckout></TestingCheckout>}
          />
          <Route path="/testing" element={<Testing />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/adminLog" element={<AdminLoginForm />} />
          <Route
            path="/payment-success"
            element={<PaymentSuccess></PaymentSuccess>}
          />
          <Route path="/equip-manager/*" element={<EquipmentManagerLayout />} />
          <Route path="/community" element={<CommunityFeed/>}/>
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/admin/notifications/new" element={<AddNotification />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/my" element={<testing></testing>} />

          <Route path="/*" element={<Homepage />} />
          <Route path="/eq_manager/*" element={<EquipmentManagerLayout />} />

          <Route path="/videos" element={<VideoPortal />} />
          <Route path="/videos/:videoId" element={<VideoDetails />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />

        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
