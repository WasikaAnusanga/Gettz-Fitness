import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Loader from "../../../components/lorder-animate";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/plan/")
        .then((res) => {
          setPlans(res.data);
          setLoaded(true);
        })
        .catch((err) => console.log("message:", err));
    }
  }, [loaded]);
  const token = localStorage.getItem("token");
  function handleDelete(planId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            import.meta.env.VITE_BACKEND_URL + "/api/plan/deletePlan/" + planId,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
          )
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            setLoaded(false);
          })
          .catch((err) => {
            Swal.fire({
              title: "Not Deleted!",
              text: err,
              icon: "warning",
            });
            console.log("message:", err);
          });
      }
    });
  }
  return (
    <div className="p-6 ">
      {loaded && (
        <div className="mx-auto max-w-6xl">
          {/* header */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-black">
              Manage Membership Plans
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search by title, tags, alt name, ID…"
                  className="w-72 rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-red-500"
                />
              </div>
              <Link to={"/admin/membership/addPlan"}>
                <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-700">
                  <Plus className="h-4 w-4" />
                  Add a Plan
                </button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-x-auto">
            <table className="min-w-full table-fixed text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="w-20 px-4 py-3">Plan ID</th>
                  <th className="w-40 px-4 py-3">Plan Name</th>
                  <th className="w-28 px-4 py-3">Price</th>
                  <th className="w-28 px-4 py-3">Duration</th>
                  <th className="w-[200px] px-4 py-3">Description</th>
                  <th className="w-[230px] px-4 py-3 text-center">Features</th>
                  <th className="w-32 px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-500">
                {plans.map((plan, idx) => (
                  <tr key={plan.plan_id ?? idx} className="align-top">
                    <td className="w-20 px-4 py-3">{plan.plan_id}</td>
                    <td className="w-40 px-4 py-3 font-medium text-gray-900">
                      {plan.plan_name}
                    </td>
                    <td className="w-28 px-4 py-3">{plan.price}</td>
                    <td className="w-28 px-4 py-3">{plan.duration}</td>
                    <td className="w-[200px] px-4 py-3 whitespace-pre-line break-words">
                      {plan.description}
                    </td>
                    <td className="w-[230px] px-4 py-3 text-left align-top whitespace-pre-line break-words">
                      {Array.isArray(plan.features) ? (
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {plan.features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      ) : (
                        String(plan.features ?? "")
                      )}
                    </td>
                    <td className="w-32 px-4 py-3">
                      <div className="flex justify-evenly">
                        <button
                          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 mr-[5px]"
                          onClick={() =>
                            navigate("/admin/membership/updatePlan", {
                              state: plan,
                            })
                          }
                        >
                          Update
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(plan.plan_id)}
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
        </div>
      )}

      {!loaded && (
        <div className="h-[500px] border-2">
          <Loader />
        </div>
      )}
    </div>
  );
}
