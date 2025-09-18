import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,Dumbbell, Pill, ClipboardList, ShoppingCart, Menu
} from "lucide-react";
import GymLogo from "../assets/GymLogo.jpg";
import { BiPurchaseTag  } from "react-icons/bi";

const linkBase =
  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all";
const activeStyle =
  "text-white bg-gradient-to-r from-red-600 via-red-500 to-black shadow-lg shadow-red-200";
const idleStyle =
  "text-gray-700 hover:text-red-600 hover:bg-gray-100";

  //change the path directions accordingly
  //dummy paths are here for now
const navItems = [
  { to: "/equip-manager", label: "Dashboard", icon: LayoutDashboard}, 
  { to: "/equip-manager/equipment", label: "Equipment", icon: Dumbbell },
  { to: "/equip-manager/supplements", label: "Supplements", icon: Pill },
  { to: "/equip-manager/maintenance", label: "Maintenance Logs", icon: ClipboardList },
  { to: "/equip-manager/purchases", label: "Purchases", icon: BiPurchaseTag },
  { to: "/equip-manager/orders", label: "Orders", icon: ShoppingCart },
];

export default function EquipmentManagerSidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-16"
      } sticky top-0 h-screen shrink-0 border-r bg-white transition-all`}
    >
      {/* Top Logo + Toggle */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <img src={GymLogo} alt="Gettz" className="h-9 w-9 rounded-full" />
          {open && (
            <span className="text-base font-bold text-red-600">
              Equipment Manager
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="px-2 pt-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/equip-manager"}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeStyle : idleStyle}`
            }
          >
            <Icon className="h-4 w-4" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
