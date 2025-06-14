import { type ReactNode, useEffect, useState } from 'react';

import { useDroppable } from '@dnd-kit/core';

import { cn } from '../../../utils/cn';

interface ColumnProps {
  id: string;
  step: number;
  label: string;
  count?: number;
  description?: string;
  children?: ReactNode;
}

export function Column({ id, step, label, count, description, children }: ColumnProps) {
  const [disabled, setDisabled] = useState(false);

  const { setNodeRef, isOver, active, over } = useDroppable({
    id,
    data: {
      step,
    },
    disabled,
  });

  useEffect(() => {
    if (!over) {
      setDisabled(false);
      return;
    }

    const actual = active?.data.current?.step;

    if (actual) {
      const isDisabled = step === actual;
      setDisabled(isDisabled);
    } else {
      setDisabled(false);
    }
  }, [active, over, setDisabled, step]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col bg-secondary rounded-lg border border-border w-72 min-w-[16rem] max-w-xs h-full',
        isOver && !disabled && 'border-primary',
        disabled && 'opacity-50 border-none cursor-not-allowed',
      )}
    >
      <div className='flex items-center justify-between px-4 py-3 border-b border-border'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-foreground'>{label}</span>
          {typeof count === 'number' && (
            <span className='bg-muted text-xs rounded-full px-2 py-0.5 text-muted-foreground font-semibold'>
              {count}
            </span>
          )}
        </div>
      </div>
      {description && <div className='px-4 py-1 text-xs text-muted-foreground'>{description}</div>}
      <div className='flex-1 overflow-y-auto px-2 py-2 space-y-2'>{children}</div>
    </div>
  );
}
