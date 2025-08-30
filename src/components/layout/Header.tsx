'use client';

import { Box, Typography, Link } from '@mui/material';
import NextLink from 'next/link';

interface HeaderProps {
  title: string;
  tagline: string;
  siteUrl: string;
  headerLink?: React.ReactNode;
}

export const Header = ({ title, tagline, siteUrl, headerLink }: HeaderProps) => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 4,
          borderBottom: 1,
          borderColor: '#eee',
          '@media (max-width: 840px)': {
            p: 2,
            flexWrap: 'wrap',
            gap: 1,
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: '20px',
            mb: 0,
            '@media (max-width: 840px)': {
              fontSize: '20px',
            },
          }}
        >
          <Link
            component={NextLink}
            href={siteUrl}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            {title}
          </Link>
        </Typography>
        
        {headerLink && (
          <Box
            sx={{
              color: '#333',
              fontSize: '11px',
            }}
          >
            {headerLink}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          px: 4,
          '@media (max-width: 840px)': {
            px: 2,
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            color: 'text.secondary',
            opacity: 0.9,
            mb: '2rem',
          }}
        >
          {tagline}
        </Typography>
      </Box>
    </Box>
  );
};