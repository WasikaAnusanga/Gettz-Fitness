import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import meadiaUpload from "../../utils/mediaUpload";

export default function EditProductForm(){

    const locationData = useLocation();
    console.log(locationData);

    if(locationData.state == null){
        toast.error("Please select a product to edit")
        window.location.href = "/admin/product"
    }

    const[productId,setProductId] = useState(locationData.state.productId);
    const[name,setProdutName] = useState(locationData.state.name);
    const[altName,setProductAltName] = useState(locationData.state.altName.join(","));
    const[price,setProductPrice] = useState(locationData.state.price);
    const[labelPrice,setProductLabelPrice] = useState(locationData.state.labelPrice);
    const[description,setproductDescription] = useState(locationData.state.description);
    const[stock,setProductStock] = useState(locationData.state.stock);
    const[image,setImages] = useState([]);

    const navigate = useNavigate();

    async function handleSubmit(){



        const promisesArr = []
        for(let i=0;i<image.length;i++){
            const promise = meadiaUpload(image[i])
            promisesArr[i] = promise
        }
        try{

        let result = await Promise.all(promisesArr);

        if(image.length == 0){
            result = locationData.state.image
        }
        console.log(result)

        const altNamesArr = altName.split(",")
        const product ={
            productId : productId,
            name : name,
            altName : altName,
            price : price,
            labelPrice : labelPrice,
            description : description,
            stock : stock,
            image : result


        }
        const token = localStorage.getItem("token")
        console.log(token)
        console.log(product)

        await axios.put(import.meta.env.VITE_BACKEND_URL+"/api/product/"+productId,product,{
            headers: {
                "Authorization" : "Bearer "+token
            }
        })
        toast.success("Product updated sucessfully");
        navigate("/admin/product");

        
        }
        catch (error) {
            toast.error("An error occurred while editting the product.");
            console.error(error);
        }
    }
    return(

        <div className="w-full h-full rounded-lg  flex justify-center items-center">

            <div className="w-[400px] h-[600px] rounded-lg shadow-lg flex flex-col items-center top-4">
                <h1>Update Product </h1>

                <input className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product ID" value={productId} onChange={(e)=>{setProductId(e.target.value)}} disabled/>
                <input className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product Name" value={name} onChange={(e)=>{setProdutName(e.target.value)}}/>
                <input className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product Alt Name" value={altName} onChange={(e)=>{setProductAltName(e.target.value)}}/>
                <input type="number" className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product Price" value={price} onChange={(e)=>{setProductPrice(e.target.value)}}/>
                <input type="number" className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product Label Price" value={labelPrice} onChange={(e)=>{setProductLabelPrice(e.target.value)}}/>
                <textarea className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product Description" value={description} onChange={(e)=>{setproductDescription(e.target.value)}}/>
                <input 
                type="file"
                onChange={(e)=>{
                    setImages(e.target.files)
                }}
                multiple
                className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]"/>
                <input type="number" className="w-[400px] h-[50px] border border-gray-600 rounded-lg text-center m-[5px]" placeholder="Product Stock" value={stock} onChange={(e)=>{setProductStock(e.target.value)}}/>

            <div className="w-[400px] h-[100px] flex justify-between items-center rounded-lg">
                <Link to={"/admin/product"} className="w-[180px] text-center bg-red-500 text-white p-2 m-[5px] rounded-lg hover:bg-red-800"> Cancel</Link>
                <button onClick={handleSubmit} className="bg-green-500 cursor-pointer text-white p-[10px] w-[180px] text-center rounded-lg hover:bg-green-800">Update Product</button>
            </div>

            </div>


        </div>
    )
    
}