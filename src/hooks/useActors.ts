/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '../services/api';
import { type Actor } from '../types/actor';

export function useActors(actorIds: string[] = []) {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchActors = async () => {
      if (actorIds.length === 0) return;

      try {
        setIsLoading(true);
        const data = (await api.actors.getAll()) as Actor[];
        const filteredActors = data.filter((actor) => actorIds.includes(actor.id));
        setActors(filteredActors);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error fetching actors';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActors();
  }, [actorIds]);

  return { actors, isLoading };
}
