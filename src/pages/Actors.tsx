import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '../components/atoms';
import { ActorModal } from '../components/organisms';
import { useProduction } from '../hooks/useProduction';
import { api } from '../services/api';
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
      const data = (await api.actors.getAll()) as Actor[];
      setActors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (actorData: ActorFormData) => {
    try {
      const newActor = {
        ...actorData,
        id: actors.length.toString(),
        scenes: [],
      };

      await api.actors.create(newActor);
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
            className='group relative border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='flex items-start justify-between gap-2'>
              <div className='flex-1'>
                <h2 className='text-xl font-semibold mb-2'>{actor.name}</h2>
                <p className='text-gray-600 mb-2'>{actor.bio}</p>
                <p className='text-sm text-gray-500'>Cenas: {actor.scenes.length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ActorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode='create'
      />
    </div>
  );
}
