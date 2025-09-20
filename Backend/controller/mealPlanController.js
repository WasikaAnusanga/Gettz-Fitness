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

export const addMealPlan = (req, res) => {
  req.user = { role: "Trainer" };
  if (req.user.role == "Trainer") {
    const mealplan = new MealPlan({
      mealPlan_id: req.body.mealPlan_id,
      user_id: req.body.user_id,
      meal_name: req.body.meal_name,
      description: req.body.description,
      meal_type: req.body.meal_type,
      duration: req.body.duration,
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
      mealPlan_id,
      user_id,
      meal_name,
      description,
      meal_type,
      duration,
    } = req.body;
    MealPlan.updateOne(
      { mealPlan_id: mealPlan_id },
      {
        $set: {
          user_id,
          meal_name,
          description,
          meal_type,
          duration,
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
    MealPlan.findOneAndDelete({ mealPlan_id: req.params.id })
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
