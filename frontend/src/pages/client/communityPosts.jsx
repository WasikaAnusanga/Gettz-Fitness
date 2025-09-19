import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import meadiaUpload from "../../utils/mediaUpload";

const API = "http://localhost:3000/api/comfeed";

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });
  const [menuOpen, setMenuOpen] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [search, setSearch] = useState("");
  const [likes, setLikes] = useState({}); // Track likes per post (local only)

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // saved during login

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // Load posts
  const loadPosts = async () => {
    try {
      const res = await axios.get(`${API}/`, authHeader);
      setPosts(res.data.reverse());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Add or Update post
  const savePost = async () => {
    try {
      let imageUrl = editPost?.imageURL || "";
      if (newPost.image) {
        toast.loading("Uploading image...", { id: "upload" });
        imageUrl = await meadiaUpload(newPost.image);
        toast.dismiss("upload");
      }

      const body = {
        title: newPost.title,
        content: newPost.content,
        imageURL: imageUrl,
      };

      if (editPost) {
        await axios.post(`${API}/updatepost/${editPost.postID}`, body, authHeader);
        toast.success("Post updated ✅", { id: "action" });
      } else {
        await axios.post(`${API}/addpost`, body, authHeader);
        toast.success("Post created 🎉", { id: "action" });
      }

      setNewPost({ title: "", content: "", image: null });
      setEditPost(null);
      setShowForm(false);
      loadPosts();
    } catch (err) {
      console.error(err);
      toast.error("Save failed", { id: "action" });
    }
  };

  // Delete post
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API}/deletepost/${id}`, authHeader);
      toast.success("Post deleted ✅", { id: "action" });
      loadPosts();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed", { id: "action" });
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <img src="/src/assets/GymLogo.jpg" alt="logo" className="h-10 w-10 rounded-full shadow" />
            <h1 className="text-3xl font-extrabold text-red-600 tracking-tight drop-shadow">Community Feed</h1>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditPost(null);
              setNewPost({ title: "", content: "", image: null });
            }}
            className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 font-semibold text-white shadow-lg hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-transform duration-150"
          >
            <span className="text-lg">➕</span> <span className="ml-1">New Post</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full max-w-md rounded-full border border-gray-300 px-5 py-2 text-lg shadow focus:ring-2 focus:ring-red-400 focus:outline-none transition"
          />
        </div>
        {/* Modal for New / Update Post */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl border border-gray-200 animate-fadeIn">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 text-center">
                {editPost ? "Update Post" : "Create a Post"}
              </h2>
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="mb-3 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-red-500 text-lg"
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="mb-3 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-red-500 text-base min-h-[100px]"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
                className="mb-4 w-full text-sm text-gray-600"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-base font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={savePost}
                  className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 text-base font-semibold text-white shadow hover:from-red-600 hover:to-pink-600"
                >
                  {editPost ? "Update" : "Post"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (posts.filter(p =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.content.toLowerCase().includes(search.toLowerCase())
          ).length === 0 ? (
            <div className="text-center text-gray-400 text-lg py-16">
              <img src="/src/assets/GymLogo.jpg" alt="empty" className="mx-auto h-16 w-16 opacity-40 mb-4" />
              <div>No posts found.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-8 max-w-2xl mx-auto">
              {posts.filter(p =>
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.content.toLowerCase().includes(search.toLowerCase())
              ).map((p) => (
                <article
                  key={p.postID}
                  className="relative rounded-xl border border-gray-200 bg-white p-5 shadow hover:shadow-lg transition-all duration-200 group overflow-hidden"
                  style={{ boxShadow: '0 2px 8px 0 rgba(60,60,60,0.07)' }}
                >
                  {/* User row */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.postBy?.profilePicture ? p.postBy.profilePicture : "/src/assets/GymLogo.jpg"}
                        alt="avatar"
                        className="h-11 w-11 rounded-full border-2 border-gray-200 shadow object-cover bg-white"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base">
                          {p.postBy?.firstName || "Member"} {p.postBy?.lastName || ""}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}
                        </span>
                      </div>
                    </div>

                    {/* 3-dots menu only if owner */}
                    {p.postBy && String(p.postBy._id) === String(userId) && (
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === p.postID ? null : p.postID)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <span className="text-2xl">⋮</span>
                        </button>

                        {menuOpen === p.postID && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border bg-white shadow-md z-50">
                            <button
                              onClick={() => {
                                setMenuOpen(null);
                                setEditPost(p);
                                setNewPost({
                                  title: p.title,
                                  content: p.content,
                                  image: null,
                                });
                                setShowForm(true);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                              ✏️ Update
                            </button>
                            <button
                              onClick={() => {
                                setMenuOpen(null);
                                deletePost(p.postID);
                              }}
                              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Title + content */}
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-150">
                    {p.title}
                  </h3>
                  <p className="mb-3 text-gray-800 text-base whitespace-pre-line">
                    {p.content}
                  </p>

                  {/* Image */}
                  {p.imageURL && (
                    <div className="mb-3 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                      <img
                        src={p.imageURL}
                        alt="post"
                        className="w-full max-h-96 object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-8 text-base text-gray-600 pt-2 border-t border-gray-100 mt-2">
                    <button
                      className={`flex items-center gap-2 font-medium transition px-2 py-1 rounded hover:bg-gray-100 ${likes[p.postID] ? 'text-red-600' : 'hover:text-red-600'}`}
                      onClick={() => setLikes(l => ({ ...l, [p.postID]: !l[p.postID] }))}
                    >
                      <span className="text-xl">{likes[p.postID] ? '❤️' : '🤍'}</span> Like
                    </button>
                    <button className="flex items-center gap-2 font-medium transition px-2 py-1 rounded hover:bg-gray-100 hover:text-pink-500">
                      <span className="text-xl">🔗</span> Share
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}








// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const CommunityFeed = () => {
//   const [posts, setPosts] = useState([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [editingPost, setEditingPost] = useState(null);
//   const [newPost, setNewPost] = useState({
//     title: '',
//     content: '',
//     imageURL: ''
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentUser] = useState({ id: 'user123', name: 'Current User' }); // Mock current user

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/comfeed');
//         setPosts(response.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Failed to load posts. Please check your connection.');
//         setIsLoading(false);
//         console.error('Error fetching posts:', err);
//         toast.error('Failed to load posts');
//       }
//     };

//     fetchPosts();
//   }, []);

//   // post creation
//   const handleCreatePost = async (e) => {
//     e.preventDefault();
//     const loadingToast = toast.loading('Creating post...');
    
//     try {
//       const response = await axios.post('http://localhost:3000/api/comfeed/addpost', {
//         ...newPost,
//         postDate: new Date().toISOString(),
//         postBy: currentUser.id
//       });
      
//       if (response.data.message === "Post Saved Successfully") {

//         // Refresh posts list
//         const postsResponse = await axios.get('http://localhost:3000/api/comfeed');
//         setPosts(postsResponse.data);
//         setNewPost({ title: '', content: '', imageURL: '' });
//         setShowCreateForm(false);
//         setError(null);
//         toast.success('Post created successfully!', { id: loadingToast });
//       }
//     } catch (err) {
//       setError('Failed to create post. Please check your connection.');
//       console.error('Error creating post:', err);
//       toast.error('Failed to create post', { id: loadingToast });
//     }
//   };

//   const handleUpdatePost = async (e) => {
//     e.preventDefault();
//     const loadingToast = toast.loading('Updating post...');
    
//     try {
//       const response = await axios.post(`http://localhost:3000/api/comfeed/updatepost/${editingPost.postID || editingPost._id}`, {
//         title: editingPost.title,
//         content: editingPost.content,
//         imageURL: editingPost.imageURL
//       });
      
//       if (response.data.message === "Post updated Successfully") {
//         const postsResponse = await axios.get('http://localhost:3000/api/comfeed');
//         setPosts(postsResponse.data);
//         setEditingPost(null);
//         setError(null);
//         toast.success('Post updated successfully!', { id: loadingToast });
//       }
//     } catch (err) {
//       setError('Failed to update post. Please check your connection.');
//       console.error('Error updating post:', err);
//       toast.error('Failed to update post', { id: loadingToast });
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       const loadingToast = toast.loading('Deleting post...');
      
//       try {
//         const response = await axios.delete(`http://localhost:3000/api/comfeed/deletepost/${postId}`);
        
//         if (response.data.message === "Post Deleted Successfully") {
//           const postsResponse = await axios.get('http://localhost:3000/api/comfeed');
//           setPosts(postsResponse.data);
//           setError(null);
//           toast.success('Post deleted successfully!', { id: loadingToast });
//         }
//       } catch (err) {
//         setError('Failed to delete post. Please check your connection.');
//         console.error('Error deleting post:', err);
//         toast.error('Failed to delete post', { id: loadingToast });
//       }
//     }
//   };

//   // Check if current user is the post author
//   const isPostAuthor = (post) => {
//     return post.postBy === currentUser.id || post.postBy?.name === currentUser.name;
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className={`max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen ${(showCreateForm || editingPost) ? 'blur-sm' : ''}`}>

//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-black mb-2">Community Feed</h1>
//           <p className="text-gray-600">Share your fitness journey and connect with others</p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
//             {error}
//           </div>
//         )}


//         <div className="mb-6 flex justify-center">
//           <button
//             onClick={() => setShowCreateForm(true)}
//             className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//             Create New Post
//           </button>
//         </div>

//         {/* Posts List */}
//         <div className="space-y-6">
//           {posts.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <h3 className="text-xl font-semibold text-black mb-2">No posts yet</h3>
//               <p className="text-gray-500">Be the first to share something with the community!</p>
//             </div>
//           ) : (
//             posts.map((post) => (
//               <div key={post.postID || post._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//                 {/* Post Header */}
//                 <div className="p-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-xl font-semibold text-black">{post.title}</h2>
//                     <span className="text-sm text-gray-500">{formatDate(post.postDate)}</span>
//                   </div>
//                   <div className="flex items-center justify-between mt-2">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
//                         {post.postBy?.name ? post.postBy.name.charAt(0).toUpperCase() : 'U'}
//                       </div>
//                       <span className="ml-2 text-gray-600">
//                         {post.postBy?.name || 'Unknown User'}
//                       </span>
//                     </div>
                    
//                     {/* Edit/Delete buttons for post author */}
//                     {isPostAuthor(post) && (
//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => setEditingPost(post)}
//                           className="text-gray-500 hover:text-red-600 transition duration-300"
//                           title="Edit post"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                         </button>
//                         <button 
//                           onClick={() => handleDeletePost(post.postID || post._id)}
//                           className="text-gray-500 hover:text-red-600 transition duration-300"
//                           title="Delete post"
//                         >
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Post Content */}
//                 <div className="p-4">
//                   <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
//                 </div>
                
//                 {/* Post Image */}
//                 {post.imageURL && (
//                   <div className="p-4 pt-0">
//                     <img 
//                       src={post.imageURL} 
//                       alt="Post" 
//                       className="rounded-lg max-h-96 w-full object-cover"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                       }}
//                     />
//                   </div>
//                 )}
                
//                 {/* Post Actions */}
//                 <div className="p-4 border-t border-gray-200 flex justify-between">
//                   <button className="flex items-center text-gray-600 hover:text-red-600 transition duration-300">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                     </svg>
//                     Like
//                   </button>
//                   <button className="flex items-center text-gray-600 hover:text-red-600 transition duration-300">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
//                     </svg>
//                     Share
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Create Post Modal - Outside the blurred content */}
//       {showCreateForm && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div 
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={() => setShowCreateForm(false)}
//           ></div>
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 relative z-50">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">Create a New Post</h2>
//               <button 
//                 onClick={() => setShowCreateForm(false)}
//                 className="text-gray-500 hover:text-black"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleCreatePost}>
//               <div className="mb-4">
//                 <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   value={newPost.title}
//                   onChange={(e) => setNewPost({...newPost, title: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                   placeholder="Enter post title"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
//                 <textarea
//                   id="content"
//                   value={newPost.content}
//                   onChange={(e) => setNewPost({...newPost, content: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                   rows="4"
//                   placeholder="Share your thoughts..."
//                   required
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="imageURL" className="block text-gray-700 font-medium mb-2">Image URL (Optional)</label>
//                 <input
//                   type="url"
//                   id="imageURL"
//                   value={newPost.imageURL}
//                   onChange={(e) => setNewPost({...newPost, imageURL: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateForm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
//                 >
//                   Post
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Post Modal - Outside the blurred content */}
//       {editingPost && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div 
//             className="absolute inset-0 bg-black bg-opacity-50"
//             onClick={() => setEditingPost(null)}
//           ></div>
//           <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 relative z-50">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-black">Edit Post</h2>
//               <button 
//                 onClick={() => setEditingPost(null)}
//                 className="text-gray-500 hover:text-black"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleUpdatePost}>
//               <div className="mb-4">
//                 <label htmlFor="edit-title" className="block text-gray-700 font-medium mb-2">Title</label>
//                 <input
//                   type="text"
//                   id="edit-title"
//                   value={editingPost.title}
//                   onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                   placeholder="Enter post title"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="edit-content" className="block text-gray-700 font-medium mb-2">Content</label>
//                 <textarea
//                   id="edit-content"
//                   value={editingPost.content}
//                   onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                   rows="4"
//                   placeholder="Share your thoughts..."
//                   required
//                 ></textarea>
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="edit-imageURL" className="block text-gray-700 font-medium mb-2">Image URL (Optional)</label>
//                 <input
//                   type="url"
//                   id="edit-imageURL"
//                   value={editingPost.imageURL}
//                   onChange={(e) => setEditingPost({...editingPost, imageURL: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setEditingPost(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
//                 >
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CommunityFeed;