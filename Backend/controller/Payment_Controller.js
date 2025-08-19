import Subscription from "../model/Subscription_Model.js";
import Payment from "../model/Payment_Model.js";
import md5 from 'crypto-js/md5.js';

export function createPayment(req,res){
    const merchantSecret  = "ODMwNTYzNDA3Mzc1ODE2MjAzOTM0MTU1MTU1ODUzNTI0NzM4OTkz"
    
    
    
    const hashedSecret    = md5(merchantSecret).toString().toUpperCase();
   // let amountFormated  = parseFloat( amount ).toLocaleString( 'en-us', { minimumFractionDigits : 2 } ).replaceAll(',', '');
    

    

    const merchant_id = 1231699
    const return_url = "https://70d17c57fbec.ngrok-free.app"
    const cancel_url = "https://70d17c57fbec.ngrok-free.app"
    const notify_url =  "https://70d17c57fbec.ngrok-free.app/api/pay/verifyPayment"
    const first_name = "Wasika"
    const last_name = "Anusanga"
    const email = "wasika@gmail.com"
    const phone = "0703376900"
    const address = "Matara"
    const city = "Matara"
    const country = "Sri Lanka"
    const order_id = '68a0cf7d7fba38523b7a3432'+Date.now()
    const items = "Subscription Fees"
    const currency ="LKR"
    const amount = 10000
    const amountFormated  = parseFloat( amount ).toLocaleString( 'en-us', { minimumFractionDigits : 2 } ).replaceAll(',', '');

    
    const hash = md5(merchant_id + order_id + amountFormated + currency + hashedSecret).toString().toUpperCase();


    const subId=req.body.sub_Id;
    console.log(subId)
    Subscription.findById(subId ).populate("plan_id")
    .then((sub)=>{
        if(sub){
            
            const paymentData={
                subscription_id:subId,
                user_id:sub.user_id,
                amount:sub.plan_id.price,
                currency:"LKR",
                status:"pending",
                notes:req.body.notes

            }
            const resData={
                merchant_id: merchant_id,
                return_url: return_url,
                cancel_url: cancel_url,
                notify_url: notify_url,
                order_id,
                items,
                amount,
                currency,
                first_name,
                last_name,
                email,
                phone,
                hash,
                address,
                city,
                country
            }
            
            const payment = new Payment(paymentData);
            payment.save()
            .then(()=>{
                res.status(200).json({message:"payment created",resData});
            })
            .catch(()=>{
                 res.status(500).json({message:"Server error when saving the created payment"});
            })

        }else{
            res.status(500).json({message:"Invalid Subscription"});
        }
    })
    .catch((err)=>{
        res.status(500).json({message:"Server error when Validating the subscriptionId"+err});
    });

}

export function verifyPayment(req,res){
    console.log("Verifying Payment")
}