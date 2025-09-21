import MealRequest from "../model/mealRequest.js";

export const getMealRequest = (req, res) => {
  req.user = { role: "User" };
  if (req.user.role == "User") {
    MealRequest.find()
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

export const getOneMealRequest = (req, res) => {
  const user = req.user._id;
  if (req.user.role == "user") {
    MealRequest.find({ user_id: user })
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

export const addMealRequest = (req, res) => {
  const user = req.user._id;
  if (req.user.role == "user") {
    //role should also be member
    const mealrequest = new MealRequest({
      user_id: user,
      user_name: req.body.user_name,
      request_date: req.body.request_date,
      weight: req.body.weight,
      height: req.body.height,
      last_name: req.body.last_name,
      description: req.body.description,
      mealType: req.body.mealType,
    });
    mealrequest
      .save()
      .then((response) => {
        console.log(response);
        res.status(200).json({ response });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
        console.log(error);
      });
  } else {
    res.status(401).json({
      message: "You need User authorization...",
    });
  }
};

export const updateMealRequest = (req, res) => {
  req.user = { role: "User" };
  if (req.user.role == "User") {
    const {
      user_id,
      user_name,
      request_date,
      weight,
      height,
      last_name,
      description,
      mealType,
    } = req.body;
    const request_id = Number(req.params.id);
    MealRequest.updateOne(
      { request_id: request_id },
      {
        $set: {
          user_id,
          user_name,
          request_date,
          weight,
          height,
          last_name,
          description,
          mealType,
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
      message: "You need User authorization...",
    });
  }
};

export const deleteMealRequest = (req, res) => {
  req.user = { role: "User" };
  if (req.user.role == "User") {
    const request_id = Number(req.params.id);
    MealRequest.deleteOne({ request_id: request_id })
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
