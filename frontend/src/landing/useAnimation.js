import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = () => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const element = ref.current;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top 70%',
      onEnter: () => setIsInView(true),
      once: true
    });
    
    return () => {
      // Clean up ScrollTrigger when component unmounts
      scrollTrigger.kill();
    };
  }, []);
  
  return { ref, isInView };
};

export const useMouseTracking = (intensity = 50) => {
  const ref = useRef(null);
  const [transform, setTransform] = useState('translate(0px, 0px)');
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      
      const elementX = left + width / 2;
      const elementY = top + height / 2;
      
      const moveX = (e.clientX - elementX) / intensity;
      const moveY = (e.clientY - elementY) / intensity;
      
      gsap.to(ref.current, {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Reset position on cleanup
      if (ref.current) {
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.3 });
      }
    };
  }, [intensity]);
  
  return { ref, style: {} };
};

export const usePageTransition = (delay = 0) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Set initial state
    gsap.set(ref.current, { 
      opacity: 0, 
      y: 20 
    });
    
    // Animate in after delay
    const animation = gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: delay / 1000 
    });
    
    return () => {
      animation.kill();
    };
  }, [delay]);
  
  return { ref };
};