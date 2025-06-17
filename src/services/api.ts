import { type Scene } from '../types/scene';

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  scenes: {
    getAll: async (): Promise<Scene[]> => {
      const response = await fetch(`${API_URL}/scenes`);
      if (!response.ok) throw new Error('Failed to fetch scenes');
      return response.json();
    },

    getById: async (id: string): Promise<Scene> => {
      const response = await fetch(`${API_URL}/scenes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch scene');
      return response.json();
    },

    create: async (scene: Scene): Promise<Scene> => {
      const response = await fetch(`${API_URL}/scenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scene),
      });
      if (!response.ok) throw new Error('Failed to create scene');
      return response.json();
    },

    update: async (scene: Scene): Promise<Scene> => {
      const response = await fetch(`${API_URL}/scenes/${scene.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scene),
      });
      if (!response.ok) throw new Error('Failed to update scene');
      return response.json();
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${API_URL}/scenes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete scene');
    },
  },

  actors: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/actors`);
      if (!response.ok) throw new Error('Failed to fetch actors');
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/actors/${id}`);
      if (!response.ok) throw new Error('Failed to fetch actor');
      return response.json();
    },

    create: async (actor: { name: string; bio: string }) => {
      const response = await fetch(`${API_URL}/actors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor),
      });
      if (!response.ok) throw new Error('Failed to create actor');
      return response.json();
    },

    update: async (id: string, actor: { name: string; bio: string }) => {
      const response = await fetch(`${API_URL}/actors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actor),
      });
      if (!response.ok) throw new Error('Failed to update actor');
      return response.json();
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/actors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete actor');
    },
  },
};
