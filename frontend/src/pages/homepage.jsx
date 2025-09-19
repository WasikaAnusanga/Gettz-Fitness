import Header from "../components/header";
import HomeFooter from "../components/homeFooter";
import PaymentCard from "./client/payment/paymentCard";
import ViewSavedCards from "./client/payment/savedCards";
import HomepageComponent from "../components/homePage";
import { Route, Routes } from "react-router-dom";
import MembershipPlan from "./client/membershipPlan";
import ChatBot from "../components/ChatBot/chatBot"

export default function Homepage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <div className="flex-1 w-full pt-16 h-screen">
        <Routes>
          <Route path="/" element={<HomepageComponent/>}/>
          
          
          <Route path="/*" element={<h1 className="p-6 text-xl text-red-600">404 Not Found</h1>} />
          <Route path="/membership" element={<MembershipPlan/>} />
          <Route path="/membership/savedCards" element={<ViewSavedCards/>} />
          <Route path="/membership/card" element={<PaymentCard/>} />
        </Routes>
      </div>
      <ChatBot/>
      <HomeFooter/>
    </div>
  );
}
