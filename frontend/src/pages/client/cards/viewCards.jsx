import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader-animate2";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

/** ---- Tiny helpers ---- */
const last4 = (num) => String(num ?? "").slice(-4);
const mask = (num) => `•••• •••• •••• ${last4(num)}`;

export default function SaveCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!loaded) {
      
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/card/", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          setCards(response.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  function handleDelete(cardId) {
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
        .delete(import.meta.env.VITE_BACKEND_URL + "/api/card/delete/"+cardId, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your Card has been deleted.",
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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Saved cards</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your payment methods used for Gettz Fitness.
            </p>
          </div>
          <div className="flex gap-2">
            
            <button
              onClick={() => navigate("/userDashboard/manageCards/addCard")}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              Add new card
            </button>
          </div>
        </div>

        {/* Single Card */}
        {cards.length === 0 && loaded == true && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-600">
            No saved cards yet. Click{" "}
            <span className="font-medium">Add new card</span> to get started.
          </div>
        )}
        {cards.map((cards, index) => {
          return (
            <div key={index} className="space-y-3 mt-2">
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
                    {cards.card_id}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {mask(cards.card_number)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {cards.card_name} — Expires {cards.expiry_date}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Update button */}
                  <button
                    onClick={() => {
                      navigate("/userDashboard/manageCards/updateCard", { state: cards });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <Pencil className="h-4 w-4" />
                    Update
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => {
                      handleDelete(cards.card_id)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-500 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!loaded && (
          <div className="flex items-center justify-center h-[400px] w-full">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
