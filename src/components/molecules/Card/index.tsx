import { type CardProps, type HeaderProps } from './@types';
import { CardFooter } from './footer';
import { QuickLinks } from './quickLinks';

function CardHeader({ icon, title, subtitle }: HeaderProps) {
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

export function Card({
  icon,
  title,
  footer,
  subtitle,
  className = '',
  quickLinks = [],
}: CardProps) {
  return (
    <div
      className={`bg-[#232329] rounded-lg shadow p-4 flex flex-col gap-2 min-w-[260px] max-w-xs ${className}`}
    >
      <CardHeader icon={icon} title={title} subtitle={subtitle} />
      <QuickLinks links={quickLinks} />
      <CardFooter footer={footer} />
    </div>
  );
}
