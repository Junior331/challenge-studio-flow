/* eslint-disable import/no-extraneous-dependencies */
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useScenes } from '../contexts/scenes';
import { api } from '../services/api';
import { type Scene } from '../types/scene';

export const useSceneOperations = () => {
  const { scenes, updateScene: updateSceneContext, createScene: createSceneContext } = useScenes();

  const updateScene = useCallback(
    async (scene: Scene) => {
      try {
        const updatedScene = await api.scenes.update(scene);
        updateSceneContext(updatedScene);
        toast.success('Cena atualizada com sucesso!');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao atualizar a cena';
        toast.error(message);
        throw error;
      }
    },
    [updateSceneContext],
  );

  const createScene = useCallback(
    async (scene: Scene) => {
      try {
        const newScene = await api.scenes.create(scene);
        createSceneContext(newScene, scenes);
        toast.success('Cena criada com sucesso!');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao criar a cena';
        toast.error(message);
        throw error;
      }
    },
    [createSceneContext, scenes],
  );

  const deleteScene = useCallback(async (sceneId: string) => {
    try {
      await api.scenes.delete(sceneId);
      toast.success('Cena excluída com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir a cena';
      toast.error(message);
      throw error;
    }
  }, []);

  return {
    scenes,
    updateScene,
    createScene,
    deleteScene,
  };
};
