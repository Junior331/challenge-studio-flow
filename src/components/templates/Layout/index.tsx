import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Header, Sidebar } from '../../organisms';
import { useScenes } from '../../../contexts/scenes';
import { type Scene } from '../../../reducers/scenes';

export function Layout() {
  const { scenes } = useScenes();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredScenes = useMemo(() => {
    if (!searchTerm.trim()) return scenes;

    const searchLower = searchTerm.toLowerCase();
    return scenes.filter(
      (scene: Scene) =>
        scene.title.toLowerCase().includes(searchLower) ||
        scene.description.toLowerCase().includes(searchLower) ||
        scene.episode.toLowerCase().includes(searchLower) ||
        scene.recordLocation.toLowerCase().includes(searchLower),
    );
  }, [scenes, searchTerm]);

  return (
    <div className='flex h-screen flex-col'>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-hidden p-2'>
          <Outlet context={{ filteredScenes }} />
        </main>
      </div>
    </div>
  );
}
