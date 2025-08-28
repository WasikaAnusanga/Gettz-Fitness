import { createClient } from "@supabase/supabase-js"
import { useState } from "react"
import toast from "react-hot-toast"
import meadiaUpload from "../utils/mediaUpload"


export default function Testing(){

    const [file, setFile] = useState(null)
    
    function handleUpload(){

        meadiaUpload(file).then(
            (url)=>{
                console.log(url)
                toast.success("File Upload Sucess")
            }
        ).catch(
            (error)=>{
                console.log(error);
                toast.error("Filed Upload Failed")
            }
        )

    }



    return(
        <div className="w-full h-screen bg-gray-600 flex flex-col justify-center items-center "> 
            
            <input type="file" onChange={(e)=>{
                setFile(e.target.files[0])
            }}/>

        <button onClick={handleUpload} className="w-[150px] cursor-pointer text-white bg-red-600">Submit</button>

        </div>
    )
}