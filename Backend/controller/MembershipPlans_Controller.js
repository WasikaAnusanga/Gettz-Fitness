import MembershipPlan from "../model/Membership_Plans_Model.js"

export function addPlan(req,res){
    //check user is an admin
    req.user="admin";
    req.user={role:"admin"};
    //
    if(req.user==null){
        res.status(401).json({
            message:"You need to Login First"
        })
        
    }else if(req.user.role!="admin"){
        res.status(401).json({
            message:"You are needed Administrative access"
        })
        
    }else if(req.user.role="admin"){
        
        const body = {
            plan_id:null,
            plan_name:req.body.plan_name,
            price:req.body.price,
            description:req.body.description,
            duration:req.body.duration
        }
        MembershipPlan.find().sort({ _id: -1 }).limit(1).then((output)=>{
            if(output.length==0){
                body.plan_id=1;
            }else{
                const lastPlanId= output[0].plan_id;
                body.plan_id=(lastPlanId+1);
            }
            const plan = new MembershipPlan(body);

            plan.save()
            .then(()=>{
                res.status(200).json({
                    message:"Plan added Successfully"
                })
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).json({
                    message:"Plan added Failed"
                })
            })

        }).catch(()=>{
            res.status(500).json({
                message:"DataBase Problem"
            })
        })
    }

}

export function updatePlan(req,res){
    //check user is an admin
    req.user="admin";
    req.user={role:"admin"};
    //
    if(req.user==null){
        res.status(401).json({
            message:"You need to Login First"
        })
    }else if(req.user.role!="admin"){
        res.status(401).json({
            message:"You are needed Administrative access"
        })
    }else if(req.user.role="admin"){
        const planId= req.params.id;
        MembershipPlan.findOneAndUpdate({
            plan_id:planId
        },req.body)
        .then(
            ()=>{
                res.status(200).json({message:"Plan Update successful."})
            }
        )
        .catch(()=>{
            res.status(500).json({message:"Plan Update Failed."})
        })

    }

}

export function getPlans(req,res){
    MembershipPlan.find()
    .then((plans)=>{
        res.status(200).json(plans);
    })
    .catch(()=>{
        res.status(500).json({ message: "Error retrieving plans"})
    })
}

export function deletePlan(req,res){
    req.user={role:"admin"};
    if(req.user==null){
        res.status(401).json({
            message:"You need to Login First"
        })
    }else if(req.user.role!="admin"){
        res.status(401).json({
            message:"You are needed Administrative access"
        })
    }else if(req.user.role="admin"){
        const planId= req.params.id;
        MembershipPlan.findOneAndDelete({
            plan_id:planId
        })
        .then(
            ()=>{
                res.status(200).json({message:"Plan deleted successful."})
            }
        )
        .catch(()=>{
            res.status(500).json({message:"Plan deletion Failed."})
        })

    }
}

export function getSelectedPlan(req,res){
    const planId = req.params.id;
    MembershipPlan.findOne({
        plan_id:planId
    })
    .then((plan)=>{
        if(plan!=null){
            res.status(200).json(plan);
        }
        else
            res.status(400).json({message:"Product Not found"})
    })
    .catch(()=>{
        res.status(500).json({message:"Database Error"})
    })
}