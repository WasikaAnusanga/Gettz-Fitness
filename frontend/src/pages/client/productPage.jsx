import axios from "axios"
import { useEffect, useState } from "react"
import Lorder from "../../components/lorder-animate"
import ProductCart from "../../components/product-cart"

export default function ProductPage(){

    const[productList,setProductList] = useState([])
    const[productLoaded,setProductLoaded] = useState(false)

    useEffect(
        () =>{

            if(!productLoaded){

            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/product").then(
                (res)=>{
                    console.log(res)
                    setProductList(res.data)
                    setProductLoaded(true)

                }
            )
        }
        },[productLoaded]
    )
    return(
        <div className="w-full h-full">

            {
                productLoaded?
                <div className="w-full h-full flex flex-wrap justify-center">

                    {
                        productList.map(
                            (product,index)=>{
                                return(
                                    <ProductCart key={product.productId} product={product} />

                                )
                            }
                        )
                    }



                </div>
                :<Lorder/>


            }

        </div>
    )
}