import { useMediaQuery } from '@mui/material';

const useResponsive = () => {
  const isXsScreen = useMediaQuery('(max-width:480px)');
  const isSmScreen = useMediaQuery('(min-width:481px) and (max-width:767px)');
  const isMdScreen = useMediaQuery('(min-width:768px) and (max-width:1024px)');
  const isLgScreen = useMediaQuery('(min-width:1025px) and (max-width:1280px)');
  const isXlScreen = useMediaQuery('(min-width:1281px)');
  
  const isMobile = isXsScreen || isSmScreen;
  const isTablet = isMdScreen;
  const isDesktop = isLgScreen || isXlScreen;
  
  return {
    isXsScreen,
    isSmScreen,
    isMdScreen,
    isLgScreen,
    isXlScreen,
    isMobile,
    isTablet,
    isDesktop,
    // Helper functions
    screenSize: isXsScreen ? 'xs' : isSmScreen ? 'sm' : isMdScreen ? 'md' : isLgScreen ? 'lg' : 'xl',
    orientation: useMediaQuery('(orientation: portrait)') ? 'portrait' : 'landscape',
    isPrint: useMediaQuery('print'),
  };
};

export default useResponsive;