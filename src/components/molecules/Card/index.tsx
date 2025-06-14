import { type CardProps } from './@types';
import { CardFooter } from './footer';
import { CardHeader } from './header';
import { QuickLinks } from './quickLinks';

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
