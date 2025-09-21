import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Save, ArrowLeft, Trophy, UploadCloud } from "lucide-react";
import meadiaUpload from "../../../utils/mediaUpload";

function getAxiosError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Unknown error";
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return String(data);
}

export default function EditCompetition() {
  function getTodayStr() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const { compId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComp, setLoadingComp] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromApi() {
      try {
        setLoadingComp(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/challenge`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = (res?.data || []).find(
          (c) => c.challengeID === compId || c._id === compId
        );

        if (!data) throw new Error("Competition not found");
        if (cancelled) return;

        setTitle(data.title || "");
        setDescription(data.description || "");
        setPoints(data.points || "");
        setStartDate(data.startDate ? data.startDate.split("T")[0] : "");
        setEndDate(data.endDate ? data.endDate.split("T")[0] : "");
        setImageUrl(data.imageUrl || "");
        setPreview(data.imageUrl || "");
      } catch (err) {
        toast.error(`Failed to load competition: ${getAxiosError(err)}`);
        navigate("/admin/competitions");
      } finally {
        if (!cancelled) setLoadingComp(false);
      }
    }

    hydrateFromApi();
    return () => {
      cancelled = true;
    };
  }, [compId, navigate]);

  async function handleSave() {
    if (!title.trim()) return toast.error("Title is required");
    if (!description.trim()) return toast.error("Description is required");
    if (!points) return toast.error("Points are required");
    if (!startDate) return toast.error("Start date is required");
    if (!endDate) return toast.error("End date is required");

    // Validation: startDate >= today, endDate >= startDate
    const todayStr = getTodayStr();
    if (startDate < todayStr) {
      return toast.error("Start date cannot be before today");
    }
    if (endDate < startDate) {
      return toast.error("End date cannot be before start date");
    }

    try {
      setLoading(true);
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await meadiaUpload(imageFile);
        if (!finalImageUrl) return toast.error("Image upload failed");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        points: Number(points),
        startDate,
        endDate,
        imageUrl: finalImageUrl,
      };
      const token = localStorage.getItem("token") || localStorage.getItem("jwt");

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/challenge/update/${compId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Competition updated");
      navigate("/admin/competitions");
    } catch (err) {
      toast.error(`Update failed: ${getAxiosError(err)}`);
    } finally {
      setLoading(false);
    }
  }

  if (loadingComp) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading competition…</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e30613] text-white">
              <Trophy size={18} />
            </div>
            <div>
              <h1 className="font-semibold">Edit Competition</h1>
              <p className="text-xs text-neutral-500">ID: {compId}</p>
            </div>
          </div>
          <Link
            to="/admin/competitions"
            className="inline-flex items-center gap-1 text-sm text-[#e30613] hover:underline"
          >
            <ArrowLeft size={14} />
            Back to list
          </Link>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e30613]/30"
              placeholder="Competition title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e30613]/30"
              placeholder="Competition description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
              placeholder="100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                min={getTodayStr()}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || getTodayStr()}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Competition Image</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 p-6 text-center hover:bg-black/5">
              <UploadCloud className="mb-2 text-[#e30613]" />
              <span className="text-sm">Click to upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />
            </label>
            {preview && (
              <div className="mt-3 w-full rounded-xl border border-black/10 overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
          <Link
            to="/admin/competitions"
            className="inline-flex items-center gap-1 rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5"
          >
            <ArrowLeft size={14} />
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#e30613] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}




// // src/utils/Testing/CompetitionsEdit.jsx
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Save, ArrowLeft, Trophy } from "lucide-react";

// function getAxiosError(err) {
//   const data = err?.response?.data;
//   if (!data) return err?.message || "Unknown error";
//   if (typeof data === "string") return data;
//   if (data?.message) return data.message;
//   if (data?.error) return data.error;
//   if (Array.isArray(data?.errors)) {
//     return data.errors.map((e) => e.msg || e.message || JSON.stringify(e)).join(", ");
//   }
//   try {
//     return JSON.stringify(data);
//   } catch {
//     return String(data);
//   }
// }

// export default function EditCompetition() {
//   const { compId } = useParams(); // expects route: /admin/competitions/edit/:compId
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [points, setPoints] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loadingComp, setLoadingComp] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     async function hydrateFromApi() {
//       try {
//         setLoadingComp(true);
//         const token = localStorage.getItem("token");

//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/challenge`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const data = (res?.data || []).find(
//           (c) => c.challengeID === compId || c._id === compId
//         );

//         if (!data) throw new Error("Competition not found");
//         if (cancelled) return;

//         setTitle(data.title || "");
//         setDescription(data.description || "");
//         setPoints(data.points || "");
//         setStartDate(data.startDate ? data.startDate.split("T")[0] : "");
//         setEndDate(data.endDate ? data.endDate.split("T")[0] : "");
//       } catch (err) {
//         toast.error(`Failed to load competition: ${getAxiosError(err)}`);
//         navigate("/admin/competitions");
//       } finally {
//         if (!cancelled) setLoadingComp(false);
//       }
//     }

//     hydrateFromApi();
//     return () => {
//       cancelled = true;
//     };
//   }, [compId, navigate]);

//   async function handleSave() {
//     if (!title.trim()) return toast.error("Title is required");
//     if (!description.trim()) return toast.error("Description is required");
//     if (!points) return toast.error("Points are required");
//     if (!startDate) return toast.error("Start date is required");
//     if (!endDate) return toast.error("End date is required");

//     try {
//       setLoading(true);
//       const payload = {
//         title: title.trim(),
//         description: description.trim(),
//         points: Number(points),
//         startDate,
//         endDate,
//       };
//       const token = localStorage.getItem("token") || localStorage.getItem("jwt");

//       await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/challenge/update/${compId}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Competition updated");
//       navigate("/admin/competitions");
//     } catch (err) {
//       toast.error(`Update failed: ${getAxiosError(err)}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (loadingComp) {
//     return (
//       <div className="w-full min-h-[60vh] flex items-center justify-center">
//         <p className="text-sm text-neutral-500">Loading competition…</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-white text-black flex items-center justify-center p-6">
//       <div className="w-full max-w-3xl rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
//           <div className="flex items-center gap-2">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e30613] text-white">
//               <Trophy size={18} />
//             </div>
//             <div>
//               <h1 className="font-semibold">Edit Competition</h1>
//               <p className="text-xs text-neutral-500">ID: {compId}</p>
//             </div>
//           </div>
//           <Link
//             to="/admin/competitions"
//             className="inline-flex items-center gap-1 text-sm text-[#e30613] hover:underline"
//           >
//             <ArrowLeft size={14} />
//             Back to list
//           </Link>
//         </div>

//         {/* Form */}
//         <div className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e30613]/30"
//               placeholder="Competition title"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={5}
//               className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e30613]/30"
//               placeholder="Competition description"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Points</label>
//             <input
//               type="number"
//               value={points}
//               onChange={(e) => setPoints(e.target.value)}
//               className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
//               placeholder="100"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">End Date</label>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
//           <Link
//             to="/admin/competitions"
//             className="inline-flex items-center gap-1 rounded-xl border border-black/10 px-4 py-2 text-sm hover:bg-black/5"
//           >
//             <ArrowLeft size={14} />
//             Cancel
//           </Link>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="inline-flex items-center gap-2 rounded-xl bg-[#e30613] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             <Save size={16} />
//             {loading ? "Saving…" : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
