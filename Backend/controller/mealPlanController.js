import meal from "../model/mealplan.js";
import MealPlan from "../model/mealplan.js";

export const getMealPlan = (req, res) => {
  req.user = { role: "Trainer" };
  if (req.user.role == "Trainer") {
    MealPlan.find()
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Trainer authorization...",
    });
  }
};

export const getOneMealPlan = (req, res) => {
  const user = req.user._id;
  if (req.user.role == "user") {
    MealPlan.find({ user_id: user })
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need User authorization...",
    });
  }
};




export const addMealPlan = (req, res) => {
  req.user = { role: "Trainer" };
  if (req.user.role == "Trainer") {
    const mealplan = new MealPlan({
      user_name: req.body.user_name,
      meal_name: req.body.meal_name,
      description: req.body.description,
      meal_type: req.body.meal_type,
      duration: req.body.duration,
      calaries: req.body.calaries,
      user_id: req.body.user_id,
    });
    mealplan
      .save()
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Trainer authorization...",
    });
  }
};

export const updateMealPlan = (req, res) => {
  req.user = { role: "Trainer" };
  if (req.user.role == "Trainer") {
    const {
      user_name,
      meal_name,
      description,
      meal_type,
      duration,
      calaries,
      user_id,
    } = req.body;
    const mealPlan_id = Number(req.params.id);
    MealPlan.updateOne(
      { mealPlan_id: mealPlan_id },
      {
        $set: {
          user_name,
          meal_name,
          description,
          meal_type,
          duration,
          calaries,
          user_id,
        },
      }
    )
      .then((response) => {
        res.json({ response });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Trainer authorization...",
    });
  }
};

export const deleteMeal = (req, res) => {
  req.user = { role: "Trainer" };
  if (req.user.role == "Trainer") {
    const mealPlan_id = Number(req.params.id);
    MealPlan.findOneAndDelete({ mealPlan_id: mealPlan_id })
      .then((response) => {
        res.status(200).json({
          message: "Delete Successful",
        });
      })
      .catch((error) => {
        res.json({ error: error });
      });
  } else {
    res.status(401).json({
      message: "You need Trainer authorization...",
    });
  }
};
