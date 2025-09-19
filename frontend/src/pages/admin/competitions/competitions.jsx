import axios from "axios";
import Loader from "../../../components/lorder-animate";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ChallengeDetailsPage() {
  const [challenges, setChallenges] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/challenge`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((res) => {
          setChallenges(res.data || []);
          setLoaded(true);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load challenges");
        });
    }
  }, [loaded]);

  async function confirmDelete(id) {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-72">
        <p className="text-sm text-gray-800">
          Are you sure you want to delete this challenge?
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              deleteChallenge(id);
            }}
            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ));
  }

  async function deleteChallenge(id) {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt");
    if (!token) {
      toast.error("You must be logged in as admin to delete a challenge");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/challenge/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Challenge deleted successfully");
      setLoaded(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete challenge");
    }
  }

  return (
    <div className="relative w-full h-full rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Competitions</h2>

        <Link
          to="/admin/competition/add"
          className="inline-flex items-center rounded-lg bg-[#e30613] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition"
        >
          + Add Competition
        </Link>
      </div>

      {loaded ? (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-3 py-2 text-left">No</th>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Competition ID</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Points</th>
                <th className="px-3 py-2 text-left">Start Date</th>
                <th className="px-3 py-2 text-left">End Date</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-neutral-500"
                    colSpan={8}
                  >
                    No competitions found.
                  </td>
                </tr>
              )}

              {challenges.map((ch, index) => (
                <tr
                  key={ch.challengeID || index}
                  className="border-t border-black/10"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">
                    {ch.imageUrl ? (
                      <img
                        src={ch.imageUrl}
                        alt={ch.title}
                        className="h-12 w-20 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-xs text-neutral-400">No Image</span>
                    )}
                  </td>
                  <td className="px-3 py-2">{ch.challengeID}</td>
                  <td className="px-3 py-2">{ch.title}</td>
                  <td className="px-3 py-2">{ch.points}</td>
                  <td className="px-3 py-2">
                    {new Date(ch.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(ch.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/competition/update/${encodeURIComponent(
                              ch.challengeID
                            )}`,
                            { state: ch }
                          )
                        }
                        className="rounded-md bg-black px-2 py-1 text-white hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => confirmDelete(ch.challengeID)}
                        className="rounded-md bg-[#e30613] px-2 py-1 text-white hover:opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}





// import axios from "axios";
// import Loader from "../../../components/lorder-animate";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";

// export default function ChallengeDetailsPage() {
//   const [challenges, setChallenges] = useState([]);
//   const [loaded, setLoaded] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loaded) {
//       axios
//         .get(`${import.meta.env.VITE_BACKEND_URL}/api/challenge`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//         .then((res) => {
//           setChallenges(res.data || []);
//           setLoaded(true);
//         })
//         .catch((err) => {
//           console.error(err);
//           toast.error("Failed to load challenges");
//         });
//     }
//   }, [loaded]);

//   async function confirmDelete(id) {
//     toast.custom((t) => (
//       <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col gap-3 w-72">
//         <p className="text-sm text-gray-800">
//           Are you sure you want to delete this challenge?
//         </p>
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               deleteChallenge(id);
//             }}
//             className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
//           >
//             Yes, Delete
//           </button>
//         </div>
//       </div>
//     ));
//   }

//   async function deleteChallenge(id) {
//     const token = localStorage.getItem("token") || localStorage.getItem("jwt");
//     if (!token) {
//       toast.error("You must be logged in as admin to delete a challenge");
//       return;
//     }
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/challenge/delete/${id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Challenge deleted successfully");
//       setLoaded(false);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to delete challenge");
//     }
//   }

//   return (
//     <div className="relative w-full h-full rounded-lg">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Competitions</h2>

//         <Link
//           to="/admin/competition/add"
//           className="inline-flex items-center rounded-lg bg-[#e30613] px-4 py-2 text-sm font-medium text-white hover:opacity-95 transition"
//         >
//           + Add Competition
//         </Link>
//       </div>

//       {loaded ? (
//         <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
//           <table className="w-full text-sm">
//             <thead className="bg-black text-white">
//               <tr>
//                 <th className="px-3 py-2 text-left">No</th>
//                 <th className="px-3 py-2 text-left">Competition ID</th>
//                 <th className="px-3 py-2 text-left">Title</th>
//                 <th className="px-3 py-2 text-left">Points</th>
//                 <th className="px-3 py-2 text-left">Start Date</th>
//                 <th className="px-3 py-2 text-left">End Date</th>
//                 <th className="px-3 py-2 text-left">Description</th>
//                 <th className="px-3 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {challenges.length === 0 && (
//                 <tr>
//                   <td
//                     className="px-3 py-4 text-center text-neutral-500"
//                     colSpan={8}
//                   >
//                     No competitions found.
//                   </td>
//                 </tr>
//               )}

//               {challenges.map((ch, index) => (
//                 <tr
//                   key={ch.challengeID || index}
//                   className="border-t border-black/10"
//                 >
//                   <td className="px-3 py-2">{index + 1}</td>
//                   <td className="px-3 py-2">{ch.challengeID}</td>
//                   <td className="px-3 py-2">{ch.title}</td>
//                   <td className="px-3 py-2">{ch.points}</td>
//                   <td className="px-3 py-2">
//                     {new Date(ch.startDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-3 py-2">
//                     {new Date(ch.endDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-3 py-2">{ch.description}</td>

//                   <td className="px-3 py-2">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() =>
//                           navigate(
//                             `/admin/competition/update/${encodeURIComponent(
//                               ch.challengeID
//                             )}`,
//                             { state: ch }
//                           )
//                         }
//                         className="rounded-md bg-black px-2 py-1 text-white hover:opacity-90"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => confirmDelete(ch.challengeID)}
//                         className="rounded-md bg-[#e30613] px-2 py-1 text-white hover:opacity-90"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <Loader />
//       )}
//     </div>
//   );
// }
