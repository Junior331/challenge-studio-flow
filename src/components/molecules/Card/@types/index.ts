import { type ReactNode } from 'react';

interface QuickLink {
  label: string;
  count?: number;
  onClick?: () => void;
}

interface CardFooter {
  label: string;
  onClick?: () => void;
}

interface CardProps {
  title: string;
  icon: ReactNode;
  subtitle?: string;
  className?: string;
  footer?: CardFooter;
  quickLinks?: QuickLink[];
}

interface QuickLinksProps {
  links: QuickLink[];
}

interface FooterProps {
  footer?: CardFooter;
}

interface HeaderProps {
  title: string;
  icon: ReactNode;
  subtitle?: string;
}

export type { QuickLink, CardFooter, CardProps, QuickLinksProps, FooterProps, HeaderProps };
