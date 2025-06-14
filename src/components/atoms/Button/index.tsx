import { forwardRef } from 'react';

import { Button as HeadlessButton } from '@headlessui/react';

import { cn } from '../../../utils/cn';
import { type ButtonProps } from './@types';
import { buttonVariants } from './variants';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? HeadlessButton : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = 'Button';

export { Button };
