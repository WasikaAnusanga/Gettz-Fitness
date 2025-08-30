import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [paymentId,setPaymentId] =useState(null);
  useEffect(() => {
    // Extract query params from URL
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success");
    const id = queryParams.get("paymentId");

    setPaymentId(id)
    console.log(id)
    setStatus(success === "true" ? "success" : "failed");
    const token = localStorage.getItem("token");
    axios.post("http://localhost:3000/api/pay/verifyPayment/"+id,{},{
      headers:{
      "Authorization": "Bearer "+token
      }      
    })

    }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {status === "success" ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-green-600">Payment Successful ✅</h1>
          <p className="mt-4 text-gray-700">
            Thank you! Your payment has been successfully processed.
          </p>
          <p className="mt-2 text-gray-500">Payment ID: <span className="font-mono">{paymentId}</span></p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Go to Dashboard
          </a>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600">Payment Failed ❌</h1>
          <p className="mt-4 text-gray-700">
            Something went wrong with your payment. Please try again.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Go Back
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
