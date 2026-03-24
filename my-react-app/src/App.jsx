import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MetalRatesPage from "./pages/MetalRatesPage";
import AboutPage from "./pages/Aboutpage";
import ProductsPage from "./pages/Productspage";
import ContactPage from "./pages/Contactpage";
import ProductDetails from "./Components/ProductDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/metal-rates" element={<MetalRatesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
