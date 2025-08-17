import { useState } from "react";
import axios from "axios";
import { Toaster } from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage(){

        const [email,setEmail] = useState("");
        const [password, setPassword]= useState("");
        const [loading, setLoading ] = useState(false)
        const navigate = useNavigate();

    function handleLoging(){

        setLoading(true)

        console.log("Email : ",email);
        console.log("Password : ",password);

        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/user/login",{
            email : email,
            password : password
        }).then((response) => {

        if (response.data.message === "Login successful") {
        
        console.log("Loging Success ", response.data);
        toast.success("Login Success");
        localStorage.setItem("token",response.data.token)
            
        const user = response.data.user;
        if(user.role === "admin"){

            navigate("/admin")

        }else{
            navigate("/")
        }
        setLoading(false)
    } 
    else {

        toast.error(response.data.message || "Login Failed");
    }
})


        console.log("Loging button click")
    }
    return(
        <div className="w-full h-screen bg-amber-300 bg-cover bg-center flex">
            <div className=" w-[50%] h-full flex items-center justify-center">
                <h1 className="text-green-500 text-2xl animate-bounce">Welcome..........</h1>
            </div>
            <div className=" w-[50%] h-full flex justify-center items-center">
                <div className="w-[450px] h-[600px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center">
                    <input type="email" placeholder="Email" className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]" onChange={(e)=>{setEmail(e.target.value)}}/>
                    <input type="password" placeholder="password" className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]" onChange={(e)=>{setPassword(e.target.value)}}/>
                    <button className="w-[400px] h-[50px] bg-green-400 text-white rounded-xl cursor-pointer"onClick={handleLoging}>Log In
                        {loading?"Loading...":"Loging"}
                    </button>
                    <p className="text-blue-400 m-2">
                        Don't have an account yet? &nbsp;
                        <span className="text-green-500 cursor-pointer hover:text-green-700">
                           <Link to={"/register"}>Register Now</Link> 
                        </span>

                    </p>
                </div>

            </div>

        </div>
    )
}