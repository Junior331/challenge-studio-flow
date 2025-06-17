import { type Scene } from '../types/scene';
import { AppError, errorMessages, handleError } from './errorHandler';

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new AppError(
      error.message || errorMessages.SERVER_ERROR,
      'API_ERROR',
      response.status,
      error,
    );
  }
  return response.json();
}

export const api = {
  scenes: {
    getAll: async (): Promise<Scene[]> => {
      try {
        const response = await fetch(`${API_URL}/scenes`);
        return handleResponse<Scene[]>(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    getById: async (id: string): Promise<Scene> => {
      try {
        const response = await fetch(`${API_URL}/scenes/${id}`);
        return handleResponse<Scene>(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    create: async (scene: Scene): Promise<Scene> => {
      try {
        const response = await fetch(`${API_URL}/scenes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scene),
        });
        return handleResponse<Scene>(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    update: async (scene: Scene): Promise<Scene> => {
      try {
        const response = await fetch(`${API_URL}/scenes/${scene.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scene),
        });
        return handleResponse<Scene>(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    delete: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/scenes/${id}`, {
          method: 'DELETE',
        });
        await handleResponse(response);
      } catch (error) {
        throw handleError(error);
      }
    },
  },

  actors: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/actors`);
        return handleResponse(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    getById: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/actors/${id}`);
        return handleResponse(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    create: async (actor: { name: string; bio: string }) => {
      try {
        const response = await fetch(`${API_URL}/actors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actor),
        });
        return handleResponse(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    update: async (id: string, actor: { name: string; bio: string }) => {
      try {
        const response = await fetch(`${API_URL}/actors/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actor),
        });
        return handleResponse(response);
      } catch (error) {
        throw handleError(error);
      }
    },

    delete: async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/actors/${id}`, {
          method: 'DELETE',
        });
        await handleResponse(response);
      } catch (error) {
        throw handleError(error);
      }
    },
  },
};
