interface Actor {
  id: string;
  name: string;
  bio: string;
  scenes: string[];
}

type ActorFormData = Omit<Actor, 'id' | 'scenes'>;

export type { Actor, ActorFormData };
