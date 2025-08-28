import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import GymLogo from "../assets/GymLogo.jpg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user"); 
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="mx-auto flex items-center justify-between px-6 py-3">
        
        <Link to="/" className="flex items-center gap-2">
          <img
            src={GymLogo}
            alt="Gettz Fitness"
            className="h-10 w-10 rounded-full"
          />
          <span className="text-xl font-bold text-red-600">Gettz Fitness</span>
        </Link>

       
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-red-600">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-red-600">
            About
          </Link>
          <Link to="/membership" className="text-gray-700 hover:text-red-600">
            Membership
          </Link>
          <Link to="/trainers" className="text-gray-700 hover:text-red-600">
            Trainers
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-red-600">
            Contact
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">
                 {user.profilePicture}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
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
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/membership" onClick={() => setOpen(false)}>
              Membership
            </Link>
            <Link to="/trainers" onClick={() => setOpen(false)}>
              Trainers
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            {user ? (
              <>
                <span className="font-medium text-gray-700">
                    {user.profilePicture}
                </span>
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
