import { Link, Route, Routes } from "react-router-dom";
import { FaUsers } from "react-icons/fa6";
import { IoStorefrontSharp } from "react-icons/io5";
import { RiBillFill } from "react-icons/ri";
import AdminProductPage from "./admin/product";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";

export default function AdminPage(){
    return(
        <div className="w-full h-screen bg-gray-300 flex justify-center items-center p-2">
            <div className="w-[300px] h-full p-3">
            
            <Link to="/admin/users" className=" text-blue-600 hover:underline flex items-center "><FaUsers className="mr-4"/>Users</Link>
            <Link to="/admin/product" className=" text-blue-600 hover:underline flex items-center "><IoStorefrontSharp className="mr-4"/>Product</Link>
            <Link to="/admin/orders" className=" text-blue-600 hover:underline flex items-center "><RiBillFill className="mr-4"/>Orders</Link>
            </div>
            <div className="h-full bg-white w-[calc(100vw-300px)] rounded-lg">
                <Routes path ="/*">

                    <Route path="/users" element={<h1>Users</h1>} />
                    <Route path="/product" element={<AdminProductPage />} />
                    <Route path="/orders" element={<h1>orders</h1>} />
                    <Route path="/addProduct" element={<AddProductForm />} />
                    <Route path="/editProduct" element={<EditProductForm/>} />


                </Routes>
            </div>
            
        </div>
    )
}