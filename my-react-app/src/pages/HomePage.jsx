import AboutUs from '../Components/AboutUs'
import Header from '../Components/Header'
import HeroSection from '../Components/HeroSection'
import Products from '../Components/Products'

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
    </div>
  )
}

export default HomePage
