import { type VariantProps } from 'class-variance-authority';

import { type buttonVariants } from '../variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
