import { useState, useCallback } from "react";

import AboutUs from "../Components/AboutUs";
import Collection from "../Components/Collection";
import CustomCursor from "../Components/Customcursor";
import Footer from "../Components/Footer";
import GoldDivider from "../Components/Golddivider";
import Header from "../Components/Header";
import HeroSection from "../Components/HeroSection";
import Products from "../Components/Products";
import Loader from "../Components/Loader";
import MetalRatesPage from "./MetalRatesPage";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  const handleLoaderDone = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      {/* Custom Cursor — always mounted */}
      <CustomCursor />

      {/* Loader — unmounts when done, triggering fresh mount of main content */}
      {loading && <Loader onComplete={handleLoaderDone} />}

      {/* Main content — only mounts after loader finishes so animations start fresh */}
      {!loading && (
        <div>
          <Header />
          <HeroSection />
          <AboutUs />
          <Products />
          <Collection />
          <GoldDivider />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default HomePage;
