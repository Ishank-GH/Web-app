import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from './useAnimation';
import "remixicon/fonts/remixicon.css";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: 'ri-team-fill',
    color: 'primary',
    title: 'Find Your Community',
    description: 'Join communities for your favorite programming languages, frameworks, and technical topics.'
  },
  {
    icon: 'ri-question-answer-fill',
    color: 'primary',
    title: 'Get Expert Answers',
    description: 'Ask questions and receive helpful answers from experienced developers.'
  },
  {
    icon: 'ri-chat-3-fill',
    color: 'primary',
    title: 'Real-time Discussions',
    description: 'Participate in text discussions about programming topics that interest you.'
  }
];

const Community = () => {
  const titleReveal = useScrollReveal();
  const benefitsRefs = useRef([]);
  
  useEffect(() => {
    // Title animation
    gsap.set(titleReveal.ref.current, { 
      opacity: 0, 
      y: 30 
    });
    
    ScrollTrigger.create({
      trigger: titleReveal.ref.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(titleReveal.ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      },
      once: true
    });
    
    // Benefits animations
    benefitsRefs.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, { 
          opacity: 0, 
          y: 30 
        });
        
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: 'power2.out'
            });
          },
          once: true
        });
      }
    });
  }, []);
  
  return (
    <section id="community" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div 
          className="text-center mb-16"
          ref={titleReveal.ref}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4 text-white">Join a <span className="text-primary">Growing Community</span></h2>
          <p className="text-gray-300/90 max-w-2xl mx-auto">Connect with like-minded individuals, learn from experts, and share your knowledge.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const benefitReveal = useScrollReveal();
            
            return (
              <div 
                key={index}
                className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors"
                ref={el => {
                  benefitReveal.ref.current = el;
                  benefitsRefs.current[index] = el;
                }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <i className={`fas ${benefit.icon} text-2xl text-primary`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                <p className="text-gray-300/80">{benefit.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="bg-gray-900 rounded-xl p-8 shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to join the conversation?</h3>
              <p className="text-gray-300/90 mb-6">Create your account today and start connecting with a community of developers. Your next breakthrough might be just one question away.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="signup" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center shadow-lg shadow-primary/20">Get Started For Free</a>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-gray-900 px-4 py-2 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-white/50 text-xs mx-auto">community/react-developers</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
                    <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary mr-4">
                      <i className="fas fa-react text-lg"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">React Developers</h4>
                      <p className="text-white/50 text-xs">4 channels • 3 members</p>
                    </div>
                    <button className="ml-auto bg-primary/20 text-primary text-xs px-3 py-1 rounded">Joined</button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-white/50 text-xs uppercase mb-2">Channels</div>
                    <ul className="space-y-1">
                      <li className="flex items-center px-3 py-1 bg-primary/10 rounded text-white text-sm">
                        <i className="ri-hashtag mr-2 text-xs"></i> general
                      </li>
                      <li className="flex items-center px-3 py-1 text-white/50 text-sm hover:bg-gray-700/30 rounded">
                        <i className="ri-hashtag mr-2 text-xs"></i> help
                      </li>
                      <li className="flex items-center px-3 py-1 text-white/50 text-sm hover:bg-gray-700/30 rounded">
                        <i className="ri-hashtag mr-2 text-xs"></i> showcase
                      </li>
                      <li className="flex items-center px-3 py-1 text-white/50 text-sm hover:bg-gray-700/30 rounded">
                        <i className="ri-hashtag mr-2 text-xs"></i> job-board
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;