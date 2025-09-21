import { useEffect, useState } from "react";
import successGif from "../../../assets/payment-success.gif";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { generateReceiptPDF } from "../../../utils/paymentReciept";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [loaded, setLoaded] = useState(false);

  const [planName, setPlanName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const sessionId = searchParams.get("session_id");
  const [paymentAllData,setPaymentAllData]= useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const fullName= userData.firstName +" "+userData.lastName

  useEffect(() => {
    if (!loaded) {
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL +
            "/api/pay/fetchPayment/" +
            sessionId
        )
        .then((res) => {
          setPaymentAllData(res.data);
          setPlanName(res.data.subscription_id.plan_id.plan_name);
          setAmount(res.data.amount);
          setDate(res.data.createdAt.split("T")[0]);
          setPaymentId(res.data.payment_id);
          setLoaded(true);
        });
    }
  }, []);

  return (
    <div className="min-h-full bg-white text-[#0f172a] flex flex-col">
      {/* Main two-panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
        {/* LEFT: Copy + illustration */}
        <section className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">
            <span className="text-green-600">Payment Successful!</span>
          </h1>

          <p className="mt-5 max-w-xl text-slate-600">
            Payment successful — your membership plan is now active! We’ve
            emailed your receipt and updated your account with full member
            benefits. Head to your dashboard to book meal plans, explore
            training programs, and manage your plan or billing details. Welcome
            to Gettz Fitness — let’s get to work!
          </p>

          {/* RECEIPT */}
          <div className="mt-8 w-full max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-700 text-center">
              Payment receipt
            </h2>
            <hr className="my-2 border-slate-200 mx-auto" />

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Product</span>
                <span className="font-medium text-slate-800">{planName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-medium tracking-tight">
                  #TA_{paymentId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">
                  LKR.{amount}
                </span>
              </div>
            </div>
          </div>

          {/* ⭐ Buttons moved OUTSIDE the receipt box */}
          <div className="mt-6 flex gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-500"
            >
              Go to Home
            </Link>
            <button
              type="button"
              onClick={() => generateReceiptPDF(paymentAllData,fullName)}
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
            >
              Download receipt
            </button>
          </div>
        </section>

        {/* RIGHT: GIF*/}
        <aside className="relative overflow-hidden bg-[#FFFFFF]">
          <div className="flex h-full items-center justify-center pt-16 pb-28">
            <CardIllustration gifSrc={successGif} /> {/* GIF */}
          </div>
          <div className="absolute top-8 right-0 left-0 text-left px-6">
            <p className="text-xl  font-bold text-red-600">Thank you</p>
            <h3 className="text-xl font-bold">
              For Choosing <span className="text-red-600">Getzz</span> Fitness
            </h3>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Card illustration component
function CardIllustration({ gifSrc = successGif }) {
  return (
    <div className="relative w-full max-w-[520px]">
      {/* GIF overlay (centered) */}
      <img
        src={gifSrc}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 object-contain"
      />
    </div>
  );
}
