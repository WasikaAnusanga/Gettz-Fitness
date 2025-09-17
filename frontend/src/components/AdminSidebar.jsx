import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Dumbbell, CalendarClock, Video,
  Wrench, Pill, BadgePercent, Settings, Menu, IdCardLanyard
} from "lucide-react";
import GymLogo from "../assets/GymLogo.jpg";

const linkBase =
  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all";
const activeStyle =
  "text-white bg-gradient-to-r from-red-600 via-red-500 to-black shadow-lg shadow-red-200";
const idleStyle =
  "text-gray-700 hover:text-red-600 hover:bg-gray-100";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Members", icon: Users },
  { to: "/admin/trainers", label: "Trainers", icon: Dumbbell },
  { to: "/admin/sessions", label: "Sessions", icon: CalendarClock },
  { to: "/admin/video", label: "Video", icon: Video },
  { to: "/admin/equipment", label: "Equipment", icon: Wrench },
  { to: "/admin/supplement", label: "Supplement", icon: Pill },
  { to: "/admin/membership", label: "Membership", icon: BadgePercent },
  { to: "/admin/workshift", label: "Employees", icon: IdCardLanyard},
  { to: "/admin/settings", label: "Settings", icon: Settings },
  
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } sticky top-0 h-screen shrink-0 border-r bg-white transition-all`}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <img src={GymLogo} alt="Gettz" className="h-9 w-9 rounded-full" />
          {open && (
            <span className="text-base font-bold text-red-600">Gettz Admin</span>
          )}
        </div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="px-2 pt-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyle : idleStyle}`
            }
          >
            <Icon className="h-4 w-4" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}

        <div className="mt-3 border-t pt-3">
          <div className={`px-3 ${open ? "text-xs text-gray-500 mb-1" : "sr-only"}`}>
            Commerce
          </div>
          <NavLink
            to="/admin/product"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyle : idleStyle}`
            }
          >
            <span className="h-4 w-4 rounded bg-red-600 inline-block" />
            {open && <span>Products</span>}
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyle : idleStyle}`
            }
          >
            <span className="h-4 w-4 rounded bg-black inline-block" />
            {open && <span>Orders</span>}
          </NavLink>
          <NavLink
            to="/admin/addProduct"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyle : idleStyle}`
            }
          >
            <span className="h-4 w-4 rounded bg-red-500 inline-block" />
            {open && <span>Add Product</span>}
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
