import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productView";

export default function Homepage(){



    return(
        <div className="w-full h-screen max-h-screen">
            <Header/>
            <div className="w-full h-[calc(100vh-70px)] min-h-[calc(100vh-70px)] ">
                <Routes path="/*">
                
                    <Route path="/" element={<h1>Home Page</h1>}/>
                    <Route path="/products" element={<ProductPage/>}/>
                    <Route path="/*" element={<h1>404 Not Found</h1>}/>
                    <Route path="/overview/:id" element={<ProductOverview/>} />
                    
                
                </Routes>
                
            </div>

        </div>
    )
}