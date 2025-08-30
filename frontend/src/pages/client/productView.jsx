import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Lorder from "../../components/lorder-animate";
import ImageSlider from "../../components/imageSlider";

export default function ProductOverview(){
    const params = useParams()
    console.log(params)
    if(params.id ==null){
        window.location.href = "/products"
    }

    const [product,setProduct] = useState(null)
    const [status,setStatus] = useState("loading") //loading,loaded.error

    useEffect (
        () =>{
            if(status == "loading"){
                axios.get(import.meta.env.VITE_BACKEND_URL+"/api/product/"+params.id).then(
                    (res) => {
                        console.log(res)
                        setProduct(res.data.product)
                        setStatus("loaded")

                    }
                ).catch(
                    ()=>{
                        toast.error("Product not found ")
                        setStatus("error")

                    }
                )
            }
        },[status]
    )
    return(
        <div className="w-full h-full">
            {
                status == "loading" &&<Lorder/>
            }
            {
                status =="loaded" && <div className="w-full h-full flex">
                    {console.log(product)  }
                    <div className="w-[50%] h-full ">
                        {console.log(product)}
                        <ImageSlider images={product.image}/>
                    </div>
                    <div className="w-[50%] h-full p-[40px] ">
                        <h1 className="text-3xl text-center font-bold mb-[40px]">{product.name}</h1>
                        <h2 className="text-gray-400 text-3xl font-semibold text-center mb-[30px]">{product.altName.join(" | ")}</h2>
                        <div className="w-full flex justify-center mb-[40px]">
                            {
                                product.labelPrice>product.price?
                                <>
                                    <h2 className="text-3xl text-center font-bold text-red-500 line-through w-full">LKR: {product.labelPrice.toFixed(2)}</h2>
                                    <h2 className="text-3xl text-center font-bold text-green-500 w-full">LKR: {product.price.toFixed(2)}</h2>
                                </>:
                                <h2 className="text-3xl text-center">{product.price.toFixed(2)}</h2>
                            }
                        </div>
                        <p className="text-gray-500 text-lg text-center mb-[40px]">{product.description}</p>

                        <div className="w-full flex justify-center items-center">
                        <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-800 transition duration-300 cursor-pointer">
                            Add to Cart
                        </button>
                        <button className="bg-pink-600 border border-pink-700 text-white px-6 py-2 rounded-lg hover:bg-white hover:text-pink-600 transition duration-300 ml-4 cursor-pointer">
                            Buy Now 
                        </button>
                    </div>

                    </div>
                    

                </div>
            }
            {
                status == "error" && <div> Error </div>
            }

        </div>
    )

}