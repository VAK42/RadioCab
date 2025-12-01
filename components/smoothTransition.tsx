'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
interface SmoothTransitionProps {
  children: React.ReactNode;
}
export default function SmoothTransition({ children }: SmoothTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [key, setKey] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setKey(prev => prev + 1);
      setIsVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname]);
  return (
    <div key={key} className={`transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-98'}`}>
      {children}
    </div>
  )
}