import { type QuickLink, type QuickLinksProps } from './@types';

function QuickLinkItem({ label, count, onClick }: QuickLink) {
  return (
    <li
      className='flex items-center justify-between text-sm text-zinc-100 cursor-pointer hover:underline'
      onClick={onClick}
    >
      {label}
      {count !== undefined && (
        <span className='ml-2 bg-zinc-700 text-xs rounded-full px-2 py-0.5 text-zinc-200 font-semibold'>
          {count}
        </span>
      )}
    </li>
  );
}

export function QuickLinks({ links }: QuickLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className='mt-2'>
      <div className='text-xs text-zinc-300 font-medium mb-1'>Links rápidos</div>
      <ul className='flex flex-col gap-1'>
        {links.map((link) => (
          <QuickLinkItem key={link.label} {...link} />
        ))}
      </ul>
    </div>
  );
}
