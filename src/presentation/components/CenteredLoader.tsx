import React from 'react';
import { Box, CircularProgress, Fade, Typography } from '@mui/material';

interface CenteredLoaderProps {
  loading: boolean;
  text?: string;
  timeout?: number;
}

const CenteredLoader: React.FC<CenteredLoaderProps> = ({ loading, text = 'Cargando...', timeout = 300 }) => (
  <Fade in={loading} timeout={timeout} unmountOnExit>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        py: 8,
      }}
    >
      <CircularProgress
        size={80}
        thickness={4}
        sx={{
          color: 'primary.main',
          mb: 2,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 1 },
            '50%': { transform: 'scale(1.1)', opacity: 0.7 },
            '100%': { transform: 'scale(1)', opacity: 1 },
          },
        }}
      />
      <Typography
        variant="h6"
        color="primary.main"
        sx={{
          fontWeight: 600,
          animation: 'fadeInOut 2s ease-in-out infinite',
          '@keyframes fadeInOut': {
            '0%, 100%': { opacity: 0.6 },
            '50%': { opacity: 1 },
          },
        }}
      >
        {text}
      </Typography>
    </Box>
  </Fade>
);

export default CenteredLoader; 