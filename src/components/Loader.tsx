import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader: React.FC = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgba(0, 0, 0, 0.4)"
      zIndex={1300}
      sx={{ color: '#fff' }} // 👈 цвет для CircularProgress (через inherit)
    >
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default Loader;
