import React from 'react';
import { Skeleton, Box, Card, CardContent } from '@mui/material';

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', mb: 1 }}>
        {Array(columns).fill(0).map((_, i) => (
          <Skeleton 
            key={i} 
            variant="rectangular" 
            width={`${100/columns}%`} 
            height={40} 
            sx={{ mx: 0.5 }} 
          />
        ))}
      </Box>
      
      {/* Rows */}
      {Array(rows).fill(0).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', my: 1 }}>
          {Array(columns).fill(0).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="rectangular" 
              width={`${100/columns}%`} 
              height={30} 
              sx={{ mx: 0.5 }} 
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export const CardSkeleton = ({ count = 1 }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} sx={{ width: 280, mb: 2 }}>
          <CardContent>
            <Skeleton variant="rectangular" width="100%" height={120} />
            <Skeleton variant="text" width="80%" height={30} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="60%" height={20} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Skeleton variant="rectangular" width="30%" height={30} />
              <Skeleton variant="circular" width={30} height={30} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export const ProfileSkeleton = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
        <Box sx={{ width: '100%' }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 2 }} />
      {Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} variant="text" width="100%" height={30} sx={{ mb: 1 }} />
      ))}
    </Box>
  );
};
export default { CardSkeleton, TableSkeleton, ProfileSkeleton };