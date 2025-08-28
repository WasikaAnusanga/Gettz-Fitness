// src/pages/RegisterPage.jsx
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleRegister() {
    // basic client‑side validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user",
        {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
          phone: form.phone || undefined, // let backend fall back to default
        }
      );

      toast.success(data.message || "Registration successful");
      navigate("/login"); // send user to login after successful signup
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed, try again"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[url(/logingBack.jpg)] bg-cover bg-center flex">
      {/* Left panel */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <h1 className="text-green-500 text-2xl animate-bounce">
          Create your account
        </h1>
      </div>

      {/* Right panel */}
      <div className="w-1/2 h-full flex justify-center items-center">
        <div className="w-[450px] h-[700px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center p-4 space-y-2">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            className="w-full h-[50px] border border-white rounded-xl text-center"
            onChange={handleChange}
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            className="w-full h-[50px] border border-white rounded-xl text-center"
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full h-[50px] border border-white rounded-xl text-center"
            onChange={handleChange}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone (optional)"
            className="w-full h-[50px] border border-white rounded-xl text-center"
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full h-[50px] border border-white rounded-xl text-center"
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full h-[50px] border border-white rounded-xl text-center"
            onChange={handleChange}
          />

          <button
            className="w-full h-[50px] bg-green-400 text-white rounded-xl flex items-center justify-center"
            onClick={handleRegister}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-blue-400">
            Already have an account? &nbsp;
            <span className="text-green-500 hover:text-green-700">
              <Link to="/login">Login here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
