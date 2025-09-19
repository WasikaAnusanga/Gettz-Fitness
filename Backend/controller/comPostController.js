import comPost from "../model/communityPost.js";
import User from "../model/user.js";

// ✅ View all posts with user info
export function viewPosts(req, res) {
  comPost.find()
    .populate("postBy", "firstName lastName _id") // include user id
    .then((posts) => res.json(posts))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Post Not Found" });
    });
}

// ✅ Add post
export function addPost(req, res) {
  if (!req.user) {
    return res.status(403).json({ message: "Please login to add a post" });
  }

  if (req.user.role !== "member" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only members can add posts" });
  }

  const post = new comPost({
    title: req.body.title,
    content: req.body.content,
    imageURL: req.body.imageURL,
    postBy: req.user._id,
  });

  post.save()
    .then(() => res.json({ message: "Post Saved Successfully" }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Post not saved!" });
    });
}

// ✅ Delete post (only owner or admin)
export async function deletePost(req, res) {
  try {
    const post = await comPost.findOne({ postID: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.postBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await comPost.findOneAndDelete({ postID: req.params.id });
    res.json({ message: "Post Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Post not deleted!" });
  }
}

// ✅ Update post (only owner or admin)
export async function updatePost(req, res) {
  try {
    const post = await comPost.findOne({ postID: req.params.id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (String(post.postBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    const updated = await comPost.findOneAndUpdate(
      { postID: req.params.id },
      req.body,
      { new: true }
    );

    res.json({ message: "Post updated Successfully", post: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Post not updated!" });
  }
}




// import comPost from "../model/communityPost.js";

// export function viewPosts(req, res){

//     comPost.find()
//         .populate("postBy", "firstName lastName _id") // include _id
//         .then(
//             posts => res.json(posts)
//         ).catch(
//             err => res.status(500).json(
//                 { message: "Post Not Found" }
//             )
//         );
// }

// export function addPost(req, res){
//     if(req.user == null){
//         return res.status(403).json({ message: "Please login to add a post" });
//     }

//     if(req.user.role !== "member" && req.user.role !== "admin"){
//         return res.status(403).json({ message: "Only members can add posts" });
//     }

//     const post = new comPost({
//         title: req.body.title,
//         content: req.body.content,
//         imageURL: req.body.imageURL,
//         postBy: req.user._id
//     });

//     post.save()
//         .then(() => res.json({ message: "Post Saved Successfully" }))
//         .catch((err) => {
//             console.error(err);
//             res.status(500).json({ message: "Post not saved!" });
//         });
// }


// export function deletePost(req, res){
//     comPost.findOneAndDelete({postID : req.params.id}).then(
//         () => {
//             res.json({
//                 message : "Post Deleted Successfully"
//             })
//         }
//     ).catch(
//         (err) => {
//             console.log(err)
//             res.status(500).json({
//                 message : "Post not deleted!"
//             })
//         }
//     )
// }

// export function updatePost(req,res){
//     comPost.findOneAndUpdate({postID : req.params.id}, req.body).then(
//         (post) => {
//             res.json({
//                 message : "Post updated Successfully",
//                 post
//             })
//         }
//     ).catch(
//         (err) => {
//             console.log(err)
//             res.status(500).json({
//                 message : "Post not updated!"
//             })
//         }
//     )
// }