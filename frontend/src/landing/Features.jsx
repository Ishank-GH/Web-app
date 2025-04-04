import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from './useAnimation';
import "remixicon/fonts/remixicon.css";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: 'ri-question-fill',   
    color: 'primary',
    title: 'Structured Q&A',
    description: 'Ask questions, get expert answers, and build a searchable knowledge base for programming topics.',
    benefits: [
      'Upvote best answers',
      'Markdown support',
      'Get help from the community'
    ]
  },
  {
    icon: 'ri-message-3-fill',   
    color: 'primary',
    title: 'Real-time Messaging',
    description: 'Connect directly with other users or chat in community text channels.',
    benefits: [
      'Private direct messages',
      'Community text channels',
      'Emoji reactions'
    ]
  },
  {
    icon: 'ri-team-fill',      
    color: 'primary',
    title: 'Community Spaces',
    description: 'Create and join communities around shared programming interests and topics.',
    benefits: [
      'Create your own communities',
      'Join via invite codes',
      'Multiple channels per community'
    ]
  }
];

const Features = () => {
  const titleReveal = useScrollReveal();
  const featuresRefs = useRef([]);
  
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
    
    // Feature card animations
    featuresRefs.current.forEach((el, index) => {
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
              delay: index * 0.15,
              ease: 'power2.out'
            });
          },
          once: true
        });
      }
    });
  }, []);
  
  return (
    <section id="features" className="py-24 bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      <div className="container mx-auto px-6">
        <div 
          className="text-center mb-16"
          ref={titleReveal.ref}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-sans mb-4 text-white">Combining the best of <span className="text-primary">both worlds</span></h2>
          <p className="text-gray-300/90 max-w-2xl mx-auto">Symmunity unites the knowledge-sharing power of Q&A forums with the community engagement of modern chat platforms.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const itemReveal = useScrollReveal();
            
            return (
              <div 
                key={index}
                className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-gray-600 transition-colors"
                ref={el => { 
                  itemReveal.ref.current = el;
                  featuresRefs.current[index] = el;
                }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <i className={`${feature.icon} text-xl text-primary`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300/80 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-300">
                      <i className="fas fa-check text-primary mr-2"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;