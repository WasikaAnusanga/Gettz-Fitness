import axios from "axios"
import { useState,useEffect } from "react"
import { IoAddCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import Lorder from "../../components/lorder-animate";

export default function AdminProductPage(){

    const [products,setProducts] = useState([])
    const [loaded ,setLoaded] = useState(false)
    const navigate = useNavigate();



    useEffect(
        ()=>{
            if(!loaded){
                axios.get(import.meta.env.VITE_BACKEND_URL+"/api/product").then(
                    (response)=>{
                        console.log(response.data)
                        setProducts(response.data)
                        setLoaded(true)
                    }
                )      

        }
            
        },
        [loaded]
    )
    async function deleteProduct(id){
        const token = localStorage.getItem("token");
        if(token == null){
            toast.error("error")
            return
        }
        try{
            await axios.delete(import.meta.env.VITE_BACKEND_URL+"/api/product/" +id ,{
            headers:{
                Authorization: "Bearer "+token
            }
        })
        toast.success("Product deleted sucessfully..")
        setLoaded(false)

        }catch(error){

            console.log(error);
            toast.error("Error deleting Products")
            return

        }
        
    }

    
    return(
        <div className="w-full h-full bg-gray-400 rounded-lg relative ">
        <Link to={"/admin/addProduct"} className="text-green-500 bg-gray-100 p-[12px] text-2xl rounded-full cursor-pointer hover:bg-gray-300 absolute right-5 bottom-5 animate-pulse">
             <IoAddCircleOutline/> 
        </Link>
          
        {loaded&&<table className="w-full bg-green-120 rounded-lg">
        <thead>
            <tr>
            <th className="p-2">No</th>
            <th className="p-2">Product Id</th>
            <th className="p-2">Product Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Action</th>
            </tr>
        </thead>
        <tbody >
            {
            products.map((product, index) => (
                <tr key={index} className="border-b-2 border-white text-center cursor-pointer hover:bg-gray-600 hover:text-white">
                <td className="p-2">{index+1}</td>
                <td className="p-2">{product.productId}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.price}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">
                    <div className="w-full h-full flex justify-center">
                        <RiDeleteBinLine className="text-red-600 text-[25px] m-3 hover:text-red-800" onClick={()=>{
                            deleteProduct(product.productId) 
                        }}/>
                        <FaRegEdit className="text-green-600 text-[25px] m-3 hover:text-green-800" onClick={()=>{
                            navigate("/admin/editProduct", {
                                state:product
                            })
                        }}/>
                    </div>
                </td>
                </tr>
            ))
            }
        </tbody>
        </table>}
        {
            !loaded&& <Lorder/>
                
        }

        </div>
        
    )
}