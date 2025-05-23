
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect device performance capabilities
 */
const useDevicePerformance = () => {
  const [performanceMode, setPerformanceMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if device is likely to have performance issues
    const isLowPerfDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth < 768);

    setPerformanceMode(isLowPerfDevice);
    
    // You could add more sophisticated detection here in the future
    
  }, []);

  return performanceMode;
};

export default useDevicePerformance;
