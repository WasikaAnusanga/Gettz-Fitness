import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const user = response.data.user;
        if(user.role === "Mmeber"){

            navigate("/member/dashboard")

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
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-red-600 relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-transparent"></div>
        <img
          src="https://images.unsplash.com/photo-1554344728-7560c38c1720?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Gym Equipment"
          className="object-cover w-full h-full"
        />
      </div>
      <div className=" w-[50%] h-full flex justify-center items-center">
                <div className="w-[600px] h-[700px]  shadow-xl rounded-xl flex flex-col justify-center items-center">
                    Email :- 
                    <input type="email" placeholder="Email" className="w-[400px] h-[50px] border border-black rounded-xl text-center m-[5px]" onChange={(e)=>{setEmail(e.target.value)}}/>
                    <h4 className="items-left">Password:- </h4>
                    <input type="password" placeholder="password" className="w-[400px] h-[50px] border border-black rounded-xl text-center m-[5px]" onChange={(e)=>{setPassword(e.target.value)}}/>
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