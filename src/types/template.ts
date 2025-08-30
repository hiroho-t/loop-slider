export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  tagline: string;
  ogImageUrl?: string;
  headerLink?: React.ReactNode;
  footerCustomLinks?: React.ReactNode;
  googleAnalytics?: string;
}