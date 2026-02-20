import React from "react";
import "../styles/Products.css";

const Products = () => {
  return (
    <div>
      <div className="product-container">
        <div className="product-header">
          <img src="./src/assets/products/product-title-left.png" alt="" />
          <h1>Our Products</h1>
          <img src="./src/assets/products/product-title-right.png" alt="" />
        </div>
        <div className="product-img-container">
          <div className="images">
            <img src="./src/assets/products/img1.png" alt="" />
            <h3>Earrings</h3>
          </div>
          <div className="images">
            <img src="./src/assets/products/img2.png" alt="" />
            <h3>Rings</h3>
          </div>
          <div className="images">
            <img src="./src/assets/products/img3.png" alt="" />
            <h3>Necklaces</h3>
          </div>
          <div className="images">
            <img src="./src/assets/products/img4.png" alt="" />
            <h3>Mangalsutra</h3>
          </div>
          <div className="images">
            <img src="./src/assets/products/img5.png" alt="" />
            <h3>Bangles</h3>
          </div>
          <div className="images">
            <img src="./src/assets/products/img6.png" alt="" />
            <h3>Pendants</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
