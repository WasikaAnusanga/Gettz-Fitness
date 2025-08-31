import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";


import Homepage from "./homepage";
import VideoDetailsPage from "../utils/Testing/Video"
import VideoUpload from "../utils/Testing/videoUpload";


export default function AdminLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.role?.toLowerCase() !== "admin") return <Navigate to="/adminLog" replace />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <AdminSidebar />

        
        <main className="flex-1 min-w-0">
         
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Admin Console</h1>
              <div className="text-sm text-gray-500">
                {JSON.parse(localStorage.getItem("user") || "{}")?.firstName || "Admin"}
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6">
            <Routes>
              
              <Route index element={<Homepage />} />

              
              <Route path="/users" element={<h1>Users</h1>} />
              <Route path="/product" element={<h1>Product</h1>} />
              <Route path="/orders" element={<h1>Orders</h1>} />
              <Route path="/addProduct" element={<h1>Users</h1>} />
              <Route path="/editProduct" element={<h1>Users</h1>} />

              
              <Route path="/trainers" element={<h1>Users</h1>} />
              <Route path="/sessions" element={<h1>Users</h1>} />
              <Route path="/video" element={<VideoDetailsPage />} />
              <Route path="/equipment" element={<h1>Users</h1>} />
              <Route path="/supplement" element={<h1>Users</h1>} />
              <Route path="/membership" element={<h1>Users</h1>} />
              <Route path="/settings" element={<h1>Users</h1>} />
              <Route path="/upload" element={<VideoUpload/>}/>

              <Route path="*" element={<Navigate to="." replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
