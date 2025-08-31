// pages/MembershipPlan.jsx
import { useEffect, useState } from "react";
import Loader from "../../components/lorder-animate";
import PlanCard from "../../components/PlanCard";
import axios from "axios";


export default function MembershipPlan() {
    const [planList,setPlanList] = useState([]);
    const [planLoaded,setPlanLoaded]= useState(false)
    useEffect(
        ()=>{
            if(!setPlanLoaded){
                axios.get(import.meta.env.VITE_BACKEND_URL+"/api/plan/").then(
                    (res)=>{
                        setPlanList(res.data)
                        setPlanLoaded(true)
                    }
                ).catch(
                    (err) => {
                    console.error("Error fetching products:", err)}
                )
            }
           
    
        },[planLoaded]
    )
  const plans = [
    {
      key: "beginner",
      name: "Beginner",
      blurb: "Start strong with essential workouts and guidance.",
      price: 49,
      cta: "Choose Beginner",
      features: [
        "Access to all exercise videos",
        "Progress tracking",
        "Supportive online community",
        "Personalized workout plan",
        "Basic nutrition guidance",
        "Group fitness classes",
      ],
      popular: false,
    },
    {
      key: "pro",
      name: "Pro",
      blurb: "Advanced programs and nutrition for faster results.",
      price: 99,
      cta: "Choose Pro",
      features: [
        "Advanced workout programs",
        "Comprehensive nutrition coaching",
        "Body composition analysis",
        "Progress tracking & insights",
        "Priority support",
        "Access to beta features",
      ],
      popular: true,
    },
    {
      key: "custom",
      name: "Custom",
      blurb: "One-on-one coaching tailored to your goals.",
      price: 149,
      cta: "Choose Custom",
      features: [
        "Fully customized plan",
        "Weekly check-ins with trainer",
        "Access to all platform features",
        "Exclusive gear discounts",
        "Accountability & habit coaching",
        "Form checks & feedback",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black"><br/><br/><br/>
      
   
    
      {/* Header */}
      <section className="mx-auto max-w-6xl px-4 pt-0 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Gym Membership Plans
        </h1>
        <p className="mt-3 text-sm md:text-base text-black/70">
          Select a plan that fits your fitness goals.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-10 text-center text-xs text-black/50">
          All plans include access to the Gettz Gym Management System portal.
          Prices in LKR. Taxes may apply.
        </p>
      </section>
    
  

    </div>
        // <div className="w-full min-h-screen bg-red-900 pt-20 flex justify-center items-center">
        //   <Loader />
        // </div>
        
    
    
  );
}
