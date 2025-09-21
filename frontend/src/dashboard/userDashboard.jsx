import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import UserSidebar from "../components/userSidebar.jsx";
import { User } from "lucide-react";

import Dashboard from "../pages/user/dashboard.jsx";
import RequestMeals from "../pages/user/requestMeal.jsx";
import CurrentMeal from "../pages/user/currentMeal.jsx";
import SaveCards from "../pages/client/cards/viewCards.jsx";
import AddCardForm from "../pages/client/cards/addCards.jsx";
import UpdateCardForm from "../pages/client/cards/updateCard.jsx";
import ViewSubscription from "../pages/client/mySubscription/viewSubscription.jsx";

export default function UserLayout() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const fullName = userData.firstName;
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <UserSidebar />

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-semibold">User Dashboard</h1>
              <div className="flex items-center">
                <Link to="/">
                  <div className="mr-5 cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 active:bg-red-800 transition">
                    Home
                  </div>
                </Link>
                <Link to="/userDashboard">
                  <div className="border border-red-500 flex items-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-slate-700">
                    <User className="h-4 w-4 text-slate-500" />
                    <span>{fullName}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-0 py-0">
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />
              <Route path="requestMeal" element={<RequestMeals />} />
              <Route path="currentMeal" element={<CurrentMeal/>} />
              <Route path="/manageCards" element={<SaveCards />} />
              <Route path="/manageCards/addCard" element={<AddCardForm />} />
              <Route
                path="/manageCards/updateCard"
                element={<UpdateCardForm />}
              />
              <Route path="/mySubscription" element={<ViewSubscription />} />


              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
