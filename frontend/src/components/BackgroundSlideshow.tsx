import { useState, useEffect, useCallback } from 'react';

const IMAGES = [
  '/background/bg-1.jpg',
  '/background/bg-2.jpg',
  '/background/bg-3.jpg',
  '/background/bg-4.jpg',
  '/background/bg-5.jpg',
  '/background/bg-6.png',
  '/background/bg-7.jpg',
  '/background/bg-8.jpg',
  '/background/bg-9.jpg',
  '/background/bg-10.png',
  '/background/bg-11.jpg',
  '/background/bg-12.png',
  '/background/bg-13.jpg',
  '/background/bg-14.jpg',
  '/background/bg-15.jpg',
  '/background/bg-16.jpg',
  '/background/bg-17.png',
  '/background/bg-18.jpg',
  '/background/bg-19.jpg',
  '/background/bg-20.jpg'
];

export default function BackgroundSlideshow() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const nextImage = useCallback(() => {
    setPrev(current);
    setCurrent((c) => (c + 1) % IMAGES.length);
  }, [current]);

  useEffect(() => {
    const timer = setInterval(nextImage, 8000);
    return () => clearInterval(timer);
  }, [nextImage]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-2000 ease-in-out"
          style={{
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: i === current ? 1 : i === prev ? 0 : 0,
          }}
        />
      ))}
      {/* Frosted overlay */}
      <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px]" />
    </div>
  );
}
