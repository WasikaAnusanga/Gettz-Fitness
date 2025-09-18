import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import EquipmentManagerSidebar from "../components/equipmentManagerSidebar.jsx";

//dummy data
// You can replace these placeholders with real pages later:
const EquipmentHome = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold">Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-gray-500">Active Equipment</div>
        <div className="text-3xl font-bold mt-1">128</div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-gray-500">Items Needing Service</div>
        <div className="text-3xl font-bold mt-1">7</div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-gray-500">Supplements Low Stock</div>
        <div className="text-3xl font-bold mt-1">4</div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border bg-white p-4">
        <h3 className="font-semibold mb-2">Upcoming Maintenance</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex justify-between">
            <span>Treadmill #3 – Belt alignment</span>
            <span className="text-gray-500">Sep 2</span>
          </li>
          <li className="flex justify-between">
            <span>Rowing Machine #2 – Chain lube</span>
            <span className="text-gray-500">Sep 4</span>
          </li>
          <li className="flex justify-between">
            <span>Smith Machine – Cable check</span>
            <span className="text-gray-500">Sep 6</span>
          </li>
        </ul>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h3 className="font-semibold mb-2">Recent Orders</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex justify-between">
            <span>Whey Isolate 5lb (x12)</span>
            <span className="text-gray-500">Delivered</span>
          </li>
          <li className="flex justify-between">
            <span>Rubber Plates 10kg (x20)</span>
            <span className="text-gray-500">Shipped</span>
          </li>
          <li className="flex justify-between">
            <span>Resistance Bands Set (x15)</span>
            <span className="text-gray-500">Processing</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

//give the correct paths and components later
const EquipmentPage = () => <h1>Equipment</h1>;
const SupplementsPage = () => <h1>Supplements</h1>;
const MaintenancePage = () => <h1>Maintenance Logs</h1>;
const PurchasesPage = () => <h1>Purchases</h1>;
const OrdersPage = () => <h1>Orders</h1>;

export default function EquipmentManagerLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Allow access if role is one of the expected equipment-manager roles (adjust to your auth model)
  const role = user?.role?.toLowerCase?.() || "";
  const allowed = ["equipment", "equip_manager", "equipment_manager", "admin"].includes(role);
  if (!allowed) return <Navigate to="/adminLog" replace />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        {/* Sidebar with the requested nav items */}
        <EquipmentManagerSidebar />

        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Equipment Manager Console</h1>
              <div className="text-sm text-gray-500">
                {JSON.parse(localStorage.getItem("user") || "{}")?.firstName || "Manager"}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-4 py-6">
            <Routes>
              {/* Index (Overview) */}
              <Route index element={<EquipmentHome />} />

              {/* Matches the nav items you requested */}
              <Route path="/equipment" element={<EquipmentPage />} />
              <Route path="/supplements" element={<SupplementsPage />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/orders" element={<OrdersPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="." replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
