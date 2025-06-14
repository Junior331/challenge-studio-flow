import { type VariantProps } from 'class-variance-authority';

import { type inputVariants } from '../variants';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}
