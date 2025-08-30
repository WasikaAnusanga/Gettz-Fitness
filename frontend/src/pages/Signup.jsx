
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Ruler, Weight, Image as ImageIcon
} from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import meadiaUpload from "../utils/mediaUpload"; 

import loginBg from "../assets/loging.jpg";
import GymLogo from "../assets/GymLogo.jpg";

export default function SignupPage() {
  const navigate = useNavigate();


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    height: "",
    weight: "",
    dob: "",
    profilePicture: "",     
    role: "user",
  });

 
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState("");

  const bmi = useMemo(() => {
    const h = parseFloat(form.height) / 100;
    const w = parseFloat(form.weight);
    if (!h || !w) return 0;
    const v = w / (h * h);
    return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
  }, [form.height, form.weight]);

 
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";

    if (!form.firstName) e.firstName = "First name is required";
    if (!form.lastName) e.lastName = "Last name is required";

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";

    if (!form.phone) e.phone = "Phone is required";
    if (!form.height) e.height = "Height is required";
    if (!form.weight) e.weight = "Weight is required";
    if (!form.dob) e.dob = "Date of birth is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);


      let profilePictureUrl = form.profilePicture?.trim() || "";
      if (profileFile) {
        profilePictureUrl = await meadiaUpload(profileFile); 
      }

  
      const payload = {
        email: form.email.trim().toLowerCase(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        phone: form.phone.trim(),
        height: String(form.height),
        weight: String(form.weight),
        dob: form.dob,
        profilePicture: profilePictureUrl || undefined,
        role: form.role || "user",
        bmi,
        point: 0,
      };

      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        payload
      );
      const data = res?.data ?? {};
      const msg = String(data.message || "").toLowerCase();

      
      const isSuccess =
        data.success === true ||
        Boolean(data.user || data._id) ||
        /succ(e)?ss|sucess|saved|created/.test(msg);

      if (isSuccess) {
        toast.success(data.message || "Account created successfully");

        
        setForm({
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          phone: "",
          height: "",
          weight: "",
          dob: "",
          profilePicture: "",
          role: "user",
        });
        setProfileFile(null);
        setPreview("");

        navigate("/login", { replace: true });
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black grid grid-cols-1 lg:grid-cols-2">
      
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        <img src={loginBg} alt="Gym Background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="relative z-10 text-center text-white bg-black/40 p-10 rounded-3xl">
          <img src={GymLogo} alt="Gettz Fitness Logo" className="mx-auto h-20 mb-6 rounded-full shadow-lg" />
          <h1 className="text-4xl font-bold tracking-tight">Join Gettz Health & Fitness</h1>
          <p className="mt-3 text-lg opacity-90">Create your account to start your journey.</p>
        </div>
      </div>

      
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-center p-6 sm:p-10 bg-white"
      >
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center lg:hidden">
            <img src={GymLogo} alt="Gettz Fitness Logo" className="mx-auto h-16 mb-4" />
            <h2 className="text-2xl font-semibold tracking-tight text-red-600">Create your account</h2>
            <p className="text-sm text-gray-600">It takes less than a minute.</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Email</label>
                <div className={`mt-1 group relative flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.email ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Mail className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@gettz.fit"
                    className="w-full bg-transparent py-1.5 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>              
              <div>
                <label className="block text-sm font-medium">First name</label>
                <div className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.firstName ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  <input name="firstName" value={form.firstName} onChange={onChange} placeholder="John"
                    className="w-full bg-transparent py-1.5 text-sm outline-none" />
                </div>
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Last name</label>
                <div className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.lastName ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Doe"
                    className="w-full bg-transparent py-1.5 text-sm outline-none" />
                </div>
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Password</label>
                <div className={`mt-1 group relative flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.password ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Lock className="mr-2 h-4 w-4 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={onChange}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent py-1.5 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="ml-2 inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Phone</label>
                <div className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.phone ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Phone className="mr-2 h-4 w-4 text-gray-400" />
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="07xxxxxxxx"
                    className="w-full bg-transparent py-1.5 text-sm outline-none" />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              
              <div>
                <label className="block text-sm font-medium">Height (cm)</label>
                <div className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.height ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Ruler className="mr-2 h-4 w-4 text-gray-400" />
                  <input name="height" value={form.height} onChange={onChange} placeholder="170"
                    className="w-full bg-transparent py-1.5 text-sm outline-none" />
                </div>
                {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium">Weight (kg)</label>
                <div className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.weight ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Weight className="mr-2 h-4 w-4 text-gray-400" />
                  <input name="weight" value={form.weight} onChange={onChange} placeholder="70"
                    className="w-full bg-transparent py-1.5 text-sm outline-none" />
                </div>
                {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
              </div>

              
              <div>
                <label className="block text-sm font-medium">Date of Birth</label>
                <div className={`mt-1 flex items-center rounded-xl border px-3 py-2 focus-within:ring-2 ${
                  errors.dob ? "border-red-500 focus-within:ring-red-300" : "border-gray-300 focus-within:ring-red-200"
                }`}>
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <input type="date" name="dob" value={form.dob} onChange={onChange}
                    className="w-full bg-transparent py-1.5 text-sm outline-none" />
                </div>
                {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
              </div>

              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Profile picture (optional)</label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <span>Choose image</span>
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                  </label>
                  <input
                    type="url"
                    name="profilePicture"
                    value={form.profilePicture}
                    onChange={onChange}
                    placeholder="or paste image URL"
                    className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none border-gray-300 focus:ring-2 focus:ring-red-200"
                  />
                </div>
                {preview && (
                  <div className="mt-3">
                    <img src={preview} alt="Profile preview" className="h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />
                  </div>
                )}
              </div>

             
              <div className="md:col-span-2 text-xs text-gray-500">
                BMI (auto): <span className="font-medium text-gray-700">{bmi}</span>
              </div>

           
              <div className="md:col-span-2">
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
                    <span>Sign up</span>
                  )}
                </motion.button>

                <p className="mt-3 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-600 hover:underline">Sign in</Link>
                </p>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] text-gray-500">
            By continuing, you agree to our <a className="underline" href="#">Terms</a> and{" "}
            <a className="underline" href="#">Privacy Policy</a>.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
