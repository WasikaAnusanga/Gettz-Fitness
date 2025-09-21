import { useEffect, useState } from "react";
import axios from "axios";
import Profilepic from "../../../assets/default-avatar.png";
export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user?.email) {
      setLoading(false);
      return;
    }
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/viewAdmins`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const found = Array.isArray(res.data)
          ? res.data.find((a) => a.email === user.email)
          : null;
        setAdmin(found || user);
      })
      .catch(() => setAdmin(user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!admin)
    return <div className="p-8 text-center text-red-600">Admin not found.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
      <div className="flex flex-col items-center gap-4">
        <img
          src={Profilepic}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <h2 className="text-2xl font-bold">{admin.firstName} {admin.lastName}</h2>
        <p className="text-neutral-500">{admin.email}</p>
        <div className="grid grid-cols-2 gap-4 w-full mt-4">
          <div>
            <div className="text-xs text-neutral-500">Admin ID</div>
            <div className="font-medium">{admin.adminId}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500">Phone</div>
            <div className="font-medium">{admin.phone || admin.phoneNumber || "-"}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500">Role</div>
            <div className="font-medium">{admin.role}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500">Last Login</div>
            <div className="font-medium">{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
