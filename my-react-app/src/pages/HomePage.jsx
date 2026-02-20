import AboutUs from "../Components/AboutUs";
import Collection from "../Components/Collection";
import Header from "../Components/Header";
import HeroSection from "../Components/HeroSection";
import Products from "../Components/Products";

const HomePage = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* About Us */}
      <AboutUs />

      {/* Products */}
      <Products />

      {/* Collections */}
      <Collection />
    </div>
  );
};

export default HomePage;
