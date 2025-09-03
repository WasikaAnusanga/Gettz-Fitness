import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const AddNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("promotional");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role && role !== "admin") {
      toast.error("Only admins can create notifications.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error("Please provide both title and body.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/notification/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // verifyJWT
        },
        body: JSON.stringify({ title, body, type }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      toast.success("Notification created and sent to members!");

      setTitle("");
      setBody("");
      setType("promotional");

      console.log("Created:", data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create notification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Notification</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full border rounded px-3 py-2 outline-none"
            placeholder="e.g., Limited Time Offer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Body</label>
          <textarea
            className="w-full border rounded px-3 py-2 outline-none"
            placeholder="Write your message to members…"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            className="w-full border rounded px-3 py-2 outline-none"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="promotional">Promotional</option>
            <option value="membership">Membership</option>
            <option value="info">Info</option>
            <option value="alert">Alert</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Send to Members"}
        </button>
      </form>

      
      <div className="mt-8 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <div className="border rounded p-3">
          <div className="text-sm text-gray-500">{type}</div>
          <div className="font-medium">{title || "—"}</div>
          <div className="text-gray-700">{body || "—"}</div>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;
