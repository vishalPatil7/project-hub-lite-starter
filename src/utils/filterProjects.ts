import { Project, ProjectStatus } from '../types';

export function filterProjects(
  projects: Project[],
  query: string,
  status: ProjectStatus | '',
  tag: string
): Project[] {
  return projects.filter((project) => {
    // Search filter (title + description)
    if (query) {
      const lowerQuery = query.toLowerCase();
      const matchesQuery =
        project.title.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery);
      if (!matchesQuery) return false;
    }

    // Status filter
    if (status && project.status !== status) {
      return false;
    }

    // Tag filter
    if (tag && !project.tags.includes(tag)) {
      return false;
    }

    return true;
  });
}
