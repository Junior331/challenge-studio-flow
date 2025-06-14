import { type ReactNode } from 'react';

interface ColumnProps {
  id: string;
  step: number;
  label: string;
  count: number;
  children: ReactNode;
}

export type { ColumnProps };
