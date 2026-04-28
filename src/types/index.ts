export type ProjectStatus = 'active' | 'paused' | 'archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  updatedAt: string;
  tags: string[];
}

export interface FilterState {
  q: string;
  status: ProjectStatus | '';
  tag: string;
}

export interface URLState extends FilterState {
  selected: string | '';
}
