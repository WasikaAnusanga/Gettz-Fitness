import Challenge from "../model/challenge.js";

export function viewChallenges(req, res){
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