import React from 'react';
import { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  selectedId: string | null;
  onSelectProject: (projectId: string) => void;
  isLoading: boolean;
  isEmpty: boolean;
}

export const ProjectList: React.FC<ProjectListProps> = React.memo(({
  projects,
  selectedId,
  onSelectProject,
  isLoading,
  isEmpty,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-gray-200 bg-white animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-100 rounded w-16"></div>
              <div className="h-6 bg-gray-100 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 sm:h-96 text-center px-4">
        <svg
          className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-base sm:text-lg font-semibold text-gray-600 mb-1">
          No projects found
        </p>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" role="list" aria-label="Project list">
      {projects.map((project) => (
        <li key={project.id} role="presentation">
          <button
            onClick={() => onSelectProject(project.id)}
            className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              selectedId === project.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100'
            }`}
            aria-current={selectedId === project.id ? 'true' : 'false'}
            aria-label={`${project.title}, ${project.status} status`}
          >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-0.5">
                {project.description}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                project.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {project.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
              >
              {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-gray-600">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
          </button>
        </li>
      ))}
    </ul>
  );
});
