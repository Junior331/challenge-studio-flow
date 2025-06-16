import { type ReactNode } from 'react';

import { type Scene } from '../../../../reducers/scenes';

interface ColumnProps {
  id: string;
  step: number;
  label: string;
  count: number;
  scenes: Scene[];
  children: ReactNode;
}

export type { ColumnProps };
