import { Outlet } from 'react-router-dom';

import { Header, Sidebar } from '../../organisms';

export function Layout() {
  return (
    <div className='flex h-screen flex-col'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-hidden p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
