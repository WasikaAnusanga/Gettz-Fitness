import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TrainerSidebar from "../components/TrainerSidebar.jsx";

import Homepage from "../pages/homepage";
import RequestedMeals from "../pages/trainer/requestedMeals.jsx";
import MealPlans from "../pages/trainer/mealPlans.jsx";

export default function TrainerLayout() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <TrainerSidebar/>

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Trainer Console</h1>
              <div className="text-sm text-gray-500">
               <p>Trainer</p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6">
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="/reqMeals" element={<RequestedMeals/>} />
              <Route path="/mealPlans" element={<MealPlans/>} />
             

              <Route path="*" element={<Navigate to="." replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
