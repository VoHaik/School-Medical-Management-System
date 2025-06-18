import React from 'react';
import { Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const ResponsiveContainer = ({ 
  children, 
  mobileStyles = {}, 
  tabletStyles = {}, 
  desktopStyles = {}, 
  ...props 
}) => {
  const isMobile = useMediaQuery('(max-width:767px)');
  const isTablet = useMediaQuery('(min-width:768px) and (max-width:1024px)');
  const isDesktop = useMediaQuery('(min-width:1025px)');
  
  const getStyles = () => {
    if (isMobile) return { ...props.sx, ...mobileStyles };
    if (isTablet) return { ...props.sx, ...tabletStyles };
    if (isDesktop) return { ...props.sx, ...desktopStyles };
    return props.sx;
  };
  
  return (
    <Box sx={getStyles()} {...props}>
      {children}
    </Box>
  );
};

export default ResponsiveContainer;