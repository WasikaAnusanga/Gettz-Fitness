import axios from "axios";
import { useEffect, useRef, useState } from "react";
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
  Star,
  Plus,
  X as Close,
} from "lucide-react";

export default function TrainerRegistration() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePictureUrls, setProfilePictureUrls] = useState([""]);
  const [profileFiles, setProfileFiles] = useState([]);

  const [certifications, setCertifications] = useState([""]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [specialization, setSpecialization] = useState("General Fitness");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const imgRef = useRef([]);

  const SPECIALIZATIONS = [
    "General Fitness",
    "Weight Loss",
    "Muscle Gain",
    "Nutrition",
    "Yoga",
    "Pilates",
  ];

  useEffect(() => {
    if (!profileFiles || profileFiles.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = Array.from(profileFiles).map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [profileFiles]);

  const cleanList = (arr) => (arr || []).map((s) => s.trim()).filter(Boolean);

  const validate = () => {
    if (!name.trim()) return toast.error("Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Enter a valid email address");
    if (!/^[0-9+\-()\s]{7,}$/.test(phoneNumber))
      return toast.error("Enter a valid phone number");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");
    if (experienceYears < 0) return toast.error("Experience cannot be negative");
    if (!SPECIALIZATIONS.includes(specialization))
      return toast.error("Pick a valid specialization");
    return true;
  };

  const handleSubmit = async () => {
    if (validate() !== true) return;
    try {
      setLoading(true);


      let urls = cleanList(profilePictureUrls);
      if (profileFiles && profileFiles.length > 0) {
        const uploadPromises = Array.from(profileFiles).map((file) => mediaUpload(file));
        const uploadedResults = await Promise.all(uploadPromises);
        const uploadedUrls = uploadedResults.map(
          (uploaded) => uploaded?.url || uploaded?.secure_url || uploaded
        );
        urls = [...urls, ...uploadedUrls.filter(Boolean)];
      }

      const profilePicture = urls.length > 0 ? urls[0] : undefined;

      const certs = cleanList(certifications);

      const expYears = Number(experienceYears) || 0;
      const trainerRating = Number(rating) || 0;

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
        profilePicture,
        certifications: certs,
        experienceYears: expYears,
        specialization,
        rating: trainerRating,
        isActive: status === "active",
        isDisabled: status === "disabled",
      };

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/register`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Trainer registered successfully");
      navigate("/admin/trainers");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || err?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCert = (idx, val) => {
    const list = [...certifications];
    list[idx] = val;
    setCertifications(list);
  };
  const addCert = () => setCertifications([...certifications, ""]);
  const removeCert = (idx) =>
    setCertifications(certifications.filter((_, i) => i !== idx));

  return (
    <div className="w-full min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dc0808] text-white">
              <User size={18} />
            </div>
            <div>
              <h1 className="font-semibold">Register Trainer</h1>
              <p className="text-xs text-neutral-500">
                Create a trainer account and profile.
              </p>
            </div>
          </div>
          <Link
            to="/admin/trainers"
            className="text-sm text-[#af090e] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  At least 6 characters.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Certifications
              </label>
              {certifications.map((c, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={c}
                    onChange={(e) => updateCert(idx, e.target.value)}
                    placeholder={`Certification ${idx + 1}`}
                    className="flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                  <button
                    type="button"
                    onClick={() => removeCert(idx)}
                    className="rounded bg-gray-100 px-2 text-gray-500 hover:bg-red-100"
                    disabled={certifications.length === 1}
                  >
                    <Close size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCert}
                className="mt-1 rounded bg-[#e30613] px-3 py-1 text-white text-xs hover:opacity-90"
              >
                <Plus className="inline mr-1" size={16} /> Add Certification
              </button>
              <p className="mt-1 text-xs text-neutral-500">
                Add any relevant licenses or certificates (optional).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Initial Rating (0–5)
                </label>
                <div className="relative">
                  <Star
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full rounded-xl border border-black/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Optional; server may override based on reviews.
                </p>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    checked={status === "active"}
                    onChange={() => setStatus("active")}
                    name="trainer-status"
                  />
                  Active
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    checked={status === "disabled"}
                    onChange={() => setStatus("disabled")}
                    name="trainer-status"
                  />
                  Disabled
                </label>
              </div>
            </div>
          </div>

          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Picture URLs (optional, comma separated)
              </label>
              <input
                value={profilePictureUrls.join(", ")}
                onChange={(e) => setProfilePictureUrls(e.target.value.split(",").map((s) => s.trim()))}
                placeholder="https://..."
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Or upload one or more images below.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Profile Images
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 p-6 text-center hover:bg-black/5">
                <ImageIcon className="mb-2" />
                <span className="text-sm">Drag & drop or click to choose (multiple allowed)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setProfileFiles(e.target.files ? Array.from(e.target.files) : [])}
                  className="hidden"
                />
              </label>

              {(previews.length > 0 || profilePictureUrls.some(Boolean)) && (
                <div className="mt-3 w-full rounded-xl border border-black/10 overflow-hidden grid grid-cols-1 gap-2">
                  
                  {previews.map((src, idx) => (
                    <img
                      key={src}
                      ref={el => imgRef.current[idx] = el}
                      src={src}
                      alt={`Trainer preview ${idx+1}`}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                  
                  {profilePictureUrls.filter(Boolean).map((url, idx) => (
                    <img
                      key={url}
                      src={url}
                      alt={`Trainer url ${idx+1}`}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
          <Link
            to="/admin/trainers"
            className="rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-[#c10b0b] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating…" : "Register Trainer"}
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
            <li>Certifications are optional — add as needed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
