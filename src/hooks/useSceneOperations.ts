/* eslint-disable import/no-extraneous-dependencies */
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useScenes } from '../contexts/scenes';
import { api } from '../services/api';
import { showErrorToast } from '../services/errorHandler';
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
        showErrorToast(error);
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
        showErrorToast(error);
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
      showErrorToast(error);
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
