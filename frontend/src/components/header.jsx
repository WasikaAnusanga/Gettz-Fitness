import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import GymLogo from "../assets/GymLogo.jpg";
import DefaultAvatar from "../assets/default-avatar.png";
import NotificationBell from "./notificationBell/NotificationBell"

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const readUser = () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) return JSON.parse(userStr);
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setUser(readUser());
  }, [location.pathname]);


  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") setUser(readUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  

  const displayName = useMemo(() => {
    if (!user) return "Guest";
    if (user.firstName) {
      return [user.firstName].filter(Boolean).join(" ").trim();
    }
    if (user.name && typeof user.name === "string") return user.name;
    if (user.email && typeof user.email === "string") return user.email.split("@")[0];
    return "Member";
  }, [user]);


  const avatarSrc = useMemo(() => {
    if (user?.avatar && typeof user.avatar === "string" && user.avatar.startsWith("http")) return user.avatar;
    if (user?.profilePicture && typeof user.profilePicture === "string" && user.profilePicture.startsWith("http")) return user.profilePicture;
    if (user?.profilePicture && typeof user.profilePicture === "string") return user.profilePicture;
    if (user?.avatar && typeof user.avatar === "string") return user.avatar;
    return DefaultAvatar;
  }, [user]);

  const linkClasses = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
      isActive
        ? "text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-orange-200"
        : "text-gray-700 hover:text-red-600 hover:bg-gray-100/80 hover:shadow-sm "
    }`;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={GymLogo} alt="Gettz Fitness" className="h-10 w-10 rounded-full" />
          <span className="text-xl font-bold text-red-600">Gettz Fitness</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/" className={linkClasses}>Home</NavLink>
          <NavLink to="/about" className={linkClasses}>About</NavLink>
          <NavLink to="/membership" className={linkClasses}>Membership</NavLink>
          <NavLink to="/trainers" className={linkClasses}>Trainers</NavLink>
          <NavLink to="/videos" className={linkClasses}>Video portal</NavLink>
          <NavLink to="/contact" className={linkClasses}>Contact</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
               <NotificationBell/>
              <img
                src={avatarSrc}
                alt={displayName || "User"}
                className="h-8 w-8 rounded-full object-cover border"
                onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
              />
              <Link
                to="/user/dashboard"
                className="font-medium text-gray-700 hover:text-red-600 underline-offset-2 hover:underline transition"
              >
                {displayName}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded-lg shadow hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col px-6 py-4 space-y-3">
            <NavLink to="/" onClick={() => setOpen(false)} className={linkClasses}>Home</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className={linkClasses}>About</NavLink>
            <NavLink to="/membership" onClick={() => setOpen(false)} className={linkClasses}>Membership</NavLink>
            <NavLink to="/trainers" onClick={() => setOpen(false)} className={linkClasses}>Trainers</NavLink>
            <NavLink to="/videos" onClick={() => setOpen(false)} className={linkClasses}>Video Portal</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className={linkClasses}>Contact</NavLink>

            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarSrc}
                    alt={displayName || "User"}
                    className="h-8 w-8 rounded-full object-cover border"
                    onError={e => { e.target.onerror = null; e.target.src = DefaultAvatar; }}
                  />
                  <span className="font-medium text-gray-700">{displayName}</span>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
