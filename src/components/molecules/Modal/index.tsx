/* eslint-disable import/no-extraneous-dependencies */
import { type Actor, type ActorFormData } from '../../../types/actor';
import { type ModalProps } from './@types';
import { ActorModal } from './ActorModal';
import { SceneModal } from './SceneModal';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
}

interface SceneModalProps extends BaseModalProps {
  type: 'scene';
  scene?: ModalProps['scene'];
  scenes?: ModalProps['scenes'];
  onUpdate: ModalProps['onUpdate'];
}

interface ActorModalProps extends BaseModalProps {
  type: 'actor';
  actor?: Actor;
  onSave: (actor: ActorFormData) => Promise<void>;
}

type ModalComponentProps = SceneModalProps | ActorModalProps;

export function Modal(props: ModalComponentProps) {
  if (props.type === 'actor') {
    return <ActorModal {...props} />;
  }
  if (props.type === 'scene') {
    return <SceneModal {...props} />;
  }
  return null;
}
