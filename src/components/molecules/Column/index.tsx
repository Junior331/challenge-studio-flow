import { useDroppable } from '@dnd-kit/core';

import { cn } from '../../../lib/utils';
import { type ColumnProps } from './@types';

export function Column({ id, step, label, count, children }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      step,
    },
  });

  return (
    <div className='flex flex-col gap-4 min-w-[300px]'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-foreground'>{label}</h3>
        <span className='text-sm text-muted-foreground'>{count}</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 p-2 min-h-[200px] rounded-lg border border-border bg-background/50',
        )}
      >
        {children}
      </div>
    </div>
  );
}
