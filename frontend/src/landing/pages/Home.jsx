import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Hero from '../Hero';
import Features from '../Features';
import HowItWorks from '../HowItWorks';
import Community from '../Community';

const Home = ({ isLoading }) => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar onSectionClick={scrollToSection} />
      <main className="overflow-hidden">
        <Hero onSectionClick={scrollToSection} />
        <Features />
        <HowItWorks />
        <Community />
      </main>
    </div>
  );
};

export default Home;