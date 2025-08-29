import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productView";
import HomeFooter from "../components/homeFooter"

export default function Homepage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<h1 className="p-6 text-2xl font-bold">Home Page</h1>} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/*" element={<h1 className="p-6 text-xl text-red-600">404 Not Found</h1>} />
        </Routes>
      </div>
      <HomeFooter/>
    </div>
  );
}
