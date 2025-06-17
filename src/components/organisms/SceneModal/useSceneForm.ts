/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';

import { z } from 'zod';

import { type SceneDetails, sceneSchema } from './@types';

export function useSceneForm(initialData?: Partial<SceneDetails>) {
  const [formData, setFormData] = useState<SceneDetails>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    step: initialData?.step || 1,
    episode: initialData?.episode || '',
    recordDate: initialData?.recordDate || new Date().toISOString().split('T')[0],
    recordLocation: initialData?.recordLocation || '',
    columnId: initialData?.columnId || 'column-1',
    order: initialData?.order || 0,
    actors: initialData?.actors || [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SceneDetails, string>>>({});

  const validate = (): boolean => {
    try {
      sceneSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.formErrors.fieldErrors;
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = <K extends keyof SceneDetails>(field: K, value: SceneDetails[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    errors,
    formData,
    validate,
    handleChange,
  };
}
