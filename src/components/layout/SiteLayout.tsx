'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { SiteConfig } from '@/types/template';

interface SiteLayoutProps {
  config: SiteConfig;
  children: ReactNode;
}

export const SiteLayout = ({ config, children }: SiteLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        title={config.title}
        tagline={config.tagline}
        siteUrl={config.url}
        headerLink={config.headerLink}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
        }}
      >
        {children}
      </Box>

      <Footer customLinks={config.footerCustomLinks} />
    </Box>
  );
};
