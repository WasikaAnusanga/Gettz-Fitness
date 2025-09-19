import { useEffect, useState } from "react";
import Loader from "../../components/lorder-animate";
import PlanCard from "../../components/PlanCard";
import axios from "axios";


export default function MembershipPlan() {
    const [planList,setPlanList] = useState([]);
    const [planLoaded,setPlanLoaded]= useState(false)
    useEffect(
        ()=>{
          
            if(!planLoaded){
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
  

  return (
    <div className="w-full min-h-screen  bg-white text-black flex justify-center items-center pt-10">

      { planLoaded?
      
   
          <div>
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
                {planList.map((planList,index) => (
                  <PlanCard key={planList.plan_id} plan={planList} />
                ))}
              </div>

              {/* Footer Note */}
              <p className="mt-10 text-center text-xs text-black/50">
                All plans include access to the Gettz Gym Management System portal.
                Prices in LKR. Taxes may apply.
              </p>
            </section>
          </div>
        :<Loader/>
      }
  

    </div>
        // <div className="w-full min-h-screen bg-red-900 pt-20 flex justify-center items-center">
        //   <Loader />
        // </div>
        
    
    
  );
}
