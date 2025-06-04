// app/demo/_layout.tsx
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';

export default function DemoLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: isMobile ? '100%' : '1200px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      overflowY: 'auto',
      padding: isMobile ? '0 12px' : '0 24px'
    }}>
      <Slot />
    </div>
  );
}