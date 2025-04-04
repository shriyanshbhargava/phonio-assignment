'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Testimonials.module.css';
import { testimonials } from '@/lib/testimonials';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState(null);
  const carouselRef = useRef(null);
  const avatarsRef = useRef(null);
  const testimonialsLength = testimonials.length;
  
  const getVirtualIndex = (realIndex) => {
    return ((realIndex % testimonialsLength) + testimonialsLength) % testimonialsLength;
  };
  
  const createInfiniteTestimonials = () => {
    return [
      {...testimonials[testimonialsLength - 2], virtualIndex: -2},
      {...testimonials[testimonialsLength - 1], virtualIndex: -1},
      ...testimonials.map((item, index) => ({...item, virtualIndex: index})),
      {...testimonials[0], virtualIndex: testimonialsLength},
      {...testimonials[1], virtualIndex: testimonialsLength + 1}
    ];
  };
  
  const infiniteTestimonials = createInfiniteTestimonials();
  
  const scrollToCard = (index, smooth = true) => {
    if (!carouselRef.current) return;

    const normalizedIndex = getVirtualIndex(index);
    const targetIndex = normalizedIndex + 2; 
    const card = carouselRef.current.querySelector(`.${styles.testimonialCard}`);
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const containerWidth = carouselRef.current.offsetWidth;
    const centerPosition = (targetIndex * cardWidth) - (containerWidth / 2) + (cardWidth / 2);

    let scrollCompleted = false;
    
    const finishScroll = () => {
      if (scrollCompleted) return;
      scrollCompleted = true;
      updateAvatarScroll(normalizedIndex);
    };

    carouselRef.current.scrollTo({
      left: centerPosition,
      behavior: smooth ? 'smooth' : 'auto'
    });

    if (!smooth) {
      finishScroll();
      return;
    }

    let lastScrollLeft = carouselRef.current.scrollLeft;
    const checkScrollEnd = () => {
      const currentScrollLeft = carouselRef.current.scrollLeft;
      if (Math.abs(currentScrollLeft - lastScrollLeft) < 1) {
        finishScroll();
      } else {
        lastScrollLeft = currentScrollLeft;
        setTimeout(checkScrollEnd, 50);
      }
    };

    setTimeout(checkScrollEnd, 100);
  };

  const updateCardClasses = () => {
    if (!carouselRef.current) return;
    
    const cards = Array.from(carouselRef.current.querySelectorAll(`.${styles.testimonialCard}`));
    const normalizedActiveIndex = getVirtualIndex(activeIndex);
    const prevIndex = getVirtualIndex(activeIndex - 1);
    const nextIndex = getVirtualIndex(activeIndex + 1);
    
    cards.forEach(card => {
      const virtualIndex = parseInt(card.dataset.virtualIndex);
      card.classList.remove(styles.active, styles.adjacentLeft, styles.adjacentRight);
      
      // Handle buffer elements in class assignment
      if ((virtualIndex === -1 && normalizedActiveIndex === testimonialsLength - 1) ||
          (virtualIndex === -2 && normalizedActiveIndex === testimonialsLength - 2) ||
          (virtualIndex === testimonialsLength && normalizedActiveIndex === 0) ||
          (virtualIndex === testimonialsLength + 1 && normalizedActiveIndex === 1) ||
          (virtualIndex === normalizedActiveIndex)) {
        card.classList.add(styles.active);
      } else if (virtualIndex === prevIndex || 
                (virtualIndex === testimonialsLength - 1 && normalizedActiveIndex === 0) ||
                (virtualIndex === -1 && normalizedActiveIndex === 0)) {
        card.classList.add(styles.adjacentLeft);
      } else if (virtualIndex === nextIndex || 
                (virtualIndex === 0 && normalizedActiveIndex === testimonialsLength - 1) ||
                (virtualIndex === testimonialsLength && normalizedActiveIndex === testimonialsLength - 1)) {
        card.classList.add(styles.adjacentRight);
      }
    });
  };

  useEffect(() => {
    let interval;
    
    const startAutoScroll = () => {
      interval = setInterval(() => {
        if (!isDragging) {
          const nextIndex = getVirtualIndex(activeIndex + 1);
          setActiveIndex(nextIndex);
        }
      }, 60000);
    };
    
    startAutoScroll();
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDragging, activeIndex, testimonialsLength]);

  useEffect(() => {
    updateCardClasses();
    scrollToCard(activeIndex, !isDragging);
  }, [activeIndex, isDragging]);

  const handleAvatarClick = (index) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }

    setActiveIndex(index);
  };

  const handleCardClick = (index) => {
    const virtualIndex = parseInt(index);
    
    if (virtualIndex < 0) {
      setActiveIndex(testimonialsLength + virtualIndex);
    } else if (virtualIndex >= testimonialsLength) {
      setActiveIndex(virtualIndex - testimonialsLength);
    } else if (virtualIndex !== getVirtualIndex(activeIndex)) {
      setActiveIndex(virtualIndex);
    }
  };

  const handleMouseDown = (e) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    
    setIsDragging(true);
    setStartX(e.pageX);
    setLastX(e.pageX);
    setLastTimestamp(Date.now());
    setScrollLeft(carouselRef.current.scrollLeft);
    
    // Add class to indicate dragging state
    carouselRef.current.classList.add('dragging');
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const currentX = e.pageX;
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTimestamp, 10);
    
    const dx = currentX - lastX;
    const newVelocity = dx / deltaTime * 10;
    
    // Improved velocity calculation with exponential moving average
    setVelocity(velocity * 0.8 + newVelocity * 0.2);
    
    // Smoother scrolling with requestAnimationFrame
    requestAnimationFrame(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = scrollLeft - (currentX - startX) * 1.5;
      }
    });
    
    setLastX(currentX);
    setLastTimestamp(currentTime);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Remove dragging class
    if (carouselRef.current) {
      carouselRef.current.classList.remove('dragging');
    }
    
    let currentVelocity = velocity * 30; // Increased for more pronounced inertia
    let lastTimestamp = Date.now();
    let deceleration = 0.95; // Smoother deceleration
    
    const animateMomentum = () => {
      const now = Date.now();
      const deltaTime = now - lastTimestamp;
      lastTimestamp = now;
      
      if (!carouselRef.current) return;
      
      const scrollDelta = currentVelocity * deltaTime / 16.7;
      
      // Apply easing to the scroll
      carouselRef.current.scrollLeft -= scrollDelta;
      
      // Apply smoother deceleration
      currentVelocity *= Math.pow(deceleration, deltaTime / 16.7);
      
      if (Math.abs(currentVelocity) < 0.5) {
        // Snap to closest card more accurately
        const cardWidth = carouselRef.current.querySelector(`.${styles.testimonialCard}`).offsetWidth;
        const containerCenter = carouselRef.current.offsetWidth / 2;
        const scrollPosition = carouselRef.current.scrollLeft + containerCenter;
        
        // Adjusted for buffer elements
        let closestIndex = Math.round(scrollPosition / cardWidth) - 2;
        
        // Handle index wrapping
        if (closestIndex < 0) {
          closestIndex = testimonialsLength + closestIndex;
        } else if (closestIndex >= testimonialsLength) {
          closestIndex = closestIndex - testimonialsLength;
        }
        
        setActiveIndex(closestIndex);
        return;
      }
      
      const id = requestAnimationFrame(animateMomentum);
      setAnimationFrameId(id);
    };
    
    animateMomentum();
  };

  const handleTouchStart = (e) => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setLastX(e.touches[0].pageX);
    setLastTimestamp(Date.now());
    setScrollLeft(carouselRef.current.scrollLeft);
    
    // Add class to indicate touch state
    carouselRef.current.classList.add('touching');
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].pageX;
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTimestamp, 10);
    
    const dx = currentX - lastX;
    const newVelocity = dx / deltaTime * 10;
    
    // Improved velocity calculation
    setVelocity(velocity * 0.8 + newVelocity * 0.2);
    
    // Use requestAnimationFrame for smoother touch movement
    requestAnimationFrame(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = scrollLeft - (currentX - startX) * 1.5;
      }
    });
    
    setLastX(currentX);
    setLastTimestamp(currentTime);
  };

  const handleTouchEnd = (e) => {
    if (carouselRef.current) {
      carouselRef.current.classList.remove('touching');
    }
    handleMouseUp(e);
  };

  const updateAvatarScroll = (index) => {
    if (avatarsRef.current && index !== null) {
      const avatarElements = avatarsRef.current.children;
      if (avatarElements[index]) {
        const avatarElement = avatarElements[index];
        const containerWidth = avatarsRef.current.offsetWidth;
        const avatarLeft = avatarElement.offsetLeft;
        const avatarWidth = avatarElement.offsetWidth;
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
          avatarsRef.current.scrollTo({
            left: avatarLeft - (containerWidth / 2) + (avatarWidth / 2),
            behavior: 'smooth'
          });
        });
      }
    }
  };

  useEffect(() => {
    updateAvatarScroll(getVirtualIndex(activeIndex));
  }, [activeIndex]);

  useEffect(() => {
    const handleResize = () => {
      scrollToCard(activeIndex, false);
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    if (carouselRef.current) {
      resizeObserver.observe(carouselRef.current);
    }
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [activeIndex]);

  useEffect(() => {
    if (carouselRef.current) {
      // Initial setup with progressive refinement
      scrollToCard(activeIndex, false);
      
      // Staggered initialization to ensure proper rendering
      const delays = [50, 150, 300, 600];
      
      delays.forEach(delay => {
        setTimeout(() => {
          if (carouselRef.current) {
            scrollToCard(activeIndex, delay > 100);
          }
        }, delay);
      });
    }
    
    // Add event listener for wheel events
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
        e.preventDefault();
        
        if (e.deltaX > 0) {
          setActiveIndex(prev => getVirtualIndex(prev + 1));
        } else {
          setActiveIndex(prev => getVirtualIndex(prev - 1));
        }
      }
    };
    
    if (carouselRef.current) {
      carouselRef.current.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className={styles.testimonialsSection}>
      <div className={styles.heroHeading}>
        <h1>We built Osmo to help creative developers work smarter, faster, and better.</h1>
      </div>

      <div className={styles.trustedBy}>
        <p>Trusted by:</p>
        <div className={styles.avatarsContainer} ref={avatarsRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`${styles.avatarWrapper} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => handleAvatarClick(index)}
            >
              <div className={styles.avatar}>
                {testimonial.image}
              </div>
              {activeIndex === index && (
                <div className={styles.avatarName}>{testimonial.name.toUpperCase()}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className={styles.testimonialsCarousel}
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => isDragging && handleMouseUp()}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infiniteTestimonials.map((testimonial, index) => {
          const virtualIndex = testimonial.virtualIndex;
          return (
            <div
              key={index}
              className={styles.testimonialCard}
              onClick={() => handleCardClick(virtualIndex)}
              data-virtual-index={virtualIndex}
            >
              {activeIndex === getVirtualIndex(virtualIndex) && (
                <>
                  <div className={styles.topLeftCorner}></div>
                  <div className={styles.topRightCorner}></div>
                  <div className={styles.bottomLeftCorner}></div>
                  <div className={styles.bottomRightCorner}></div>
                </>
              )}
              <div className={styles.testimonialContent}>
                <p>{testimonial.testimonial}</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {testimonial.image}
                </div>
                <div className={styles.authorInfo}>
                  <h4>{testimonial.name.toUpperCase()}</h4>
                  <p>{testimonial.designation.toUpperCase()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}