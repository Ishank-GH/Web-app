import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from './useAnimation';
import "remixicon/fonts/remixicon.css";

gsap.registerPlugin(ScrollTrigger);

const steps = [{
  number: "01",
  color: "primary",
  title: "Ask Questions, Get Answers",
  description: "Post your questions to the community and receive detailed, high-quality answers from experts and peers.",
  benefits: [
    "Markdown Supported",
    "Upvote helpful answers and mark solutions",
    "Follow questions to receive updates"
  ],
  image: (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
      <div className="p-2 bg-gray-900">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="border-b border-gray-700 pb-4 mb-6">
          <h3 className="text-xl font-bold mb-2 text-white">Understanding React's Virtual DOM and Re-rendering</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">react</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">performance</span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">optimization</span>
          </div>
          <p className="text-gray-300/80 text-sm mb-4">
            I'm trying to understand how React's Virtual DOM works in terms of performance. When should I use React.memo() or useMemo() for optimization? I've noticed some components re-render unnecessarily in my application. Would love to understand the best practices for preventing unnecessary re-renders while maintaining good component architecture.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/30 mr-2 overflow-hidden flex items-center justify-center">
                <i className="ri-user-fill text-xl text-primary/70"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Alex Johnson</p>
                <p className="text-xs text-gray-400">Posted 3 hours ago</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
},
  {
    number: "02",
    color: "primary",
    title: "Create or Join Communities",
    description: "Start by creating your own community or joining existing ones based on your programming interests and topics.",
    benefits: [
      "Create programming communities for your favorite tech topics",
      "Join communities using invite codes",
      "Create multiple text channels within each community"
    ],
    image: (
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="p-2 bg-gray-900">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 text-white">Communities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {["Web Development", "AI & Machine Learning", "Mobile Development", "Game Development"].map((name, i) => (
              <div key={i} className="border border-gray-700 rounded-lg p-4 hover:border-primary bg-gray-850 transition-colors cursor-pointer">
                <div className="flex items-center mb-3">
                  <i className={`ri-${
                    i === 0 ? 'code-s-line' : 
                    i === 1 ? 'robot-line' : 
                    i === 2 ? 'smartphone-line' : 
                    'gamepad-line'
                  } text-primary text-lg mr-3`}></i>
                  <h4 className="font-semibold text-white">{name}</h4>
                </div>
                <p className="text-gray-300/80 text-sm mb-3">{i === 0 ? 'Frontend, backend, and full-stack development discussions' : 
                    i === 1 ? 'Discuss ML models, neural networks, and AI applications' :
                    i === 2 ? 'iOS, Android, and cross-platform app development' : 
                    'Unity, Unreal Engine, and game design discussions'}</p>
                <div className="flex items-center justify-between">
                  <button className="text-xs bg-primary/20 text-primary px-3 py-1 rounded">Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  
  {
    number: "03",
    color: "primary",
    title: "Chat in Real-time",
    description: "Connect with community members through instant messaging in text channels for quick discussions.",
    benefits: [
      "Text channels for focused topic discussions",
      "Direct message with other users",
      "Share emoji reactions and messages"
    ],
    image: (
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="p-2 bg-gray-900">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="flex h-[400px]">
          <div className="w-1/4 bg-gray-900 p-3 flex flex-col">
            <div className="mb-4">
              <h4 className="text-white text-xs font-semibold uppercase mb-2">Web Dev</h4>
              <ul className="space-y-1">
                <li className="flex items-center px-2 py-1 bg-primary/30 rounded text-white text-xs">
                  <i className="ri-hashtag mr-2 text-xs"></i> general
                </li>
                <li className="flex items-center px-2 py-1 text-white/70 text-xs hover:bg-gray-800/50 rounded">
                  <i className="ri-hashtag mr-2 text-xs"></i> frontend
                </li>
                <li className="flex items-center px-2 py-1 text-white/70 text-xs hover:bg-gray-800/50 rounded">
                  <i className="ri-hashtag mr-2 text-xs"></i> backend
                </li>
                <li className="flex items-center px-2 py-1 text-white/70 text-xs hover:bg-gray-800/50 rounded">
                  <i className="ri-hashtag mr-2 text-xs"></i> jobs
                </li>
              </ul>
            </div>

          </div>
          <div className="w-3/4 flex flex-col bg-gray-800">
            <div className="border-b border-gray-700 p-3 flex justify-between items-center">
              <div className="flex items-center">
                <i className="ri-hashtag mr-2 text-gray-400"></i>
                <span className="font-medium text-white">general</span>
              </div>
              <div className="flex space-x-3">
                <button className="text-gray-400 hover:text-gray-300"><i className="ri-user-add-line"></i></button>
                <button className="text-gray-400 hover:text-gray-300"><i className="ri-search-line"></i></button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Chat messages */}
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/30 mr-3 overflow-hidden flex items-center justify-center">
                  <i className="ri-user-fill text-xl text-primary/70"></i>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-white">Sarah Lee</span>
                    <span className="text-gray-400 text-xs ml-2">Today at 10:15 AM</span>
                  </div>
                  <p className="text-sm text-gray-300">Hey everyone! I just posted a question about React hooks in the Q&A section. If anyone has a moment to take a look, I'd appreciate it!</p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/30 mr-3 overflow-hidden flex items-center justify-center">
                  <i className="ri-user-fill text-xl text-primary/70"></i>
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm text-white">Carlos Rodriguez</span>
                    <span className="text-gray-400 text-xs ml-2">Today at 10:18 AM</span>
                  </div>
                  <p className="text-sm text-gray-300">I can take a look. Can you share the link?</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 p-3">
              <div className="relative">
                <textarea 
                  placeholder="Type a message..." 
                  className="w-full p-2 pr-10 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" 
                  rows={1}
                ></textarea>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2 text-gray-400">
                  <button className="hover:text-gray-300"><i className="ri-emotion-line"></i></button>
                  <button className="hover:text-gray-300"><i className="ri-attachment-2"></i></button>
                  <button className="hover:text-gray-300"><i className="ri-send-plane-fill"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

const HowItWorks = () => {
  const titleReveal = useScrollReveal();
  const stepsRefs = useRef([]);
  
  useEffect(() => {
    // animation effects for steps
    steps.forEach((step, index) => {
      const isEven = index % 2 === 1;
      const textEl = stepsRefs.current[index * 2];
      const imageEl = stepsRefs.current[index * 2 + 1];
      
      if (textEl && imageEl) {
        gsap.set(textEl, { 
          opacity: 0, 
          x: isEven ? 50 : -50 
        });
        
        gsap.set(imageEl, { 
          opacity: 0, 
          x: isEven ? -50 : 50 
        });
        
        // ScrollTrigger for each step
        ScrollTrigger.create({
          trigger: textEl.parentElement,
          start: 'top 70%',
          onEnter: () => {
            gsap.to(textEl, {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: 'power2.out'
            });
            
            gsap.to(imageEl, {
              opacity: 1,
              x: 0,
              duration: 0.7,
              delay: 0.2,
              ease: 'power2.out'
            });
          },
          once: true
        });
      }
    });
  }, []);
  
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-gray-900">
      <div className="container mx-auto px-6">
        <div 
          className="text-center mb-16"
          ref={titleReveal.ref}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4 text-white">How <span className="text-primary">Symmunity</span> Works</h2>
          <p className="text-gray-300/90 max-w-2xl mx-auto">See how our platform seamlessly integrates Q&A forums with community chat functionality.</p>
        </div>
        
        <div className="flex flex-col space-y-24">
          {steps.map((step, index) => {
            const textReveal = useScrollReveal();
            const imageReveal = useScrollReveal();
            const isEven = index % 2 === 1;
            
            return (
              <div 
                key={index} 
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}
              >
                <div 
                  className={`md:w-1/2 mb-10 md:mb-0 ${isEven ? 'md:pl-10' : 'md:pr-10'}`}
                  ref={el => { 
                    textReveal.ref.current = el; 
                    stepsRefs.current[index * 2] = el;
                  }}
                >
                  <div className={`bg-${step.color}/20 rounded-lg px-4 py-2 inline-block mb-4`}>
                    <span className={`text-${step.color} font-medium`}>Step {step.number}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300/90 mb-6">{step.description}</p>
                  <ul className="space-y-3">
                    {step.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <div className="mt-1 mr-3 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                          <i className="ri-check-line text-xs text-primary"></i>
                        </div>
                        <p className="text-gray-300/90">{benefit}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div 
                  className="md:w-1/2"
                  ref={el => { 
                    imageReveal.ref.current = el; 
                    stepsRefs.current[index * 2 + 1] = el;
                  }}
                >
                  {step.image}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;