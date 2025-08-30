import { Link } from "react-router-dom";

export default function ProductCart(props){
    
    const product = props.product;
    return (
        <Link to={"/overview/"+product.productId}className="w-[250px] h-[350px]  shadow-2xl m-4 ">

            <img className="w-full h-[220px] object-cover" src={product.image[0]}/>
            <div className="w-full h-[110px] flex jestify-center flex-col px-4">
                <span className="text-gray-400">{product.productId}</span>
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-lg text-pink-600">{product.price.toFixed(2)} <span className="line-through text-sm text-gray-600">{product.price<product.labelPrice&&product.labelPrice.toFixed(2)}</span></p>
            </div>
            
        </Link>
       

    )
}