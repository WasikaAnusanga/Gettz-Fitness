// import axios from "axios";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import {
//   Medal,
//   Loader2,
//   Users,
//   CalendarDays,
//   Award,
//   CheckCircle,
//   Image as ImageIcon,
//   Search as SearchIcon,
// } from "lucide-react";
// import Header from "../../components/header";
// import Leaderboard from "../leaderboard";

// function getAxiosError(err) {
//   const data = err?.response?.data;
//   if (!data) return err?.message || "Unknown error";
//   if (typeof data === "string") return data;
//   if (data?.message) return data.message;
//   if (data?.error) return data.error;
//   return String(data);
// }

// export default function Competitions() {
//   const [challenges, setChallenges] = useState([]);
//   const [myChallenges, setMyChallenges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [joining, setJoining] = useState(null);
//   const [activeTab, setActiveTab] = useState("all"); // "my" or "all"
//   const [searchTerm, setSearchTerm] = useState("");
//   // Filtered lists based on search term
//   const filterFn = (c) =>
//     c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.description?.toLowerCase().includes(searchTerm.toLowerCase());
//   const filteredChallenges = challenges.filter(filterFn);
//   const filteredMyChallenges = myChallenges.filter(filterFn);

//   const token = localStorage.getItem("token") || localStorage.getItem("jwt");

//   async function fetchChallenges() {
//     try {
//       setLoading(true);
//       const [chRes, joinedRes] = await Promise.all([
//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/challenge`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/challenge/joined`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//       setChallenges(chRes.data || []);
//       setMyChallenges(joinedRes.data?.joined || []);
//     } catch (err) {
//       toast.error(`Failed to load competitions: ${getAxiosError(err)}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchChallenges();
//   }, []);

//   async function joinChallenge(challengeID) {
//     try {
//       setJoining(challengeID);
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/challenge/join/${challengeID}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("You joined the challenge! Awaiting trainer approval for points.");
//       fetchChallenges();
//     } catch (err) {
//       toast.error(getAxiosError(err));
//     } finally {
//       setJoining(null);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="w-full min-h-[60vh] flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#e30613]" size={32} />
//         <p className="ml-2 text-sm text-neutral-600">Loading competitions…</p>
//       </div>
//     );
//   }

//   // reusable card renderer
//   // Helper to get completion status for joined challenges
//   function getCompletionStatus(challenge) {
//     // Find the user's joined challenge record for this challenge
//     const joined = myChallenges.find(
//       (mc) => mc.challengeID === challenge.challengeID
//     );
//     if (!joined) return null;
//     if (joined.completed) return "completed";
//     return "pending";
//   }

//   const renderCard = (c, isJoined) => {
//     const now = new Date();
//     const ended = c.endDate && new Date(c.endDate) < now;
//     const completionStatus = isJoined ? getCompletionStatus(c) : null;

//     return (
//       <div
//         key={c.challengeID}
//         className="rounded-2xl border border-black/10 bg-white shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col"
//       >
//         {/* Image */}
//         {c.imageUrl ? (
//           <div className="w-full h-56 bg-gray-100">
//             <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
//           </div>
//         ) : (
//           <div className="w-full h-40 flex items-center justify-center bg-gradient-to-r from-[#e30613] to-red-600 text-white">
//             <ImageIcon size={32} className="opacity-70" />
//           </div>
//         )}

//         {/* Card body */}
//         <div className="p-5 flex-1 flex flex-col">
//           <h2 className="font-semibold text-lg line-clamp-2 mb-1 text-[#e30613]">
//             {c.title}
//           </h2>
//           <p className="text-sm text-neutral-700 line-clamp-3 mb-3">
//             {c.description}
//           </p>

//           <div className="space-y-1 text-xs text-neutral-600">
//             <p className="flex items-center gap-1">
//               <CalendarDays size={14} />{" "}
//               {new Date(c.startDate).toLocaleDateString()} –{" "}
//               {new Date(c.endDate).toLocaleDateString()}
//             </p>
//             <p className="flex items-center gap-1">
//               <Users size={14} /> Participants: {c.participantCount}
//             </p>
//             <p className="flex items-center gap-1">
//               <Award size={14} /> Reward: {c.points} points
//             </p>
//           </div>

//           <div className="mt-4 flex justify-between items-center">
//             {isJoined ? (
//               completionStatus === "completed" ? (
//                 <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
//                   <CheckCircle size={14} /> Completed (Points Awarded)
//                 </span>
//               ) : (
//                 <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
//                   <CheckCircle size={14} /> Pending Trainer Approval
//                 </span>
//               )
//             ) : ended ? (
//               <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
//                 Ended
//               </span>
//             ) : (
//               <button
//                 disabled={joining === c.challengeID}
//                 onClick={() => joinChallenge(c.challengeID)}
//                 className="px-6 py-2 w-full text-sm font-medium rounded-lg 
//                           bg-[#e30613] text-white border border-[#e30613]
//                           hover:bg-white hover:text-[#e30613]
//                           transition-colors duration-200
//                           disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {joining === c.challengeID ? "Joining…" : "Join"}
//               </button>   
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-rose-100 via-white to-red-200 text-black p-6 flex flex-col items-center">
//       <Header />
//       <div className="w-full max-w-[1600px] px-4 lg:px-6 mt-16">
//         {/* Header and Search Bar in one row */}
//         <div className="flex items-center justify-between mb-6 w-full gap-4 flex-wrap">
//           <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-[#e30613] to-red-600 text-transparent bg-clip-text">
//             <Medal size={28} /> Competitions
//           </h1>
//           <div className="relative w-full max-w-xs">
//             <input
//               type="text"
//               placeholder="Search competitions..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e30613]"
//             />
//             <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//               <SearchIcon size={18} className="text-gray-400" />
//             </span>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-8">
//           <button
//             onClick={() => setActiveTab("all")}
//             className={`px-4 py-2 rounded-xl text-sm font-medium ${
//               activeTab === "all"
//                 ? "bg-[#e30613] text-white shadow"
//                 : "border border-black/10 hover:bg-black/5"
//             }`}
//           >
//             All Competitions
//           </button>
//           <button
//             onClick={() => setActiveTab("my")}
//             className={`px-4 py-2 rounded-xl text-sm font-medium ${
//               activeTab === "my"
//                 ? "bg-[#e30613] text-white shadow"
//                 : "border border-black/10 hover:bg-black/5"
//             }`}
//           >
//             My Competitions
//           </button>
//           <button
//             onClick={() => setActiveTab("my")}
//             className={`px-4 py-2 rounded-xl text-sm font-medium ${
//               activeTab === "my"
//                 ? "bg-[#e30613] text-white shadow"
//                 : "border border-black/10 hover:bg-black/5"
//             }`}
//           >
//             Leaderboard
//           </button>
//         </div>

//         {/* Content */}
//         {activeTab === "my" ? (
//           <div>
//             {filteredMyChallenges.length === 0 ? (
//               <p className="text-sm text-neutral-500">
//                 You haven’t joined any competitions yet.
//               </p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {filteredMyChallenges.map((c) => renderCard(c, true))}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div>
//             {filteredChallenges.length === 0 ? (
//               <p className="text-sm text-neutral-500 text-center mt-10">
//                 No competitions available right now.
//               </p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {filteredChallenges.map((c) => {
//                   const isJoined = myChallenges.some(
//                     (mc) => mc.challengeID === c.challengeID
//                   );
//                   return renderCard(c, isJoined);
//                 })}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Medal,
  Loader2,
  Users,
  CalendarDays,
  Award,
  CheckCircle,
  Image as ImageIcon,
  Search as SearchIcon,
  Trophy,
} from "lucide-react";
import Leaderboard from "../leaderboard";
import Loader from "../../components/loader-animate2";

function getAxiosError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message || "Unknown error";
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return String(data);
}

export default function Competitions() {
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "my", "all", or "leaderboard"
  const [searchTerm, setSearchTerm] = useState("");
  // Filtered lists based on search term
  const filterFn = (c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase());
  const filteredChallenges = challenges.filter(filterFn);
  const filteredMyChallenges = myChallenges.filter(filterFn);

  const token = localStorage.getItem("token") || localStorage.getItem("jwt");

  async function fetchChallenges() {
    try {
      setLoading(true);
      const [chRes, joinedRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/challenge`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/challenge/joined`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setChallenges(chRes.data || []);
      setMyChallenges(joinedRes.data?.joined || []);
    } catch (err) {
      toast.error(`Failed to load competitions: ${getAxiosError(err)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function joinChallenge(challengeID) {
    try {
      setJoining(challengeID);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/challenge/join/${challengeID}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("You joined the challenge! Awaiting trainer approval for points.");
      fetchChallenges();
    } catch (err) {
      toast.error(getAxiosError(err));
    } finally {
      setJoining(null);
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  // Helper to get completion status for joined challenges
  function getCompletionStatus(challenge) {
    // Find the user's joined challenge record for this challenge
    const joined = myChallenges.find(
      (mc) => mc.challengeID === challenge.challengeID
    );
    if (!joined) return null;
    if (joined.completed) return "completed";
    return "pending";
  }

  const renderCard = (c, isJoined) => {
    const now = new Date();
    const ended = c.endDate && new Date(c.endDate) < now;
    const completionStatus = isJoined ? getCompletionStatus(c) : null;

    return (
      <div
        key={c.challengeID}
        className="rounded-2xl border border-black/10 bg-white shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col"
      >
        {/* Image */}
        {c.imageUrl ? (
          <div className="w-full h-56 bg-gray-100">
            <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gradient-to-r from-[#e30613] to-red-600 text-white">
            <ImageIcon size={32} className="opacity-70" />
          </div>
        )}

        {/* Card body */}
        <div className="p-5 flex-1 flex flex-col">
          <h2 className="font-semibold text-lg line-clamp-2 mb-1 text-[#e30613]">
            {c.title}
          </h2>
          <p className="text-sm text-neutral-700 line-clamp-3 mb-3">
            {c.description}
          </p>

          <div className="space-y-1 text-xs text-neutral-600">
            <p className="flex items-center gap-1">
              <CalendarDays size={14} />{" "}
              {new Date(c.startDate).toLocaleDateString()} –{" "}
              {new Date(c.endDate).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-1">
              <Users size={14} /> Participants: {c.participantCount}
            </p>
            <p className="flex items-center gap-1">
              <Award size={14} /> Reward: {c.points} points
            </p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            {isJoined ? (
              completionStatus === "completed" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  <CheckCircle size={14} /> Completed (Points Awarded)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                  <CheckCircle size={14} /> Pending Trainer Approval
                </span>
              )
            ) : ended ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-600">
                Ended
              </span>
            ) : (
              <button
                disabled={joining === c.challengeID}
                onClick={() => joinChallenge(c.challengeID)}
                className="px-6 py-2 w-full text-sm font-medium rounded-lg 
                          bg-[#e30613] text-white border border-[#e30613]
                          hover:bg-white hover:text-[#e30613]
                          transition-colors duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining === c.challengeID ? "Joining…" : "Join"}
              </button>   
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-rose-100 via-white to-amber-50 text-black p-6 flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-4 lg:px-6">
        {/* Header and Search Bar in one row */}
        <div className="flex items-center justify-between mb-6 w-full gap-4 flex-wrap">
          <h1 className="text-3xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-[#e30613] to-red-600 text-transparent bg-clip-text">
            <Medal size={28} /> Competitions
          </h1>
          {activeTab !== "leaderboard" && (
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search competitions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e30613]"
              />
              <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === "all"
                ? "bg-[#e30613] text-white shadow"
                : "border border-black/10 hover:bg-black/5"
            }`}
          >
            All Competitions
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === "my"
                ? "bg-[#e30613] text-white shadow"
                : "border border-black/10 hover:bg-black/5"
            }`}
          >
            My Competitions
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${
              activeTab === "leaderboard"
                ? "bg-[#e30613] text-white shadow"
                : "border border-black/10 hover:bg-black/5"
            }`}
          >
            Leaderboard
          </button>
        </div>

        {/* Content */}
        {activeTab === "leaderboard" ? (
          <Leaderboard />
        ) : activeTab === "my" ? (
          <div>
            {filteredMyChallenges.length === 0 ? (
              <p className="text-sm text-neutral-500">
                You haven't joined any competitions yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMyChallenges.map((c) => renderCard(c, true))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredChallenges.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center mt-10">
                No competitions available right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredChallenges.map((c) => {
                  const isJoined = myChallenges.some(
                    (mc) => mc.challengeID === c.challengeID
                  );
                  return renderCard(c, isJoined);
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}