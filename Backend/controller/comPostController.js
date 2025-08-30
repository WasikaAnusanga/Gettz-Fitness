import comPost from "../model/communityPost.js";

export function viewPosts(req, res){

    comPost.find().then(
        (post) => {
            res.json(post)
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).json({
                message : "Post Not Found"
            })
        }
    )
}

export function addPost(req, res){
    const post = new comPost(req.body)

    post.save().then(
        ()=>{
            res.json({
                message : "Post Saved Successfully"
            })
        }
    ).catch(
        (err)=>{
            console.log(err)
            res.status(500).json({
                message : "Post not saved!"
            })
        }
    )
}

export function deletePost(req, res){
    comPost.findOneAndDelete({postID : req.params.id}).then(
        () => {
            res.json({
                message : "Post Deleted Successfully"
            })
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).json({
                message : "Post not deleted!"
            })
        }
    )
}

export function updatePost(req,res){
    comPost.findOneAndUpdate({postID : req.params.id}, req.body).then(
        (post) => {
            res.json({
                message : "Post updated Successfully",
                post
            })
        }
    ).catch(
        (err) => {
            console.log(err)
            res.status(500).json({
                message : "Post not updated!"
            })
        }
    )
}