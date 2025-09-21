import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import meal1 from "../assets/meal1.jpg";

export default function MealPlan() {
  const [form, setForm] = useState({
    user_id: "",
    user_name: "",
    last_name: "",
    request_date: "",
    weight: "",
    height: "",
    birthday: "",
    description: "",
    mealType: "Non-Vegan",
  });

  const resetForm = () => {
    setForm({
      user_id: "",
      user_name: "",
      last_name: "",
      request_date: "",
      weight: "",
      height: "",
      birthday: "",
      description: "",
      mealType: "Non-Vegan",
    });
  };

  //--------- CREATE ----------
  async function onCreate(e) {
    e.preventDefault();

    if (
      !form.user_name ||
      !form.request_date ||
      !form.weight ||
      !form.height ||
      !form.user_id ||
      !form.last_name ||
      !form.birthday ||
      !form.description ||
      !form.mealType
    ) {
      toast.error("All fields are required!");
      return;
    }

    const payload = {
      user_name: form.user_name,
      request_date: form.request_date,
      weight: form.weight,
      height: form.height,
      last_name: form.last_name,
      user_id: form.user_id,
      birthday: form.birthday,
      description: form.description,
      mealType: form.mealType,
    };

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/mealRequest",
        payload
      );
      toast.success("Meal Request Created!");
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

  return (
    <div className="min-h-screen flex h-270 ">
      {/* LEFT SIDE (background image with overlay text at the top) */}
      <div
        className="w-1/2 relative flex justify-start"
        style={{
          backgroundImage: `url(${leftBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Meal planning hero"
      >
        {/* Foreground text pinned to the top */}
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

      {/* RIGHT SIDE (form) */}
      <div className="w-1/2 bg-white items-center p-10 ">
        <form className="w-full max-w-lg space-y-6 ml-10" onSubmit={onCreate}>
          <h2 className="text-2xl font-bold text-black">
            Request your <span className="text-red-500">meal plan</span> here...
          </h2>

          {/* FULL WIDTH — First Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              First Name
            </label>
            <p className="text-xs text-gray-500 mb-1">Your first name.</p>
            <input
              type="text"
              placeholder="Lidiya"
              value={form.user_name}
              onChange={(e) => setForm({ ...form, user_name: e.target.value })}
              className="w-full border border-black/30 rounded-lg px-3 py-2 outline-none focus:ring-2"
            />
          </div>

          {/* ROW — Last Name | Request Date  */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Last Name
              </label>
              <p className="text-xs text-gray-500 mb-1">Your family surname.</p>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                placeholder="Smith"
                className="w-full border border-black/30 rounded-lg px-3 py-2 outline-none focus:ring-2"
              />
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
                onChange={(e) =>
                  setForm({ ...form, request_date: e.target.value })
                }
                className="w-full border border-black/30 rounded-lg px-3 py-2 outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* FULL WIDTH — Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-black">
              Description
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Add any notes or special requirements.
            </p>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Write something here..."
              className="w-full border border-black/30 rounded-lg px-3 py-2 outline-none focus:ring-2"
            ></textarea>
          </div>

          {/* ROW — User Id | Request Id (like alt/tags second row) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                User Id
              </label>
              <p className="text-xs text-gray-500 mb-1">
                System identifier for the user.
              </p>
              <input
                type="number"
                placeholder="55"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                className="w-full border border-black/30 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* ROW — Height | Weight (like duration + checkbox line) */}
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
                placeholder="165 cm"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="w-full border border-black/30 rounded-lg px-3 py-2"
              />
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
                placeholder="55 kg"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="w-full border border-black/30 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* ROW — Birth Day | Meal Type (right-side small section feel) */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-black">
                Birth Day
              </label>
              <p className="text-xs text-gray-500 mb-1">Your date of birth.</p>
              <input
                type="date"
                value={form.birthday}
                onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                className="w-full border border-black/30 rounded-lg px-3 py-2 outline-none focus:ring-2"
              />
            </div>
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
                    onChange={(e) =>
                      setForm({ ...form, mealType: e.target.value })
                    }
                  />{" "}
                  Vegan
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mealType"
                    value="Non-Vegan"
                    checked={form.mealType === "Non-Vegan"}
                    onChange={(e) =>
                      setForm({ ...form, mealType: e.target.value })
                    }
                  />{" "}
                  Non-Vegan
                </label>
              </div>
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
