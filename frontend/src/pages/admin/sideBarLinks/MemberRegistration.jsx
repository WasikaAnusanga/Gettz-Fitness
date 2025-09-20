import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import mediaUpload from "../../../utils/mediaUpload";
import {
  User,
  Mail,
  Phone,
  Lock,
  BadgeCheck,
  Image as ImageIcon,
  Calendar,
  Ruler,
  Weight,
  Eye,
  EyeOff,
} from "lucide-react";

export default function MemberRegistration() {
  const navigate = useNavigate();

  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");

  const [profilePictureUrls, setProfilePictureUrls] = useState([""]);
  const [profileFiles, setProfileFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const imgRef = useRef([]);

  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!profileFiles?.length) { setPreviews([]); return; }
    const urls = Array.from(profileFiles).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [profileFiles]);

  const bmi = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return 0;
    const v = w / (h * h);
    return Number.isFinite(v) ? Number(v.toFixed(1)) : 0;
  }, [height, weight]);

  const pwScore = useMemo(() => {
    const pw = password || "";
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 5);
  }, [password]);

  const strengthLabel = ["Very weak","Weak","Okay","Strong","Very strong"][Math.max(0, pwScore-1)] || "Very weak";
  const strengthClass =
    pwScore <= 1 ? "bg-red-500" :
    pwScore === 2 ? "bg-orange-500" :
    pwScore === 3 ? "bg-yellow-500" :
    pwScore === 4 ? "bg-lime-500" : "bg-emerald-600";

  const cleanList = (arr) => (arr || []).map((s) => s.trim()).filter(Boolean);
  const setTouch = (name) => setTouched((t) => ({ ...t, [name]: true }));

  const validators = {
    email: (v) => !v ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "",
    firstName: (v) => v ? "" : "First name is required",
    lastName:  (v) => v ? "" : "Last name is required",
    phone:     (v) => !v ? "Phone is required"
      : !/^[0-9+\-()\s]{7,}$/.test(v) ? "Enter a valid phone number" : "",
    height:    (v) => !v ? "Height is required"
      : isNaN(Number(v)) || Number(v) <= 0 ? "Enter a valid height in cm" : "",
    weight:    (v) => !v ? "Weight is required"
      : isNaN(Number(v)) || Number(v) <= 0 ? "Enter a valid weight in kg" : "",
    dob:       (v) => !v ? "Date of birth is required"
      : new Date(v) > new Date() ? "DOB cannot be in the future" : "",
    password:  (v) => !v ? "Password is required"
      : v.length < 8 ? "Minimum 8 characters" : "",
    confirmPassword: (v) => !v ? "Confirm your password"
      : v !== password ? "Passwords do not match" : "",
  };

  const validateAll = () => {
    const e = {};
    Object.entries({
      email, firstName, lastName, phone, height, weight, dob, password, confirmPassword
    }).forEach(([k, v]) => {
      const msg = validators[k]?.(v) || "";
      if (msg) e[k] = msg;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChangeAndValidate = (name, value) => {
    setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) || "" }));
  };

  const handleSubmit = async () => {
    if (!validateAll()) {
      setTouched({
        email: true, firstName: true, lastName: true, phone: true,
        height: true, weight: true, dob: true, password: true, confirmPassword: true
      });
      return;
    }

    try {
      setLoading(true);

      let urls = cleanList(profilePictureUrls);
      if (profileFiles?.length > 0) {
        const uploadPromises = Array.from(profileFiles).map((f) => mediaUpload(f));
        const uploaded = await Promise.all(uploadPromises);
        const uploadedUrls = uploaded.map((u) => u?.url || u?.secure_url || u);
        urls = [...urls, ...uploadedUrls.filter(Boolean)];
      }
      const profilePicture = urls[0] || undefined;

      const payload = {
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
        phone: phone.trim(),
        height: String(height || ""),
        weight: String(weight || ""),
        dob,
        profilePicture,
        bmi,
        point: 0,
        isDisabled: status === "disabled",
      };

      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      toast.success("Member registered successfully");
      navigate("/admin/members");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dc0808] text-white">
              <User size={18} />
            </div>
            <div>
              <h1 className="font-semibold">Register Member</h1>
              <p className="text-xs text-neutral-500">Create a member account and profile.</p>
            </div>
          </div>
          <Link to="/admin/members" className="text-sm text-[#af090e] hover:underline">View all</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <div className={`relative ${errors.firstName && touched.firstName ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={firstName}
                    onChange={(e)=>{ setFirst(e.target.value); onChangeAndValidate("firstName", e.target.value); }}
                    onBlur={()=>setTouch("firstName")}
                    placeholder="Alex"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.firstName && errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <div className={`relative ${errors.lastName && touched.lastName ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={lastName}
                    onChange={(e)=>{ setLast(e.target.value); onChangeAndValidate("lastName", e.target.value); }}
                    onBlur={()=>setTouch("lastName")}
                    placeholder="Johnson"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.lastName && errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className={`relative ${errors.email && touched.email ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e)=>{ setEmail(e.target.value); onChangeAndValidate("email", e.target.value); }}
                    onBlur={()=>setTouch("email")}
                    placeholder="alex@example.com"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.email && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className={`relative ${errors.phone && touched.phone ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={phone}
                    onChange={(e)=>{ setPhone(e.target.value); onChangeAndValidate("phone", e.target.value); }}
                    onBlur={()=>setTouch("phone")}
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.phone && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <div className={`relative ${errors.height && touched.height ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Ruler size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={height}
                    onChange={(e)=>{ setHeight(e.target.value); onChangeAndValidate("height", e.target.value); }}
                    onBlur={()=>setTouch("height")}
                    placeholder="170"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.height && errors.height && <p className="text-xs text-red-600 mt-1">{errors.height}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                <div className={`relative ${errors.weight && touched.weight ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Weight size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    value={weight}
                    onChange={(e)=>{ setWeight(e.target.value); onChangeAndValidate("weight", e.target.value); }}
                    onBlur={()=>setTouch("weight")}
                    placeholder="70"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.weight && errors.weight && <p className="text-xs text-red-600 mt-1">{errors.weight}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <div className={`relative ${errors.dob && touched.dob ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e)=>{ setDob(e.target.value); onChangeAndValidate("dob", e.target.value); }}
                    onBlur={()=>setTouch("dob")}
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                {touched.dob && errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className={`relative ${errors.password && touched.password ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e)=>{ setPassword(e.target.value); onChangeAndValidate("password", e.target.value); }}
                    onBlur={()=>setTouch("password")}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                  <button type="button" onClick={()=>setShowPw(s=>!s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-600 hover:bg-black/5">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}

                <div className="mt-2">
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className={`h-2 ${strengthClass}`} style={{ width: `${(pwScore/5)*100}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">Strength: {strengthLabel}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className={`relative ${errors.confirmPassword && touched.confirmPassword ? "ring-2 ring-red-300 rounded-xl" : ""}`}>
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e)=>{ setConfirm(e.target.value); onChangeAndValidate("confirmPassword", e.target.value); }}
                    onBlur={()=>setTouch("confirmPassword")}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                  <button type="button" onClick={()=>setShowConfirmPw(s=>!s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-600 hover:bg-black/5">
                    {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Status (optional) */}
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" className="h-4 w-4" checked={status === "active"} onChange={()=>setStatus("active")} name="member-status" />
                Active
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" className="h-4 w-4" checked={status === "disabled"} onChange={()=>setStatus("disabled")} name="member-status" />
                Disabled
              </label>
              <div className="ml-auto text-xs text-neutral-600">
                BMI (auto): <span className="font-medium text-neutral-800">{bmi}</span>
              </div>
            </div>
          </div>

          {/* Right: Image uploader */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Profile Picture URLs (optional, comma separated)</label>
              <input
                value={profilePictureUrls.join(", ")}
                onChange={(e)=>setProfilePictureUrls(e.target.value.split(",").map((s)=>s.trim()))}
                placeholder="https://..."
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
              />
              <p className="mt-1 text-xs text-neutral-500">Or upload one or more images below.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Profile Images</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 p-6 text-center hover:bg-black/5">
                <ImageIcon className="mb-2" />
                <span className="text-sm">Drag & drop or click to choose (multiple allowed)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e)=>setProfileFiles(e.target.files ? Array.from(e.target.files) : [])}
                  className="hidden"
                />
              </label>

              {(previews.length > 0 || profilePictureUrls.some(Boolean)) && (
                <div className="mt-3 w-full rounded-xl border border-black/10 overflow-hidden grid grid-cols-1 gap-2">
                  {previews.map((src, idx) => (
                    <img
                      key={src}
                      ref={(el)=>imgRef.current[idx] = el}
                      src={src}
                      alt={`Member preview ${idx+1}`}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                  {profilePictureUrls.filter(Boolean).map((url, idx) => (
                    <img
                      key={url}
                      src={url}
                      alt={`Member url ${idx+1}`}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
          <Link to="/admin/members" className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5">
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-[#c10b0b] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating…" : "Register Member"}
          </button>
        </div>
      </div>

      {/* Tips card */}
      <div className="hidden xl:flex flex-col gap-2 ml-6 max-w-xs text-xs text-neutral-600">
        <div className="rounded-xl border border-black/10 p-3">
          <div className="flex items-center gap-2 mb-1">
            <BadgeCheck size={14} />
            <span className="font-medium">Tips</span>
          </div>
          <ul className="list-disc ml-4 space-y-1">
            <li>Email must be unique.</li>
            <li>Use a clear headshot for profile picture.</li>
            <li>Height & weight in numbers only.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
