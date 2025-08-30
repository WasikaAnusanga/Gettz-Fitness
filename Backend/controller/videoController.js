import Video from "../model/Video_Portal.js";

export async function uploadVideo(req,res){
    if(req.user== null){
        res.status(403).json({
            message:"You need logging first to upload video"
        })
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not allowed to upload Video"
        })
        return;
    }
    const video = new Video(req.body)
    try{
        await video.save();
        res.status(201).json({
            message:"Video Upload Sucessfully"
        });
    }catch(err){
        res.status(500).json({
            message:"Error "
        })
    }
}
export function getAllvideo(req,res){
    Video.find().then(
        (videos)=>{
            res.json(videos)
        }
    ).catch((err)=>{
        res.status(500).json({
            message:"Error fetch video"
        });
    })
}
export function updateVideo(req,res){
    Video.findOneAndUpdate({
        videoId : req.params.videoId
    },req.body).then(
        (video)=>{
            if(video== null){
                res.status(404).json({
                    message:"Video not found"
                });
            }else{
                res.json({
                    message:"Video Updated Sucessfully"
                });
            }

        }
    ).catch((err)=>{
        res.status(500).json({
            message:"Error updated video"
        });
    })
}
export function deleteVideo(req,res){
    if(req.user == null){
        res.status(403).json({
            message: "You need logging first to delete a product"
        })
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not allowed to delete a product"
        })
        return;
    }
    Video.findOneAndDelete({
        videoId : req.params.videoId
    }).then(
        (video) => {
            if(video == null){
                res.status(404).json({
                    message: "Video  not found"
                });
            }else{
                res.json({
                    message: "Video deleted successfully",
                });
            }
        }
    ).catch(
        (error) => {
            res.status(500).json({
                message: "Error deleting ",
            });
        }
    );
}
export async function getVideoById(req,res){
    const videoId = req.params.id;
    const video = await Video.findOne({videoId : videoId})

    if(video == null){
        res.status(404).json({
            message : "Video Not Found"
        })
        return
    }
    res.json({
        video : video
    })
}

