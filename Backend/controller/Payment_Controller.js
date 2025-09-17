import Subscription from "../model/Subscription_Model.js";
import Payment from "../model/Payment_Model.js";
import Stripe from "stripe";
import MembershipPlan from "../model/Membership_Plans_Model.js";
import axios from 'axios'
const stripe = new Stripe(process.env.SECRET_KEY);


export async function createPayment(req,res){
  console.log("createPayment runs")
  if(req.user==null){
    return res.status(404).json({message:"You have to login"})
  }
  try{
    const plan = await MembershipPlan.findOne({plan_id:req.params.id})

    if(plan){
      const token = req.headers["authorization"];

      
      await axios.post("http://localhost:3000/api/sub/addSub/"+req.params.id,{auto_renew:req.body.auto_renew},{
        headers:{
          "Authorization": token
        }
      })
      
      const paymentData={
        payment_id:0,
        user_id:req.user._id,
        amount:plan.price,
      }
      const lastPayment = await Payment.find().sort({ _id: -1 }).limit(1);

      if (lastPayment.length === 0) {
        paymentData.payment_id = 1;
      } else {
        const lastPaymentId = lastPayment[0].payment_id;
        paymentData.payment_id = lastPaymentId + 1;
      }

      const payment = await new Payment(paymentData)
      payment.save()
      console.log(payment)
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          locale: "en",
          line_items: [
            {
              price_data: {
                currency: "LKR",   
                product_data: {
                  name:plan.plan_name,
                },
                unit_amount: plan.price*100, 
              },
              quantity: 1,
            },
          ],
          success_url: `http://localhost:5173/payment-success?success=true&paymentId=${payment.payment_id}&planId=${req.params.id}`,
          cancel_url: "http://localhost:5173/cart?cancel=true",
        });

        res.json({ id: session.id });
      } catch (err) {
        return res.status(500).json({ message: err.response.data.message });
      }
    }
  }catch(err){
    console.log(err.response.data.message)
    return res.json({message:err.response.data.message})
  }
    
    
    

}

export async function verifyPayment(req,res){
  const paymentId=req.params.id;
  const sub = await Subscription.findOne({user_id:req.user._id})
  const payment = await Payment.findOne({payment_id:paymentId})

  sub.status="active"
  await sub.save()

  if(payment){
    payment.status="paid"
    payment.paid_at=new Date();
  }
  await payment.save()

  // const token = req.headers["authorization"];

      
  // await axios.put("http://localhost:3000/api/plan/updatePlan/"+req.params.id,{auto_renew:req.body.auto_renew},{
  //   headers:{
  //     "Authorization": token
  //   }
  // })

  res.status(200).json({message:"Payment Successfull"})

}

