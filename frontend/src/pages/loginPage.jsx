import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Link } from "lucide-react";
import loginBg from "../assets/loging.jpg"; 
import GymLogo from "../assets/GymLogo.jpg"; 
import axios from "axios";
import { useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    console.log("Email :", form.email);
    console.log("Password :", form.password);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
        email: form.email,
        password: form.password,
      })
      .then((response) => {
        if (response.data.message === "Login successful") {
          console.log("Login Success", response.data);
          toast.success("Login Success");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          const user = response.data.user;
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
          setLoading(false);
        } else {
          toast.error(response.data.message || "Login Failed");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Login error", err);
        toast.error("Something went wrong");
        setLoading(false);
      });

    console.log("Login button clicked");
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="min-h-screen w-full bg-white text-black grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <img src={loginBg} alt="Gym Background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative z-10 text-center text-white bg-black/40 p-10 rounded-3xl">
          <img src={GymLogo} alt="Gettz Fitness Logo" className="mx-auto h-20 mb-6 rounded-full shadow-lg" />
          <h1 className="text-4xl font-bold tracking-tight">Gettz Health & Fitness</h1>
          <p className="mt-4 text-lg opacity-90">Stronger. Fitter. Better.</p>
          <ul className="mt-6 space-y-3 text-left text-sm opacity-90">
            <li>✔ Personalized workout plans</li>
            <li>✔ Track your progress easily</li>
            <li>✔ Join our fitness community</li>
          </ul>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-center p-6 sm:p-10 bg-white"
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <img src={GymLogo} alt="Gettz Fitness Logo" className="mx-auto h-16 mb-4" />
            <h2 className="text-2xl font-semibold tracking-tight text-red-600">Welcome back</h2>
            <p className="text-sm text-gray-600">Sign in to continue to Gettz Fitness</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <div className={`group relative flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.email ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Mail className="mr-2 h-4 w-4 text-gray-400" aria-hidden />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@gettz.fit"
                    className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-gray-400"
                  />
                  
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
                <div className={`group relative flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.password ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Lock className="mr-2 h-4 w-4 text-gray-400" aria-hidden />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="ml-2 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex select-none items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={onChange}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-red-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-red-700 transition disabled:opacity-60"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                <span>{loading ? "Signing in…" : "Sign in"}</span>
              </motion.button>

             <button type="button"                 
                onClick={() => navigate("/register")}
                className="w-full mt-3 rounded-xl border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50">Create an account
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] text-gray-500">
            By continuing, you agree to our <a className="underline" href="#">Terms</a> and <a className="underline" href="#">Privacy Policy</a>.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
