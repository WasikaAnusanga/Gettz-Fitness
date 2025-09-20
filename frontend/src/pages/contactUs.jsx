import React, { useEffect, useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({
    inquiry_id: "",
    inquiry_type: "General",
    inquiry_message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState(null); // { type: 'success'|'error', text: string }

  // Prefill a 6-digit inquiry_id (editable by user)
  useEffect(() => {
    if (!form.inquiry_id) {
      const suggested = Math.floor(100000 + Math.random() * 900000);
      setForm((f) => ({ ...f, inquiry_id: String(suggested) }));
    }
  }, []);

  const maxChars = 500;
  const charsLeft = maxChars - form.inquiry_message.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "inquiry_message" && value.length > maxChars) return;
    // only allow digits for inquiry_id
    if (name === "inquiry_id") {
      const digits = value.replace(/\D/g, "");
      setForm((f) => ({ ...f, [name]: digits }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg(null);

    // Basic validation for required fields in the model
    if (!form.inquiry_id || !form.inquiry_type || !form.inquiry_message.trim()) {
      setServerMsg({
        type: "error",
        text: "Please provide an Inquiry ID, select a type, and enter your message.",
      });
      return;
    }

    // Build payload to match the model exactly
    const payload = {
      inquiry_id: Number(form.inquiry_id),
      inquiry_type: form.inquiry_type,
      inquiry_message: form.inquiry_message.trim(),
      // inquiry_date, inquiry_status, inquiry_response are handled by backend defaults
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies for auth/session
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const data = await res.json().catch(() => ({}));
        setServerMsg({
          type: "success",
          text: data?.message || "Inquiry submitted successfully.",
        });
        // reset but keep a fresh id
        const suggested = Math.floor(100000 + Math.random() * 900000);
        setForm({ inquiry_id: String(suggested), inquiry_type: "General", inquiry_message: "" });
      } else if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        setServerMsg({ type: "error", text: data?.message || "Please log in to submit an inquiry." });
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Request failed with status ${res.status}`);
      }
    } catch (err) {
      setServerMsg({ type: "error", text: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // FAQ items (unchanged)
  const faqs = [
    { q: "How do I start a membership?", a: "Choose a plan online or visit our front desk. We’ll do a quick 1:1 intake, discuss goals, and activate your access the same day." },
    { q: "Do you offer a free trial?", a: "Yes! New members can book a free 3–7 day trial depending on availability. It includes classes, open gym, and a coach consult." },
    { q: "What are your hours?", a: "We’re open 5:00 AM – 11:00 PM daily. Class schedules vary by day; check the timetable or call us for slots." },
    { q: "Is personal training available?", a: "Absolutely. We offer 1:1, partner, and small-group training with specialized coaches. Packages are flexible and goal-based." },
    { q: "Can I freeze or cancel my membership?", a: "Yes. You can freeze for travel or medical reasons and cancel anytime after your initial term. See our policy for simple steps." },
    { q: "Where are you located?", a: "48, Esplanade Road, Matara 81000, Sri Lanka. Use the map below to get directions or open it in Google Maps." },
  ];

  return (
    <div className="bg-white text-[#111] min-h-screen pb-10 scroll-smooth">
      {/* === TOP SEGMENT (light neutral) === */}
      <section className="bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-start">
          {/* ===== Left: Info ===== */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#FF0000]">
              Contact Us
            </h1>
            <p className="mt-4 text-gray-700 max-w-lg">
              Email, call, or complete the form to learn how our coaches can
              help you reach your fitness goals faster and smarter — starting
              with a quick 1:1 assessment, clear program recommendations, and a
              schedule that fits your life.
            </p>

            <div className="mt-8 space-y-2 text-lg">
              <a href="mailto:hello@getzzfitness.com" className="block hover:text-[#FF0000]">
                hello@getzzfitness.com
              </a>
              <a href="tel:+94112345678" className="block hover:text-[#FF0000]">
                +94 11 234 5678
              </a>
              <a href="#" className="underline underline-offset-4 decoration-[#FF0000]">
                Customer Support
              </a>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-8 mt-50">
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We’re here to help with memberships, schedules, and general
                  inquiries.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Feedback & Suggestions</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Tell us what you love and what we can improve. Your input
                  shapes our community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Media Inquiries</h3>
                <p className="text-sm text-gray-600 mt-2">
                  For press and partnerships, email{" "}
                  <a href="mailto:media@getzzfitness.com" className="text-[#FF0000]">
                    media@getzzfitness.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* ===== Right: Form Card (matches inquiry.js) ===== */}
          <div
            id="contact-form"
            className="bg-white rounded-2xl shadow-xl border border-red-600/20 p-6 md:p-8 scroll-mt-24 md:scroll-mt-32"
          >
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <p className="text-gray-600 mt-1">
              Logged-in members can submit inquiries directly.
            </p>

            {/* Server message */}
            {serverMsg && (
              <div
                className={`mt-4 rounded-lg px-4 py-3 text-sm ${
                  serverMsg.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {serverMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* inquiry_id */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Inquiry ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  name="inquiry_id"
                  value={form.inquiry_id}
                  onChange={handleChange}
                  placeholder="e.g., 123456"
                  className="w-full rounded-lg border border-red-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                  required
                  min={1}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be unique. Prefilled for convenience—edit if needed.
                </p>
              </div>

              {/* inquiry_type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Inquiry Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="inquiry_type"
                  value={form.inquiry_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-red-600/30 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                  required
                >
                  {["General", "Technical", "Billing", "Feedback", "Other"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* inquiry_message */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="inquiry_message"
                  value={form.inquiry_message}
                  onChange={handleChange}
                  placeholder="Tell us about your inquiry..."
                  rows={5}
                  className="w-full rounded-lg border border-red-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF0000] resize-none"
                  required
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {charsLeft}/{maxChars}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full rounded-lg bg-[#FF0000] text-white font-semibold py-3 hover:opacity-90 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>

              <p className="text-[11px] text-gray-500 text-center">
                By submitting, you agree to our{" "}
                <a href="#" className="text-[#FF0000] underline underline-offset-2">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#FF0000] underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ===== MAP SECTION ===== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Map */}
          <div className="relative rounded-2xl overflow-hidden border border-red-600/30 shadow-lg">
            <iframe
              title="Getzz Fitness Location"
              className="w-full h-[340px] md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=48%2C%20Esplanade%20Road%2C%20Matara%2C%20Sri%20Lanka&output=embed"
            />
          </div>

          {/* Right: Details */}
          <div>
            <p className="text-sm text-gray-500">Our Location</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mt-1">
              Connecting Near and Far
            </h2>
            <div className="mt-6">
              <h3 className="font-semibold">Headquarters</h3>
              <div className="mt-2 text-gray-700 text-sm leading-6">
                <div>Getzz Fitness</div>
                <div>Matara, Sri Lanka</div>
                <div>48, Esplanade Road</div>
                <div>Matara 81000</div>
                <div>Sri Lanka</div>
              </div>
              <div className="mt-4">
                <a
                  href="https://maps.google.com/?q=48,%20Esplanade%20Road,%20Matara,%20Sri%20Lanka"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-[#FF0000] px-5 py-3 text-white font-semibold hover:opacity-90"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <center>
            <h2 className="text-2xl md:text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mt-2">
              Can’t find what you’re looking for?{" "}
              <a
                href="#contact-form"
                className="text-[#FF0000] underline"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact-form")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                Make an inquiry
              </a>
            </p>
          </center>

          <div className="mt-6 space-y-4">
            {faqs.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-red-600/20 bg-white shadow-sm p-4 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {item.q}
                  <span className="ml-4 text-[#FF0000] text-2xl leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-3 text-gray-700 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
