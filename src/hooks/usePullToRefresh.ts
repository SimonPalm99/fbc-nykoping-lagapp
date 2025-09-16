import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 150,
  enabled = true
}: PullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    startY.current = e.touches[0]?.clientY || 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!enabled || isRefreshing || startY.current === 0) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    const currentY = e.touches[0]?.clientY || 0;
    const distance = Math.max(0, currentY - startY.current);
    
    if (distance > 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance * 0.5, maxPullDistance));
    }
  };

  const handleTouchEnd = async () => {
    if (!enabled || isRefreshing || !isPulling) return;
    
    setIsPulling(false);
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    startY.current = 0;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isRefreshing]);

  const pullIndicatorStyle = {
    transform: `translateY(${pullDistance}px)`,
    opacity: isPulling ? Math.min(pullDistance / threshold, 1) : 0,
    transition: isPulling ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
  };

  return {
    containerRef,
    isRefreshing,
    isPulling,
    pullDistance,
    pullIndicatorStyle,
    isOverThreshold: pullDistance >= threshold
  };
};

export default usePullToRefresh;