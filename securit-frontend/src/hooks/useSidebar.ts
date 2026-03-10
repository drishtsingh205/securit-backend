'use client';

import { useState, useEffect } from 'react';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  return { isCollapsed, isMobileOpen, toggle, closeMobile };
}

export default useSidebar;
