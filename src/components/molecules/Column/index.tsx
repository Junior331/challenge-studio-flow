/* eslint-disable import/no-extraneous-dependencies */
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import { cn } from '../../../utils/cn';
import { type ColumnProps } from './@types';

export function Column({ id, step, label, scenes, count, children }: ColumnProps) {
  const { setNodeRef, active } = useDroppable({
    id,
    data: {
      step,
    },
  });

  if (!active) {
    return (
      <div
        ref={setNodeRef}
        className='flex flex-col gap-1 p-1.5 bg-secondary rounded-lg border border-border w-72 min-w-64 max-w-xs h-fit max-h-[calc(100vh-210px)] '
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-foreground'>{label}</h3>
          <span className='text-sm text-muted-foreground'>{count}</span>
        </div>

        <div className='flex flex-col gap-2 p-2 min-h-[200px] rounded-lg border border-border bg-background/50 overflow-auto'>
          {children}
        </div>
      </div>
    );
  }

  const isNextStep = active?.data.current?.step === step - 1;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-1 p-1.5 bg-secondary rounded-lg border border-border w-72 min-w-[16rem] max-w-xs h-fit transition-all duration-100',
        isNextStep || active?.data.current?.step === step
          ? 'border-primary bg-primary/5'
          : 'opacity-40 cursor-not-allowed',
      )}
    >
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium text-foreground'>{label}</h3>
        <span className='text-sm text-muted-foreground'>{count}</span>
      </div>

      <div className='flex flex-col gap-2 p-2 min-h-[200px] rounded-lg border border-border bg-background/50 overflow-auto'>
        <SortableContext items={scenes.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className='flex flex-col gap-2'>{children}</div>
        </SortableContext>
      </div>
    </div>
  );
}
