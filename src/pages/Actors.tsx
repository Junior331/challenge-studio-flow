import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '../components/atoms';
import { Modal } from '../components/molecules/Modal';
import { useProduction } from '../hooks/useProduction';
import { type Actor, type ActorFormData } from '../types/actor';

export function Actors() {
  const { selectedProduction } = useProduction();
  const [isLoading, setIsLoading] = useState(true);
  const [actors, setActors] = useState<Actor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    try {
      const response = await fetch('http://localhost:3001/actors');
      if (!response.ok) throw new Error('Failed to fetch actors');
      const data = await response.json();
      setActors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (actorData: ActorFormData) => {
    try {
      const response = await fetch('http://localhost:3001/actors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...actorData, scenes: [] }),
      });
      if (!response.ok) throw new Error('Failed to create actor');
      await fetchActors();
      setIsModalOpen(false);
    } catch (err) {
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  };

  if (isLoading) return <div className='p-4'>Loading...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Atores</h1>
        <Button
          className='h-9 px-4 md:px-6'
          disabled={!selectedProduction}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className='h-4 w-4 md:mr-2' />
          <span className='hidden md:inline'>Adicionar Ator</span>
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {actors.map((actor) => (
          <div
            key={actor.id}
            className='border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
          >
            <h2 className='text-xl font-semibold mb-2'>{actor.name}</h2>
            <p className='text-gray-600 mb-2'>{actor.bio}</p>
            <p className='text-sm text-gray-500'>Cenas: {actor.scenes.length}</p>
          </div>
        ))}
      </div>

      <Modal
        type='actor'
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode='create'
      />
    </div>
  );
}
