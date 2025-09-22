import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import meal1 from "../assets/meal1.jpg";
import Swal from "sweetalert2";

export default function MealPlan() {
  const [form, setForm] = useState({
    user_id: "", 
    user_name: "",
    last_name: "",
    request_date: "",
    weight: "",
    height: "",
    description: "",
    mealType: "Non-Vegan",
  });

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setForm({
      user_id: "",
      user_name: "",
      last_name: "",
      request_date: "",
      weight: "",
      height: "",
      description: "",
      mealType: "Non-Vegan",
    });
    setErrors({});
  };

  // --- Validation helpers ---
  const todayISO = new Date().toISOString().slice(0, 10);

  function validateField(name, value, allValues = form) {
    switch (name) {
      case "user_name":
        if (!value?.trim()) return "First name is required";
        if (!/^[A-Za-z\s'-]{2,40}$/.test(value))
          return "First name should be 2–40 letters";
        return null;

      case "last_name":
        if (!value?.trim()) return "Last name is required";
        if (!/^[A-Za-z\s'-]{2,40}$/.test(value))
          return "Last name should be 2–40 letters";
        return null;

      case "request_date":
        if (!value) return "Request date is required";
        if (value < todayISO) return "Request date cannot be in the past";
        return null;

      case "height":
        if (!value && value !== 0) return "Height is required";
        if (Number.isNaN(Number(value))) return "Height must be a number";
        if (Number(value) < 50 || Number(value) > 250)
          return "Height must be between 50–250 cm";
        return null;

      case "weight":
        if (!value && value !== 0) return "Weight is required";
        if (Number.isNaN(Number(value))) return "Weight must be a number";
        if (Number(value) < 20 || Number(value) > 300)
          return "Weight must be between 20–300 kg";
        return null;

      case "description":
        if (!value?.trim()) return "Description is required";
        if (value.trim().length < 10)
          return "Please enter at least 10 characters";
        if (value.trim().length > 500) return "Maximum 500 characters";
        return null;

      case "mealType":
        if (!["Vegan", "Non-Vegan"].includes(value))
          return "Choose a valid meal type";
        return null;

      default:
        return null;
    }
  }

  function validateAll(values = form) {
    const fields = [
      "user_name",
      "last_name",
      "request_date",
      "height",
      "weight",
      "description",
      "mealType",
    ];
    const newErrors = {};
    fields.forEach((f) => {
      const msg = validateField(f, values[f], values);
      if (msg) newErrors[f] = msg;
    });
    return newErrors;
  }

  function handleChange(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);

    // Live-validate on change: clear error if valid; set if invalid and previously touched on submit
    if (errors[field]) {
      const msg = validateField(field, value, next);
      setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
    }
  }

  function handleBlur(field) {
    //onBlur fires when the user clicks away from a field or tabs to the next one.
    const msg = validateField(field, form[field]); //checks if the entered value is valid
    setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
  }

  //--------- CREATE ----------
  async function onCreate(e) {
    e.preventDefault();

    // Read user from localStorage
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    // Validate all
    const newErrors = validateAll();
    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    //check if the user is logged in to the system
    const derivedUserId = user?._id || form.user_id || "";

    if (!derivedUserId) {
      toast.error("Please log in to continue.");
      return;
    }

    const payload = {
      user_id: derivedUserId,
      user_name: form.user_name.trim(),
      last_name: form.last_name.trim(),
      request_date: form.request_date,
      weight: Number(form.weight),
      height: Number(form.height),
      description: form.description.trim(),
      mealType: form.mealType,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/mealRequest",
        payload,
        { headers: { Authorization: "Bearer " + token } }
      );

      Swal.fire({
        title: "Request submitted successfully!",
        text: "We will inform you once your meal plan is ready.",
        icon: "success",
      });
      resetForm();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Meal Request Failed";
      toast.error(String(msg));
    }
  }

  const red = "#FF0000";
  const leftBg = meal1;

  // Utility for ARIA ids
  const errId = (f) => (errors[f] ? `${f}-error` : undefined);

  return (
    <div className="min-h-screen flex h-270 ">
      {/* LEFT SIDE */}
      <div
        className="w-1/2 relative flex justify-start"
        style={{
          backgroundImage: `url(${leftBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Meal planning hero"
      >
        <div className="relative px-10 py-12 text-left ml-20">
          <h1 className="text-4xl font-extrabold text-black ">
            Welcome to <span className="text-red-600">Meal Planning!</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-gray-600 font-semibold w-3/4">
            Tell us what kind of meals you prefer, and we’ll create a
            personalized weekly menu just for you. Along with delicious meal
            suggestions tailored to your taste.
          </p>
          <div
            className="mt-6 h-1 w-20 rounded-full"
            style={{ backgroundColor: red }}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 bg-white items-center p-10 ">
        <form
          className="w-full max-w-lg space-y-6 ml-10"
          onSubmit={onCreate}
          noValidate
        >
          <h2 className="text-2xl font-bold text-black">
            Request your <span className="text-red-500">meal plan</span> here...
          </h2>

          {/* First Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              First Name
            </label>
            <p className="text-xs text-gray-500 mb-1">Your first name.</p>
            <input
              type="text"
              placeholder="Lidiya"
              value={form.user_name}
              onChange={(e) => handleChange("user_name", e.target.value)}
              onBlur={() => handleBlur("user_name")}
              aria-invalid={!!errors.user_name}
              aria-describedby={errId("user_name")}
              className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${
                errors.user_name
                  ? "border-red-500 focus:ring-red-300"
                  : "border-black/30 focus:ring-black/20"
              }`}
            />
            {errors.user_name && (
              <p id="user_name-error" className="mt-1 text-sm text-red-600">
                {errors.user_name}
              </p>
            )}
          </div>

          {/* Last Name | Request Date */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Last Name
              </label>
              <p className="text-xs text-gray-500 mb-1">Your family surname.</p>
              <input
                type="text"
                placeholder="Smith"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                onBlur={() => handleBlur("last_name")}
                aria-invalid={!!errors.last_name}
                aria-describedby={errId("last_name")}
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${
                  errors.last_name
                    ? "border-red-500 focus:ring-red-300"
                    : "border-black/30 focus:ring-black/20"
                }`}
              />
              {errors.last_name && (
                <p id="last_name-error" className="mt-1 text-sm text-red-600">
                  {errors.last_name}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Request Date
              </label>
              <p className="text-xs text-gray-500 mb-1">
                When you want this request to be recorded.
              </p>
              <input
                type="date"
                value={form.request_date}
                min={todayISO}
                onChange={(e) => handleChange("request_date", e.target.value)}
                onBlur={() => handleBlur("request_date")}
                aria-invalid={!!errors.request_date}
                aria-describedby={errId("request_date")}
                className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${
                  errors.request_date
                    ? "border-red-500 focus:ring-red-300"
                    : "border-black/30 focus:ring-black/20"
                }`}
              />
              {errors.request_date && (
                <p
                  id="request_date-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.request_date}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Description
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Add any notes or special requirements.
            </p>
            <textarea
              rows="3"
              placeholder="Write something here..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              aria-invalid={!!errors.description}
              aria-describedby={errId("description")}
              maxLength={500}
              className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-300"
                  : "border-black/30 focus:ring-black/20"
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p id="description-error" className="text-sm text-red-600">
                  {errors.description}
                </p>
              ) : (
                <span className="text-xs text-gray-400">
                  {form.description.trim().length}/500
                </span>
              )}
            </div>
          </div>

          {/* Height | Weight */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Height
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Your height in centimeters (cm).
              </p>
              <input
                type="number"
                inputMode="decimal"
                placeholder="165"
                value={form.height}
                onChange={(e) => handleChange("height", e.target.value)}
                onBlur={() => handleBlur("height")}
                min={50}
                max={250}
                aria-invalid={!!errors.height}
                aria-describedby={errId("height")}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.height
                    ? "border-red-500 focus:ring-red-300"
                    : "border-black/30 focus:ring-black/20"
                } outline-none focus:ring-2`}
              />
              {errors.height && (
                <p id="height-error" className="mt-1 text-sm text-red-600">
                  {errors.height}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Weight
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Your weight in kilograms (kg).
              </p>
              <input
                type="number"
                inputMode="decimal"
                placeholder="55"
                value={form.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                onBlur={() => handleBlur("weight")}
                min={20}
                max={300}
                aria-invalid={!!errors.weight}
                aria-describedby={errId("weight")}
                className={`w-full border rounded-lg px-3 py-2 ${
                  errors.weight
                    ? "border-red-500 focus:ring-red-300"
                    : "border-black/30 focus:ring-black/20"
                } outline-none focus:ring-2`}
              />
              {errors.weight && (
                <p id="weight-error" className="mt-1 text-sm text-red-600">
                  {errors.weight}
                </p>
              )}
            </div>
          </div>

          {/* Birth Day | Meal Type */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Meal Type
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Choose the type of meal preference.
              </p>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mealType"
                    value="Vegan"
                    checked={form.mealType === "Vegan"}
                    onChange={(e) => handleChange("mealType", e.target.value)}
                    onBlur={() => handleBlur("mealType")}
                  />
                  Vegan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mealType"
                    value="Non-Vegan"
                    checked={form.mealType === "Non-Vegan"}
                    onChange={(e) => handleChange("mealType", e.target.value)}
                    onBlur={() => handleBlur("mealType")}
                  />
                  Non-Vegan
                </label>
              </div>
              {errors.mealType && (
                <p className="mt-1 text-sm text-red-600">{errors.mealType}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold"
            style={{ backgroundColor: red, color: "#FFFFFF" }}
          >
            Request a Meal Plan
          </button>
        </form>
      </div>
    </div>
  );
}
