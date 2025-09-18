import LiveSession from "../model/liveSession.js";

export async function createSession(req,res){
    if(req.user == null){
        res.status(403).json({
            message: "You need logging first to create a product"
        })
        return;
    }
    if(!req.user.role == 'Trainer'){
         res.status(403).json({
            message: "You are not allowed to create a live session"
        })
        return;
    }
    const sessionData = new LiveSession(req.body);
    try{
        await sessionData.save();
        res.status(201).json({
            message: "Live session created successfully",
            session: sessionData
        })  
    }catch(err){
        res.status(500).json({
            message: "Error creating live session",
            error: err.message
        })
    }
}
export function getAllSessions(req,res){
    LiveSession.find().then(
        (sessions)=>{
            res.json(sessions);
        }
    ).catch((err)=>{
        res.status(500).json({
            message: "Error fetching live sessions",
            error: err.message
        })
    })
}
export function deleteSession(req,res){
    if(req.user == null){
        res.status(403).json({
            message: "You need logging first to delete a product"
        })
        return;
    }
    if(!req.user.role == 'Trainer'){
         res.status(403).json({
            message: "You are not allowed to delete a live session"
        })
        return;
    }
    LiveSession.findOneAndDelete({
        sessionId: req.params.sessionId
    }).then(
        (session)=>{
            if(session==null){
                res.status(404).json({
                    message: "Live session not found"
                })
            }else{
                res.json({
                    message: "Live session deleted successfully"
                })
            }
        }
    ).catch((err)=>{
        res.status(500).json({
            message: "Error deleting live session",
            error: err.message
        })
    })
}
export async function getSessionById(req,res){
    const sessionId = req.params.id;
    const session = await LiveSession.findOne({sessionId : sessionId})

    if(session == null){
        res.status(404).json({
            message : "session Not Found"
        })
        return
    }
    res.json({
        session : session
    })
}

export function updateSession(req,res){
LiveSession.findOneAndUpdate({
    sessionId : req.params.sessionId
}, req.body).then(
    (session) => {
        if(session == null){
            res.status(404).json({
                message: "Session not found"
            });
        }else{
            res.json({
                message: "Session updated successfully",
            });
        }
    }
).catch(
    (error) => {
        res.status(500).json({
            message: "Error Session product",
        });
    }
)
};
