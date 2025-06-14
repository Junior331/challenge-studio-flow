import { cn } from '../../../lib/utils';
import { type CardProps } from './@types';

export function Card({ icon, title, subtitle, quickLinks, className }: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border border-border bg-background p-4 shadow-sm',
        className,
      )}
    >
      <div className='flex items-center gap-4'>
        {icon && <div className='text-primary'>{icon}</div>}
        <div className='flex flex-col gap-1'>
          <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
          {subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
        </div>
      </div>

      {quickLinks && quickLinks.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={link.onClick}
              className='rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90'
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
