import { type FooterProps } from './@types';

function ChevronDownIcon() {
  return (
    <svg
      className='ml-1 w-4 h-4'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      viewBox='0 0 24 24'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
    </svg>
  );
}

export function CardFooter({ footer }: FooterProps) {
  if (!footer) return null;

  return (
    <>
      <div className='border-t border-zinc-700 my-2' />
      <button
        className='flex items-center justify-between w-full text-xs text-zinc-300 py-1 px-2 rounded hover:bg-zinc-800 transition'
        onClick={footer.onClick}
      >
        {footer.label}
        <ChevronDownIcon />
      </button>
    </>
  );
}
