import React from "react";
import "../styles/Collection.css";
const Collection = () => {
  return (
    <div>
      <div className="collection-container">
        <div className="collection-header">
          <img src="./src/assets/products/product-title-left.png" alt="" />
          <h1>Our Collections</h1>
          <img src="./src/assets/products/product-title-right.png" alt="" />
        </div>
        <div className="collection-img-container">
          <div className="collection-images">
            <div className="outer">
              <div className="inner">
                <img src="./src/assets/collections/img1.png" alt="" />
              </div>
            </div>
          </div>
          <div className="collection-images">
            <div className="outer">
              <div className="inner">
                <img src="./src/assets/collections/img2.png" alt="" />
              </div>
            </div>
          </div>
          <div className="collection-images">
            <div className="outer">
              <div className="inner">
                <img src="./src/assets/collections/img3.png" alt="" />
              </div>
            </div>
          </div>
          <div className="collection-images">
            <div className="outer">
              <div className="inner">
                <img src="./src/assets/collections/img4.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );    
};

export default Collection;
