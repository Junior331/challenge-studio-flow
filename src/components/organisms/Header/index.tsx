import { Plus } from 'lucide-react';

import { useScenes } from '../../../contexts/scenes';
import { useProduction } from '../../../hooks/useProduction';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { type SceneDetails } from '../../molecules/Modal/@types';

export function Header() {
  const { scenes, createScene } = useScenes();
  const { selectedProduction } = useProduction();

  const handleCreateScene = async () => {
    if (!selectedProduction) return;

    const newScene: SceneDetails = {
      step: 1,
      episode: '1',
      description: '',
      title: 'Nova Cena',
      recordLocation: '',
      columnId: 'column-1',
      id: (scenes.length + 1).toString(),
      recordDate: new Date().toISOString().split('T')[0],
    };

    await createScene(newScene);
  };

  return (
    <header className='sticky top-0 z-50 flex items-center justify-between w-full gap-8 px-6 py-4 border-b border-border bg-background'>
      <div className='flex items-center gap-12'>
        <h1 className='text-xl font-semibold text-foreground'>StudioFlow</h1>
      </div>

      <div className='flex items-center gap-2 grow justify-center max-w-xl'>
        <Input placeholder='Pesquisar' className='grow' />

        <Button
          onClick={handleCreateScene}
          disabled={!selectedProduction}
          className='h-9 px-4 md:px-6'
        >
          <Plus className='h-4 w-4 md:mr-2' />
          <span className='hidden md:inline'>Criar</span>
        </Button>
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
