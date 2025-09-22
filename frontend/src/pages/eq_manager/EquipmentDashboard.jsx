// src/pages/EquipmentDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function EquipmentDashboard() {
  const [equipment, setEquipment] = useState([]);
  const [logs, setLogs] = useState([]);
  const [supplements, setSupplements] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/equipment`).then((res) => {
      setEquipment(res.data.equipment || []);
    });
    axios.get(`${API_BASE}/api/maintenanceLogs`).then((res) => {
      setLogs(res.data.logs || []);
    });
    axios.get(`${API_BASE}/api/supplement`).then((res) => {
      setSupplements(res.data.supplement || []);
    });
  }, []);

  // Group equipment by status
  const equipmentStatusData = Object.values(
    equipment.reduce((acc, item) => {
      acc[item.Eq_status] = acc[item.Eq_status] || { name: item.Eq_status, value: 0 };
      acc[item.Eq_status].value++;
      return acc;
    }, {})
  );

  // Count maintenance logs by type
  const logTypeData = Object.values(
    logs.reduce((acc, log) => {
      acc[log.M_logType] = acc[log.M_logType] || { type: log.M_logType, count: 0 };
      acc[log.M_logType].count++;
      return acc;
    }, {})
  );

  const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#fbbf24"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Equipment Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-gray-500">Total Equipment</h2>
          <p className="text-3xl font-bold">{equipment.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-gray-500">Supplements</h2>
          <p className="text-3xl font-bold">{supplements.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-gray-500">Maintenance Logs</h2>
          <p className="text-3xl font-bold">{logs.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Equipment Status Pie Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Equipment by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={equipmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="value"
                nameKey="name"
              >
                {equipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Logs Bar Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Maintenance Logs by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={logTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
