import {type ReactNode} from "react"

interface QuickLink {
  label: string
  count?: number
  onClick?: () => void
}

interface CardFooter {
  label: string
  onClick?: () => void
}

interface CardProps {
  icon: ReactNode
  title: string
  subtitle?: string
  quickLinks?: QuickLink[]
  footer?: CardFooter
  className?: string
}

export function Card({icon, title, subtitle, quickLinks = [], footer, className = ""}: CardProps) {
  return (
    <div
      className={`bg-[#232329] rounded-lg shadow p-4 flex flex-col gap-2 min-w-[260px] max-w-xs ${className}`}
    >
      <div className='flex items-start gap-3'>
        <div className='mt-1 text-2xl text-white'>{icon}</div>
        <div className='flex-1 min-w-0'>
          <div
            className='font-semibold text-white text-ellipsis overflow-hidden whitespace-nowrap text-base'
            title={title}
          >
            {title}
          </div>
          {subtitle && (
            <div className='text-xs text-zinc-400 leading-tight truncate' title={subtitle}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {quickLinks.length > 0 && (
        <div className='mt-2'>
          <div className='text-xs text-zinc-300 font-medium mb-1'>Links rápidos</div>
          <ul className='flex flex-col gap-1'>
            {quickLinks.map(link => (
              <li
                key={link.label}
                className='flex items-center justify-between text-sm text-zinc-100 cursor-pointer hover:underline'
                onClick={link.onClick}
              >
                {link.label}
                {link.count !== undefined && (
                  <span className='ml-2 bg-zinc-700 text-xs rounded-full px-2 py-0.5 text-zinc-200 font-semibold'>
                    {link.count}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {footer && <div className='border-t border-zinc-700 my-2' />}
      {footer && (
        <button
          className='flex items-center justify-between w-full text-xs text-zinc-300 py-1 px-2 rounded hover:bg-zinc-800 transition'
          onClick={footer.onClick}
        >
          {footer.label}
          <svg
            className='ml-1 w-4 h-4'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
          </svg>
        </button>
      )}
    </div>
  )
}
