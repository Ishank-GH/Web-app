import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import "remixicon/fonts/remixicon.css";

const Navbar = ({ onSectionClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.1 }
    );
  }, []);

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-lg z-50 border-b border-gray-800 shadow-lg"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center transition-all duration-300">
              <img 
                src="/symmunity-bg_1.png" 
                alt="" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-white text-3xl font-bold ml-2">
                Symmun<span className="relative">i<span className="absolute top-[-15.5px] right-[0.1px] text-primary text-3xl">.</span></span>ty
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-6 items-center">
            <button 
              onClick={() => onSectionClick('features')} 
              className="nav-item relative text-gray-300 hover:text-white transition-all duration-300 group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10">Features</span>
              <span className="absolute inset-0 bg-gray-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              <span className="absolute right-0 bottom-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></span>
              <span className="absolute top-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              <span className="absolute left-0 top-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => onSectionClick('how-it-works')} 
              className="nav-item relative text-gray-300 hover:text-white transition-all duration-300 group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10">How It Works</span>
              <span className="absolute inset-0 bg-gray-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              <span className="absolute right-0 bottom-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></span>
              <span className="absolute top-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              <span className="absolute left-0 top-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => onSectionClick('community')} 
              className="nav-item relative text-gray-300 hover:text-white transition-all duration-300 group px-4 py-2 rounded-xl"
            >
              <span className="relative z-10">Community</span>
              <span className="absolute inset-0 bg-gray-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              <span className="absolute right-0 bottom-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></span>
              <span className="absolute top-0 right-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              <span className="absolute left-0 top-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-300"></span>
            </button>
          </div>
          
          <div className="flex space-x-4 items-center">
            <Link to="/login" className="hidden md:block px-5 py-2 border border-primary/50 text-white rounded-lg hover:bg-primary/10 transition-all duration-300 hover:border-primary hover:shadow-md hover:shadow-primary/10">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 bg-primary text-white rounded-lg relative overflow-hidden group shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
              <span className="relative z-10">Sign Up</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <button 
              className="md:hidden text-gray-300 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={`ri-${isMobileMenuOpen ? 'close-line' : 'menu-line'} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden mt-4 py-4 border-t border-gray-800"
            ref={el => {
              if (el && isMobileMenuOpen) {
                gsap.fromTo(el, 
                  { opacity: 0, height: 0 }, 
                  { opacity: 1, height: 'auto', duration: 0.3 }
                );
              }
            }}
          >
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => onSectionClick('features')} 
                className="text-gray-300 hover:text-white transition-all duration-300 pl-3 py-3 border-l-2 border-transparent hover:border-primary hover:bg-gray-800 rounded-r-md"
              >
                Features
              </button>
              <button 
                onClick={() => onSectionClick('how-it-works')} 
                className="text-gray-300 hover:text-white transition-all duration-300 pl-3 py-3 border-l-2 border-transparent hover:border-primary hover:bg-gray-800 rounded-r-md"
              >
                How It Works
              </button>
              <button 
                onClick={() => onSectionClick('community')} 
                className="text-gray-300 hover:text-white transition-all duration-300 pl-3 py-3 border-l-2 border-transparent hover:border-primary hover:bg-gray-800 rounded-r-md"
              >
                Community
              </button>
              <Link to="/login" className="text-gray-300 hover:text-white transition-all duration-300 pl-3 py-3 border-l-2 border-transparent hover:border-primary hover:bg-gray-800 rounded-r-md">
                Log In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;