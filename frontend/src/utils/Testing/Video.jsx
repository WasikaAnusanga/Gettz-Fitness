import axios from 'axios';
import Loader from '../../components/lorder-animate';
import { useState,useEffect } from "react";
import toast from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

export default function VideoDetailsPage(){
    const [video,setVideo] = useState([]);
    const[loaded,setLoaded] = useState(false)
    const [showUpload, setShowUpload] = useState(false); 
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!loaded){
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/video").then(
                (response)=>{
                    console.log(response.data)
                    setVideo(response.data)
                    setLoaded(true)
                }
            )
        }
    }, [loaded])
    async function deleteVideo(id){
        const token = localStorage.getItem("token")
        if(token==null){
            toast.error("You must be logged in to delete a video")
            return;
        }
        try{
            await axios.delete(import.meta.env.VITE_BACKEND_URL+"/api/video/delete/"+id,{
                headers:{
                    Authorization: "Bearer "+token
                }
                })
                toast.success("Video deleted successfully")
                setLoaded(false)
        }catch(error){
            console.log(error)
            toast.error("Failed to delete video")
            return;
        }
    }
    return(
        <div className= "w-full h-full bg-gray rounded-lg relative">
            
            <button
                onClick={() => setShowUpload(true)}
                className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
                Upload Video
            </button>

           
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg">
                        <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                        <VideoUpload />
                    </div>
                </div>
            )}

            {loaded&&<table className='w-full bg-amber-300 rounded-lg'>
            <thead>
                <tr>
                    <th  className='p-2'>No</th>
                    <th  className='p-2'>Video ID</th>
                    <th  className='p-2'>Tittle</th>
                    <th  className='p-2'>Duration</th>
                    <th  className='p-2'>View Count</th>
                    <th  className='p-2'>Like Count</th>
                    <th  className='p-2'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    video.map((vid,index)=>(
                        <tr key={index}className='border-t border-gray-300'>
                            <td className='p-2 text-center'>{index+1}</td>
                            <td className='p-2 text-center'>{vid.videoId}</td>
                            <td className='p-2 text-center'>{vid.title}</td>
                            <td className='p-2 text-center'>{vid.duration} sec</td>
                            <td className='p-2 text-center'>{vid.viewCount}</td>
                            <td className='p-2 text-center'>{vid.likeCount}</td>
                            <td className='p-2 text-center'>
                                <button onClick={()=>{navigate("/Testing/videoEdit/"+vid.videoId)}} className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-300 mr-2'>Edit</button>
                                <button onClick={()=>{deleteVideo(vid.videoId)}} className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300'>Delete</button>
                            </td>
                        </tr>
                    ))
                }
          
            </tbody>
          </table>}
          {
            !loaded&&<Loader/>
          }
        
        </div>
    )

}