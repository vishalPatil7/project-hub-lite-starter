import React from 'react';
import { ProjectStatus } from '../../types';

interface FilterPanelProps {
  status: ProjectStatus | '';
  onStatusChange: (status: ProjectStatus | '') => void;
  tag: string;
  onTagChange: (tag: string) => void;
  availableTags: string[];
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = React.memo(({
  status,
  onStatusChange,
  tag,
  onTagChange,
  availableTags,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <fieldset className="space-y-4">
      <legend className="sr-only">Filter projects</legend>
      
      <div>
        <label
          htmlFor="status-filter"
          className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
        >
          Status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) =>
            onStatusChange((e.target.value as ProjectStatus) || '')
          }
          className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"
          aria-label="Filter projects by status"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="tag-filter"
          className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2"
        >
          Tag
        </label>
        <select
          id="tag-filter"
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-shadow"
          aria-label="Filter projects by tag"
        >
          <option value="">All Tags</option>
          {availableTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="w-full px-3 py-2.5 sm:py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Reset all filters"
        >
          Reset Filters
        </button>
      )}
    </fieldset>
  );
});
