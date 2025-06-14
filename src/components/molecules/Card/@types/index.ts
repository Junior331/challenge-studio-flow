import { type ReactNode } from 'react';

interface QuickLink {
  label: string;
  onClick: () => void;
}

interface CardProps {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
  quickLinks?: QuickLink[];
}

export type { QuickLink, CardProps };
