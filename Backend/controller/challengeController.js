import Challenge from "../model/challenge.js";

export function viewChallenges(req, res){

     // if(req.user == null){
    //     res.status(403).json({
    //         message: "Please login to view challenges"
    //     });
    //     return;
    // }

    // if(req.user.role != "member"){
    //     res.status(403).json({
    //         message: "Login as an member to view challenges"
    //     });
    //     return;
    // }

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

     // if(req.user == null){
    //     res.status(403).json({
    //         message: "Please login to create challenge"
    //     });
    //     return;
    // }

    // if(req.user.role != "admin"){
    //     res.status(403).json({
    //         message: "Login as an admin to create challenge"
    //     });
    //     return;
    // }

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

     // if(req.user == null){
    //     res.status(403).json({
    //         message: "Please login to delete challenge"
    //     });
    //     return;
    // }

    // if(req.user.role != "admin"){
    //     res.status(403).json({
    //         message: "Login as an admin to delete challenge"
    //     });
    //     return;
    // }

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

     // if(req.user == null){
    //     res.status(403).json({
    //         message: "Please login to update challenge"
    //     });
    //     return;
    // }

    // if(req.user.role != "admin"){
    //     res.status(403).json({
    //         message: "Login as an admin to update challenge"
    //     });
    //     return;
    // }

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