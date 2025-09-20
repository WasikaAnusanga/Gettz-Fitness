import Inquiry from "../model/inquiry.js";


export function createInquiry(req, res) {
  const inquiry = new Inquiry(req.body);
  inquiry
    .save()
    .then(() => {
      res.status(201).json({ message: "Successfully created!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Unsuccessful!", error: err.message });
    });
}



export function getAllInquiry(req, res) {
  Inquiry.find()
    .then((Inquiry) => {
      res.json(Inquiry);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error Getting Inquiries",
        error: err.message,
      });
    });
}
export function updateInquiry(req, res) {
  if (req.user == null) {
    return res.status(400).json({
      message: "Need to login first",
    });
  }

  Inquiry.findOneAndUpdate(
    {
      inquiry_id: req.params.inquiry_id,
    },
    req.body
  )
    .then((inqury) => {
      if (inqury == null) {
        return res.status(404).json({
          message: "Inquiry not found",
        });
      } else {
        res.json({
          message: "Successfully updated",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error,
      });
    });
}


export function deleteInquiry(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need logging first to delete a inquiry",
    });
    return;
  }
  if (!req.user.role == "supporter") {
    res.status(403).json({
      message: "You are not allowed to delete a inquiry",
    });
    return;
  }
  Inquiry.findOneAndDelete({
    inquiry_id: req.params.inquiry_id,
  })
    .then((inquiry) => {
      if (inquiry == null) {
        res.status(404).json({
          message: "Inquiry session not found",
        });
      } else {
        res.json({
          message: "Inquiry deleted successfully",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error deleting Inquiry",
        error: err.message,
      });
    });
}


export async function getInquiryById(req, res) {
  const inquiry_id = req.params.inquiry_id;
  const inquiry = await Inquiry.findOne({ inquiry_id: inquiry_id });

  if (inquiry == null) {
    res.status(404).json({
      message: "Product Not Found",
    });
    return;
  }
  res.json({
    inquiry: inquiry,
  });
}
