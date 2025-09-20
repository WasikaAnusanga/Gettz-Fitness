
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Users,
  Video as VideoIcon,
  CalendarCheck,
  Wallet,
  Mail,
} from "lucide-react";
import Loader from "../components/lorder-animate";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

const ENDPOINTS = {
  members: "/api/user",       
  // equipment: "/api/equipment", 
  videos: "/api/video",
  attendance: "/api/employeeSalary",
  salaries: "/api/employeeSalary",
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [members, setMembers] = useState([]);
  // const [equipment, setEquipment] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // -------------------- Fetch helpers --------------------
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  const extractArray = (payload) => {
    if (Array.isArray(payload)) return payload;
    // try common shapes
    return (
      payload?.items ||
      payload?.data ||
      payload?.results ||
      payload?.users ||
      []
    );
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_BACKEND_URL;
      const headers = getAuthHeaders();

      const [
        resMembers,
  // resEquipment,
        resVideos,
        resAttendance,
        resSalaries,
      ] = await Promise.all([
        axios.get(`${base}${ENDPOINTS.members}`, { headers }),
  // axios.get(`${base}${ENDPOINTS.equipment}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${base}${ENDPOINTS.videos}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${base}${ENDPOINTS.attendance}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${base}${ENDPOINTS.salaries}`, { headers }).catch(() => ({ data: [] })),
      ]);

      const rawUsers = extractArray(resMembers.data);
      setMembers(
        rawUsers.filter((u) => String(u.role || "").toLowerCase() === "user")
      );
      // setEquipment(extractArray(resEquipment.data));
      // Fetch inquiries
      axios.get(`${base}/api/inquiry/viewAll`, { headers })
        .then((res) => setInquiries(Array.isArray(res.data) ? res.data : []))
        .catch(() => setInquiries([]));
      setVideos(extractArray(resVideos.data));
      setAttendance(extractArray(resAttendance.data));
      setSalaries(extractArray(resSalaries.data));
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.status === 401
          ? "Unauthorized — please sign in again."
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // -------------------- Totals --------------------
  const totals = useMemo(
    () => ({
      members: members.length,
  // equipment: equipment.length,
  inquiries: inquiries.length,
      videos: videos.length,
      attendance: attendance.length,
      salaries: salaries.length,
    }),
  [members, inquiries, videos, attendance, salaries]
  );

  const tryParseDate = (item) => {
    const v =
      item?.createdAt ||
      item?.created_at ||
      item?.date ||
      item?.payDate ||
      item?.attendanceDate ||
      item?.updatedAt ||
      item?.joinedAt;
    const d = v ? new Date(v) : null;
    return isNaN(d?.getTime?.()) ? null : d;
  };

  const monthKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

  const lastNMonthsKeys = (n = 6) => {
    const now = new Date();
    const keys = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(monthKey(d));
    }
    return keys;
  };

  const buildSeries = (items) => {
    const bucket = {};
    items.forEach((it) => {
      const d = tryParseDate(it);
      if (!d) return;
      const k = monthKey(new Date(d.getFullYear(), d.getMonth(), 1));
      bucket[k] = (bucket[k] || 0) + 1;
    });
    const keys = lastNMonthsKeys(6);
    return keys.map((k) => ({
      month: k,
      count: bucket[k] || 0,
    }));
  };

  const seriesMembers = useMemo(() => buildSeries(members), [members]);
  const seriesVideos = useMemo(() => buildSeries(videos), [videos]);
  const seriesAttendance = useMemo(() => buildSeries(attendance), [attendance]);
  const seriesInquiries = useMemo(() => buildSeries(inquiries), [inquiries]);

  const mergedTrend = useMemo(() => {
    const keys = lastNMonthsKeys(6);
    const m = Object.fromEntries(keys.map((k) => [k, { month: k }]));
    seriesMembers.forEach((p) => (m[p.month].members = p.count));
    seriesVideos.forEach((p) => (m[p.month].videos = p.count));
    seriesAttendance.forEach((p) => (m[p.month].attendance = p.count));
    seriesInquiries.forEach((p) => (m[p.month].inquiries = p.count));
    return keys.map((k) => ({
      month: k,
      members: m[k].members || 0,
      videos: m[k].videos || 0,
      attendance: m[k].attendance || 0,
      inquiries: m[k].inquiries || 0,
    }));
  }, [seriesMembers, seriesVideos, seriesAttendance, seriesInquiries]);

  const barData = useMemo(
    () => [
      { name: "Members", value: totals.members },
      { name: "Inquiries", value: totals.inquiries },
      { name: "Videos", value: totals.videos },
      { name: "Attendance", value: totals.attendance },
      { name: "Salaries", value: totals.salaries },
    ],
    [totals]
  );

  const StatCard = ({ icon: Icon, label, value, accent = "bg-red-600" }) => (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm flex items-center gap-4">
      <div className={`h-12 w-12 ${accent} text-white rounded-xl grid place-items-center`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full p-2 sm:p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-neutral-500">Overview & insights</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Stat grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
            <StatCard icon={Users} label="Members" value={totals.members} accent="bg-rose-600" />
            <StatCard icon={Mail} label="Inquiries" value={totals.inquiries} accent="bg-blue-600" />
            <StatCard icon={VideoIcon} label="Videos" value={totals.videos} accent="bg-emerald-600" />
            <StatCard icon={CalendarCheck} label="Attendance" value={totals.attendance} accent="bg-amber-600" />
            <StatCard icon={Wallet} label="Salaries" value={totals.salaries} accent="bg-indigo-600" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Totals bar chart */}
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-semibold">Totals by Category</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend line chart */}
            <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-semibold">Last 6 Months Trend</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mergedTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="members" />
                    <Line type="monotone" dataKey="videos" />
                    <Line type="monotone" dataKey="attendance" />
                    <Line type="monotone" dataKey="inquiries" stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
