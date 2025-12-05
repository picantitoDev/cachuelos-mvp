import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Categories from "./components/Categories";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import VideoPromo from "./components/VideoPromo";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <VideoPromo />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <Footer />
    </div>
  );
}