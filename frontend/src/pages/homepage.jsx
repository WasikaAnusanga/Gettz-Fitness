
import React from "react";
import Header from "../components/header";
import HomeFooter from "../components/homeFooter";
import { Link } from "react-router-dom";

const heroImages = [
  "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=600&q=80",
];
const trainers = [
  { name: "Sam Cole", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Michael Harris", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "John Anderson", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/65.jpg" },
  { name: "Tom Blake", role: "Personal Trainer", img: "https://randomuser.me/api/portraits/men/76.jpg" },
];
const blogPosts = [
  { title: "5 Essential Exercises For Building Muscle", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80", date: "August 14" },
  { title: "The Ultimate Guide to a Balanced Diet", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", date: "August 11" },
  { title: "The Benefits of HIIT Training", img: "https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?auto=format&fit=crop&w=400&q=80", date: "August 8" },
  { title: "Home Workout For Busy People", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80", date: "August 4" },
  { title: "How To Always Stay Motivated", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80", date: "August 2" },
];
import PaymentCard from "./client/payment/paymentCard";
import ViewSavedCards from "./client/payment/savedCards";

export default function Homepage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col">
      <Header />
      <div className="flex-1 w-full pt-16 h-screen">
        <Routes>
          <Route path="/" element={<h1 className="p-6 text-2xl font-bold">Home Page</h1>} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/*" element={<h1 className="p-6 text-xl text-red-600">404 Not Found</h1>} />
          <Route path="/membership" element={<MembershipPlan/>} />
          <Route path="/membership/savedCards" element={<ViewSavedCards/>} />
          <Route path="/membership/card" element={<PaymentCard/>} />
        </Routes>
      </div>
      
      <HomeFooter/>
    </div>
  );
}
