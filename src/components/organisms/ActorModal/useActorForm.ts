/* eslint-disable import/no-extraneous-dependencies */
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { z } from 'zod';

const actorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(1, 'Bio is required'),
});

export type ActorFormData = z.infer<typeof actorSchema>;

export function useActorForm(initialData?: Partial<ActorFormData>) {
  const [formData, setFormData] = useState<ActorFormData>({
    bio: initialData?.bio || '',
    name: initialData?.name || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ActorFormData>>({});

  const validate = (): boolean => {
    try {
      actorSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.formErrors.fieldErrors;
        setErrors({
          name: newErrors.name?.[0],
          bio: newErrors.bio?.[0],
        });
      }
      return false;
    }
  };

  const handleChange = (field: keyof ActorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (onSave: (data: ActorFormData) => Promise<void>) => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast.success('Actor saved successfully!');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save actor');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}
