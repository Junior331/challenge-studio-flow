export interface Actor {
  id: string;
  name: string;
  bio: string;
  scenes: string[];
}

export type ActorFormData = Omit<Actor, 'id' | 'scenes'>;
