import { Input } from '../../atoms/Input';

export function Header() {
  return (
    <header className='sticky top-0 z-50 flex items-center justify-between w-full gap-8 px-6 py-4 border-b border-border bg-background'>
      <div className='flex items-center gap-12'>
        <h1 className='text-xl font-semibold text-foreground'>StudioFlow</h1>
      </div>

      <div className='flex items-center gap-2 grow justify-center max-w-xl'>
        <Input placeholder='Pesquisar' className='grow' />
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-sm text-muted-foreground hidden md:block'>John Doe</span>
        <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium'>
          JD
        </div>
      </div>
    </header>
  );
}
