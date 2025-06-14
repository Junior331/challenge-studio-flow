import { type HeaderProps } from './@types';

export function CardHeader({ icon, title, subtitle }: HeaderProps) {
  return (
    <div className='flex items-start gap-3'>
      <div className='mt-1 text-2xl text-white'>{icon}</div>
      <div className='flex-1 min-w-0'>
        <h3
          className='font-semibold text-white text-ellipsis overflow-hidden whitespace-nowrap text-base'
          title={title}
        >
          {title}
        </h3>
        {subtitle && (
          <p className='text-xs text-zinc-400 leading-tight truncate' title={subtitle}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
