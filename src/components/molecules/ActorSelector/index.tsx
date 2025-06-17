import { useState } from 'react';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { type Actor } from '../../../types/actor';
import { cn } from '../../../utils/cn';

interface ActorSelectorProps {
  actors: Actor[];
  selectedActors: string[];
  onSelect: (actorIds: string[]) => void;
}

export function ActorSelector({ actors, selectedActors, onSelect }: ActorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActors = actors.filter(
    (actor) =>
      actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actor.bio.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedActorsData = actors.filter((actor) => selectedActors.includes(actor.id));

  const toggleActor = (actorId: string) => {
    const newSelected = selectedActors.includes(actorId)
      ? selectedActors.filter((id) => id !== actorId)
      : [...selectedActors, actorId];
    onSelect(newSelected);
  };

  return (
    <div className='relative'>
      <div className='flex flex-wrap gap-2 p-2 border rounded-md bg-background'>
        {selectedActorsData.map((actor) => (
          <div
            key={actor.id}
            className='flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm'
          >
            <span>{actor.name}</span>
            <button
              type='button'
              onClick={() => toggleActor(actor.id)}
              className='hover:text-destructive'
              aria-label={`Remove ${actor.name}`}
            >
              <X className='h-3 w-3' />
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center gap-2 px-2 py-1 text-sm text-primary/70 hover:text-primary'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
        >
          <span>Adicionar Atores</span>
          <ChevronsUpDown className='h-4 w-4' />
        </button>
      </div>

      {isOpen && (
        <div
          className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg'
          role='listbox'
        >
          <div className='p-2 border-b'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search actors...'
              className='w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50'
              aria-label='Search actors'
            />
          </div>
          <div className='max-h-48 overflow-y-auto'>
            {filteredActors.map((actor) => (
              <button
                key={actor.id}
                type='button'
                onClick={() => toggleActor(actor.id)}
                className={cn(
                  'flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-primary/10',
                  selectedActors.includes(actor.id) && 'bg-primary/5',
                )}
                role='option'
                aria-selected={selectedActors.includes(actor.id)}
              >
                <Check
                  className={cn(
                    'h-4 w-4',
                    selectedActors.includes(actor.id) ? 'text-primary' : 'text-transparent',
                  )}
                />
                <div className='flex flex-col items-start'>
                  <span>{actor.name}</span>
                  <span className='text-xs text-primary/50'>{actor.bio}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
