import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '../components/atoms';
import { useProduction } from '../hooks/useProduction';
import { type Actor, type ActorFormData } from '../types/actor';

export function Actors() {
  const { selectedProduction } = useProduction();
  const [isLoading, setIsLoading] = useState(true);
  const [actors, setActors] = useState<Actor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newActor, setNewActor] = useState<ActorFormData>({ name: '', bio: '' });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/actors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newActor, scenes: [] }),
      });
      if (!response.ok) throw new Error('Failed to create actor');
      await fetchActors();
      setIsModalOpen(false);
      setNewActor({ name: '', bio: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-background p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>Adicionar Novo Ator</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Nome</label>
                <input
                  type='text'
                  value={newActor.name}
                  onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                  className='w-full p-2 border rounded'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-1'>Biografia</label>
                <textarea
                  value={newActor.bio}
                  onChange={(e) => setNewActor({ ...newActor, bio: e.target.value })}
                  className='w-full p-2 border rounded'
                  rows={3}
                  required
                />
              </div>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 border rounded hover:bg-gray-100'
                >
                  Cancelar
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
