import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <>
      <nav>
        {/* logo goes here */}
        <div className="nav-left">
          {/* <img src="" alt="Logo " /> */}
        </div>
        <div className="nav-right">
          <ul>
            <a href="#">
              <li>Home</li>
            </a>
            <a href="#">
              <li>About Us</li>
            </a>
            <a href="#">
              <li>Products</li>
            </a>
            <a href="#">
              <li>Collections</li>
            </a>
            <a href="#">
              <li>Contact Us</li>
            </a>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
