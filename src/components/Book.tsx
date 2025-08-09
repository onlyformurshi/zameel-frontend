import { useState, useEffect } from 'react';
import Page from './Page';

const PAGES = [
  {
    title: "Welcome to My Interactive Book",
    content: `Welcome to this amazing interactive book experience!\n
This is a modern take on digital storytelling, where each page comes alive with smooth transitions and engaging content.\n
Scroll down to explore more chapters and discover the magic of interactive storytelling.`
  },
  {
    title: "The Journey Begins",
    content: `Chapter 1: A New Beginning\n
Every great story starts with a single step. This chapter marks the beginning of our journey together.\n
As you scroll through these pages, you'll notice the smooth page-turning animations that make this digital book feel real and tangible.\n
The pages will flip naturally, responding to your scroll, creating an immersive reading experience.`
  },
  {
    title: "Interactive Elements",
    content: `Chapter 2: The Power of Interaction\n
Digital books don't have to be static. They can be dynamic, responsive, and engaging.\n
Each page in this book is carefully crafted to provide the perfect balance of content and visual appeal.\n
The subtle shadows and page-turning effects add depth to your reading experience.`
  },
  {
    title: "Smooth Transitions",
    content: `Chapter 3: The Art of Movement\n
Notice how each page smoothly transitions into the next as you scroll.\n
The pages curl and turn just like a real book, creating a familiar and comfortable reading experience.\n
These animations are carefully timed to feel natural and responsive.`
  },
  {
    title: "Final Thoughts",
    content: `Conclusion: The Future of Reading\n
This interactive book demonstrates how digital content can maintain the charm of traditional books while adding modern interactivity.\n
Thank you for exploring this demonstration of interactive storytelling.\n
Feel free to scroll back up and watch the pages flip in reverse!`
  }
];

const Book = () => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Create scroll container
    const container = document.createElement('div');
    container.style.height = `${100 * PAGES.length}vh`;
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.top = '0';
    container.style.left = '0';
    document.body.appendChild(container);

    const handleScroll = () => {
      const scrollPercentage = window.scrollY / (container.offsetHeight - window.innerHeight);
      const newPage = Math.min(
        Math.floor(scrollPercentage * PAGES.length),
        PAGES.length - 1
      );
      
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.removeChild(container);
    };
  }, [currentPage]);

  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        {PAGES.map((page, index) => (
          <Page
            key={index}
            title={page.title}
            content={page.content}
            isVisible={index <= currentPage}
            zIndex={PAGES.length - index}
          />
        ))}
      </div>
    </div>
  );
};

export default Book; 