import CreditCard from "../model/creditCard.js";

export function addCard(req, res) {
  //check user is an admin
  // req.user="admin";
  console.log("card adding runs");
  //
  if (req.user.role != "user") {
    res.status(401).json({
      message: "You need to Login as a User",
    });
  } else {
    const body = {
      card_id: null,
      card_name: req.body.card_name,
      card_number: req.body.card_number,
      expiry_date: req.body.expiry_date,
    };
    CreditCard.find({ card_number: body.card_number }).then((card) => {
      if (card.length == 0) {
        CreditCard.find()
          .sort({ _id: -1 })
          .limit(1)
          .then((output) => {
            if (output.length == 0) {
              body.card_id = 1;
            } else {
              const lastCardId = output[0].card_id;
              body.card_id = lastCardId + 1;
            }
            const card = new CreditCard(body);

            card
              .save()
              .then(() => {
                res.status(200).json({
                  message: "Plan added Successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  message: "Plan added Failed",
                });
              });
          })
          .catch(() => {
            res.status(500).json({
              message: "DataBase Problem",
            });
          });
      }else{
        res.status(200).json({message:"Same card"})
      }
    });
  }
}
export function getCards(req, res) {
  CreditCard.find({
    // user_id:req.user._id
  })
    .then((cards) => {
      res.status(200).json(cards);
    })
    .catch(() => {
      res.status(500).json({ message: "Error retrieving cards" });
    });
}

export function updateCard(req, res) {
  //check user is an admin

  //
  if (req.user == null) {
    res.status(401).json({
      message: "You need to Login First",
    });
  } else if (req.user.role != "admin") {
    res.status(401).json({
      message: "You are needed Administrative access",
    });
  } else if ((req.user.role = "admin")) {
    const planId = req.params.id;
    MembershipPlan.findOneAndUpdate(
      {
        plan_id: planId,
      },
      req.body
    )
      .then(() => {
        res.status(200).json({ message: "Plan Update successful." });
      })
      .catch(() => {
        res.status(500).json({ message: "Plan Update Failed." });
      });
  }
}

export function deletePlan(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "You need to Login First",
    });
  } else if (req.user.role != "admin") {
    res.status(401).json({
      message: "You are needed Administrative access",
    });
  } else if ((req.user.role = "admin")) {
    const planId = req.params.id;
    MembershipPlan.findOneAndUpdate(
      {
        plan_id: planId,
      },
      {
        isDisabled: true,
      }
    )
      .then(() => {
        res.status(200).json({ message: "Plan deleted successful." });
      })
      .catch(() => {
        res.status(500).json({ message: "Plan deletion Failed." });
      });
  }
}

export function getSelectedPlan(req, res) {
  const planId = req.params.id;
  MembershipPlan.findOne({
    plan_id: planId,
  })
    .then((plan) => {
      if (plan != null) {
        res.status(200).json(plan);
      } else res.status(400).json({ message: "Product Not found" });
    })
    .catch(() => {
      res.status(500).json({ message: "Database Error" });
    });
}
