import { NavLink } from 'react-router-dom';

import { cn } from '../../../utils/cn';

const navigation = [
  {
    name: 'Studio',
    href: '/',
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-5 h-5'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
        />
      </svg>
    ),
  },
];

export function Sidebar() {
  return (
    <div className='flex h-full max-w-14 w-full md:max-w-64 flex-col border-r border-border bg-background'>
      <div className='flex h-14 items-center border-b border-border px-0.5 md:px-4'>
        <h2 className='text-lg font-semibold text-foreground'>Menu</h2>
      </div>
      <nav className='flex-1 space-y-1 px-2 py-4'>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            {item.icon}
            <span className='hidden md:block'>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
