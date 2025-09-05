import MealRequest from "../model/mealRequest.js"

export const getMealRequest = (req, res) => {
    req.user={role: "User"};
    if(req.user.role == "User"){
        MealRequest.find()
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need User authorization..."
        });
    }
};

export const addMealRequest = (req, res) => {
    req.user={role: "User"};
    if(req.user.role == "User"){
        const mealrequest = new MealRequest({
            request_id: req.body.request_id,
            user_id: req.body.user_id,
            user_name: req.body.user_name,
            request_date: req.body.request_date,
            weight: req.body.weight,
            height: req.body.height,
        });
        mealrequest.save()
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need User authorization..."
        });
    }
};


export const updateMealRequest = (req, res) => {
    req.user={role: "User"};
    if(req.user.role == "User"){
        const {
            request_id, 
            user_id, 
            user_name, 
            request_date, 
            weight,
            height,
        } = req.body;
        MealRequest.updateOne(
            { request_id: request_id }, 
            { $set: { user_id, user_name, request_date, weight, height } }
        )
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need User authorization..."
        });
    }
};

export const deleteMealRequest = (req, res) => {
    req.user={role: "User"};
    if(req.user.role == "User"){
        const {request_id} = req.body;
        MealRequest.deleteOne({ request_id: request_id })
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need User authorization..."
        });
    }
};

