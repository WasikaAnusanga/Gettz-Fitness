import MealPlan from "../model/mealplan.js"


export const getMealPlan = (req, res) => {
    req.user={role: "Trainer"};
    if(req.user.role == "Trainer"){
        MealPlan.find()
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Trainer authorization..."
        });
    }
};

export const addMealPlan = (req, res) => {
    req.user={role: "Trainer"};
    if(req.user.role == "Trainer"){
        const mealplan = new MealPlan({
            mealPlan_id: req.body.mealPlan_id,
            meal_name: req.body.meal_name,
            description: req.body.description,
            meal_type: req.body.meal_type,
            duration: req.body.duration,
        });
        mealplan.save()
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Trainer authorization..."
        });
    }
};

export const updateMealPlan = (req, res) => {
    req.user={role: "Trainer"};
    if(req.user.role == "Trainer"){
        const {
            mealPlan_id, 
            meal_name, 
            description, 
            meal_type, 
            duration
        } = req.body;
        MealPlan.updateOne(
            { mealPlan_id: mealPlan_id }, 
            { $set: { meal_name, description, meal_type, duration } }
        )
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Trainer authorization..."
        });
    }
};

export const deleteMeal = (req, res) => {
    req.user={role: "Trainer"};
    if(req.user.role == "Trainer"){
        const {mealPlan_id} = req.body;
        MealPlan.deleteOne({ mealPlan_id: mealPlan_id })
            .then(response => {
                res.json({response})
            })
            .catch(error => {
                res.json({error: error})
            })
    }else{
        res.status(401).json({
            message: "You need Trainer authorization..."
        });
    }
};

//getSelectedMealPlan