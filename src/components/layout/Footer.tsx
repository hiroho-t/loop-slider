'use client';

import { Box, Typography, Link } from '@mui/material';

interface FooterProps {
  customLinks?: React.ReactNode;
}

export const Footer = ({ customLinks }: FooterProps) => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 4,
        borderTop: 1,
        borderColor: '#eee',
        fontSize: '14px',
        color: '#999',
        '@media (max-width: 840px)': {
          flexDirection: 'column',
          gap: 2,
          p: 2,
          textAlign: 'center',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2.5,
          '@media (max-width: 840px)': {
            flexDirection: 'column',
            gap: 1.25,
          },
        }}
      >
        {customLinks}
        <Link
          href="https://startwith.studio.site/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#999',
            textDecoration: 'none',
            '&:hover': {
              color: '#333',
              textDecoration: 'underline',
            },
          }}
        >
          運営会社
        </Link>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: '#999',
          fontSize: '12px',
          fontWeight: 400,
        }}
      >
        © StartWith Inc.
      </Typography>
    </Box>
  );
};
