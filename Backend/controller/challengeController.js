import mongoose from "mongoose";
import User from "../model/user.js";
import Challenge from "../model/challenge.js";
import UserChallenge from "../model/userChallenge.js";

export function viewChallenges(req, res){

     if(req.user == null){
        res.status(403).json({
            message: "Please login to view challenges"
        });
        return;
    }

    if(req.user.role != "member"){
        res.status(403).json({
            message: "Login as an member to view challenges"
        });
        return;
    }

    Challenge.find().then((challenges) => {
        res.json(challenges)
    }).catch((err) => {
        console.log(err)
        res.status(500).json({
            message : "Challenge not found!"
        })
    })
}

export function createChallenge(req, res){

     if(req.user == null){
        res.status(403).json({
            message: "Please login to create challenge"
        });
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message: "Login as an admin to create challenge"
        });
        return;
    }

    if(req.user == null){
        res.status(403).json({
            message: "Please login as admin to create a new user"
        });
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to create a new trainer account "
        });
        return;
    }

    const challenge = new Challenge(req.body)

    challenge.save().then(
        () => {res.json({
            message : "Challenge Saved Successfully!"
        })
        }
    ).catch((err) => {
        console.log(err)
        res.status(500).json({
            message : "Challenge Not Saved"
        })
    }) 

}

export function deleteChallenge(req, res){

     if(req.user == null){
        res.status(403).json({
            message: "Please login to delete challenge"
        });
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message: "Login as an admin to delete challenge"
        });
        return;
    }

    Challenge.findOneAndDelete({challengeID : req.params.id}).then(
        () => {
            res.json({
                message : "Challenge Deleted Successfully!"
            })
        }).catch(
            (err) => {
                console.log(err)
                res.status(500).json({
                    message : "Challenge not found! " + req.params.id
                })
            }
        )

}

export function updateChallenge(req, res){

     if(req.user == null){
        res.status(403).json({
            message: "Please login to update challenge"
        });
        return;
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message: "Login as an admin to update challenge"
        });
        return;
    }

    Challenge.findOneAndUpdate({challengeID : req.params.id}, req.body).then(
        (challenge) => {
            res.json({
                message : "Product Updated Successfully!",
                challenge
            })
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).json({
                message : "Product not updated!"
            })
        }
    )

}

export async function joinChallenge(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    if (req.user.role !== "member"){
        return res.status(403).json(
            { 
                message: "Members only" 
            }
        );
    }

    const challengeIdStr = req.params.id; 
    const challenge = await Challenge.findOne({ challengeID: challengeIdStr });
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const userId =
      typeof req.user._id === "string"
        ? new mongoose.Types.ObjectId(req.user._id)
        : req.user._id;

    const exists = await UserChallenge.findOne({ CID: challenge._id, user_id: userId });
    if (exists) {
      return res.status(409).json({ message: "You already joined this challenge" });
    }

    // stop joining after end date
    if (challenge.endDate && new Date(challenge.endDate) < new Date()) {
      return res.status(400).json({ message: "This challenge has ended" });
    }

    await new UserChallenge({ CID: challenge._id, user_id: userId }).save();

    const updated = await User.findByIdAndUpdate(
      userId,
      { $inc: { point: challenge.points } },
      { new: true }
    );

    return res.status(201).json({
      message: "Joined successfully",
      awarded: challenge.points,
      totalPoints: updated?.point ?? undefined,
      challengeID: challenge.challengeID
    });
  } catch (e) {
    console.error("joinChallenge error:", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}

//get list challengeIDs the current user joined
export async function myJoinedChallenges(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json(
        { message: "Unauthorized" }
      );
    }

    const userId = typeof req.user._id === "string" ? new mongoose.Types.ObjectId(req.user._id) : req.user._id;

    const rows = await UserChallenge.find({ user_id: userId }).populate("CID");
    const joined = rows
      .filter(r => r.CID)
      .map(r => r.CID.challengeID); 

    return res.json({ joined });
  } catch (e) {
    console.error("myJoinedChallenges error:", e);
    return res.status(500).json({ message: "Internal server error", error: e.message });
  }
}
