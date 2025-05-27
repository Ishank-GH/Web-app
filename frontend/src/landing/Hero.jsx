import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useMouseTracking, usePageTransition } from './useAnimation';
import "remixicon/fonts/remixicon.css";

const Hero = ({onSectionClick}) => {
  const mouseTracking = useMouseTracking(50);
  const titleTransition = usePageTransition(300);
  const contentTransition = usePageTransition(500);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const actionsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  
  useEffect(() => {
    // Animate title, description, and actions when component mounts
    gsap.fromTo(titleRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
    );
    
    gsap.fromTo(descriptionRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.4 }
    );
    
    gsap.fromTo(actionsRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.5 }
    );
    
    // continuous animation for blur shapes
    gsap.to(".bg-blur-shape", {
      keyframes: [
        { x: 0, y: 0, duration: 0 },  // Starting position
        { x: 50, y: -30, duration: 8, ease: "sine.inOut" },
        { x: -20, y: 40, duration: 8, ease: "sine.inOut" },
        { x: 30, y: 20, duration: 8, ease: "sine.inOut" },
        { x: 0, y: 0, duration: 8, ease: "sine.inOut" }  // Return to original position
      ],
      repeat: -1,
      stagger: {
        amount: 1.5,
        from: "random"
      }
    });

    // bouncing scroll indicator
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-gray-900">
      <div className="parallax-bg bg-gray-950/80"></div>
      <div className="gradient-bg-dark absolute inset-0 z-0"></div>

      {/* Background blur shapes */}
      <div className="fixed -top-64 -left-64 w-[500px] h-[500px] rounded-full bg-primary bg-blur-shape opacity-30"></div>
      <div className="fixed top-1/3 -right-32 w-[300px] h-[300px] rounded-full bg-primary bg-blur-shape opacity-30"></div>
      <div className="fixed -bottom-32 left-32 w-[250px] h-[250px] rounded-full bg-primary bg-blur-shape opacity-30"></div>
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2" ref={titleTransition.ref}>
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans leading-tight mb-6 text-white"
            >
              Where Knowledge Meets <span className="text-primary">Community</span>
            </h1>
            <p 
              ref={descriptionRef}
              className="text-lg md:text-xl text-gray-300/90 mb-8 max-w-lg"
            >
              Symmunity brings together the best of both worlds - structured Q&A and real-time community discussions. Join us to learn, share, and grow together.
            </p>
            
            <div 
              ref={actionsRef}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <a href="/signup" className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center shadow-lg shadow-primary/20">
                Get Started Free
              </a>
              <a onClick={() => onSectionClick('how-it-works')} className="px-8 py-3 border border-gray-600 rounded-lg text-white hover:bg-gray-800 transition-colors duration-500 text-center">
                See How It Works
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-12 lg:mt-0" ref={contentTransition.ref}>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/30 rounded-full animate-float"></div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
              
              <div 
                ref={mouseTracking.ref}
                style={mouseTracking.style}
                className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 relative z-10 transition-transform"
              >
                {/* Interface mockup */}
                <div className="flex bg-gray-900 p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                  </div>
                  
                  <div className="ml-auto flex items-center space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800">
                      <i className="fas fa-sun text-gray-300"></i>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white text-sm">
                      US
                    </div>
                    <button className="px-4 py-1 bg-red-500 text-white rounded-md text-sm shadow-md">
                      Logout
                    </button>
                  </div>
                </div>
                
                <div className="flex h-[300px] bg-gray-800">
                  {/* Left sidebar */}
                  <div className="w-1/4 border-r border-gray-700 p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-primary font-medium">
                        <i className="ri-home-line"></i>
                        <span>Home</span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-400 font-medium">
                        <i className="ri-message-3-line"></i>
                        <span>Messages</span>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-400 font-medium">
                        <i className="ri-question-line"></i>
                        <span>Questions</span>
                      </div>
                      
                      <div className="pt-4 mt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-gray-300">Your Communities</h3>
                          <button className="text-primary">
                            <i className="ri-add-line text-xs"></i>
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded bg-primary/80 flex items-center justify-center overflow-hidden">
                              <span className="text-white text-xs">WD</span>
                            </div>
                            <span className="text-sm text-gray-300">Web Design</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded bg-gray-500 flex items-center justify-center overflow-hidden">
                              <span className="text-gray-900 text-xs">UU</span>
                            </div>
                            <span className="text-sm text-gray-300">UI UX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="w-3/4 p-4">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-white">Trending Questions</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-b border-gray-700 pb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white text-sm">
                            US
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-sm text-gray-300">user1</span>
                              <span className="text-xs text-gray-500 ml-2">Feb 28, 2025</span>
                            </div>
                            <a href="#" className="text-primary hover:underline font-medium">How can I optimize performance in a large-scale React.Js application?</a>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                              <div className="flex items-center"><i className="ri-thumb-up-line mr-1"></i> 5</div>
                              <div className="flex items-center"><i className="ri-message-2-line mr-1"></i> 4</div>
                              <div className="flex items-center"><i className="ri-eye-line mr-1"></i> 265</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-b border-gray-700 pb-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white text-sm">
                            US
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="text-sm text-gray-300">user1</span>
                              <span className="text-xs text-gray-500 ml-2">Feb 20, 2025</span>
                            </div>
                            <a href="#" className="text-primary hover:underline font-medium">React</a>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-400">
                              <div className="flex items-center"><i className="ri-thumb-up-line mr-1"></i> 2</div>
                              <div className="flex items-center"><i className="ri-message-2-line mr-1"></i> 3</div>
                              <div className="flex items-center"><i className="ri-eye-line mr-1"></i> 38</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <a href="#" className="text-primary text-sm hover:underline flex items-center justify-end">
                        View all <i className="ri-arrow-right-s-line"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <i className="ri-arrow-down-s-line"></i>
      </div>
    </section>
  );
};

export default Hero;