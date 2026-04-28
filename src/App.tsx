import React, { useMemo, useCallback } from 'react';
import { useUrlState, useDebounce, useProjects } from './hooks';
import { filterProjects } from './utils';
import {
  ProjectList,
  ProjectDetail,
  SearchBar,
} from './components/project';
import { FilterPanel } from './components/filters';
import './App.css';

export const App: React.FC = () => {
  // URL state management
  const {
    q,
    status,
    tag,
    selected,
    setQuery,
    setStatus,
    setTag,
    setSelected,
  } = useUrlState();

  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  // Debounced search
  const debouncedQuery = useDebounce(q, 300);

  // Load projects
  const { data: projects, isLoading, error } = useProjects();

  // Get unique tags for filter options
  const availableTags = useMemo(() => {
    return Array.from(new Set(projects.flatMap((p) => p.tags))).sort();
  }, [projects]);

  // Filter projects based on debounced query + filters (AND logic)
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, debouncedQuery, status, tag);
  }, [projects, debouncedQuery, status, tag]);

  // Get selected project
  const selectedProject = projects.find((p) => p.id === selected) || null;

  // Check empty state
  const isEmpty = !isLoading && filteredProjects.length === 0;

  // Check if filters are active
  const hasActiveFilters = !!(q || status || tag);

  // Reset all filters
  const handleResetFilters = useCallback(() => {
    setQuery('');
    setStatus('');
    setTag('');
  }, [setQuery, setStatus, setTag]);

  // Toggle mobile filters
  const toggleMobileFilters = useCallback(() => {
    setShowMobileFilters((prev) => !prev);
  }, []);

  const closeMobileFilters = useCallback(() => {
    setShowMobileFilters(false);
  }, []);

  // Count active filters for badge
  const activeFilterCount = [status, tag].filter(Boolean).length + (q ? 1 : 0);

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Project Hub Lite
            </h1>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Filters Active
                </span>
              )}
              {/* Mobile filter toggle button */}
              <button
                onClick={toggleMobileFilters}
                className="sm:hidden relative px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Toggle filters"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <SearchBar
            query={q}
            onQueryChange={setQuery}
          />
          {error && (
            <div
              role="alert"
              className="mt-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
            {/* Mobile filter overlay backdrop */}
            {showMobileFilters && (
              <div
                className="fixed inset-0 bg-black/20 z-20 sm:hidden"
                onClick={closeMobileFilters}
                aria-hidden="true"
              />
            )}

            {/* Left sidebar - filters */}
            <aside
              className={`${
                showMobileFilters
                  ? 'fixed inset-x-0 bottom-0 z-30 rounded-t-xl shadow-lg max-h-[70vh] overflow-y-auto animate-slide-up'
                  : 'hidden'
              } sm:relative sm:block sm:w-48 md:w-52 sm:rounded-lg sm:max-h-none sm:shadow-none sm:animate-none bg-white border border-gray-200 p-4 sm:overflow-y-auto sm:flex-shrink-0`}
              aria-label="Filter controls"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-0">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Filters
                </h2>
                <button
                  onClick={closeMobileFilters}
                  className="sm:hidden p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* Drag handle for mobile */}
              <div className="sm:hidden flex justify-center mb-3">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
              <FilterPanel
                status={status}
                onStatusChange={setStatus}
                tag={tag}
                onTagChange={setTag}
                availableTags={availableTags}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
              />
            </aside>

            {/* Middle - project list */}
            <section
              className="flex-1 bg-white rounded-lg border border-gray-200 p-3 sm:p-4 overflow-y-auto min-h-0"
              aria-label="Project list view"
            >
              <ProjectList
                projects={filteredProjects}
                selectedId={selected}
                onSelectProject={setSelected}
                isLoading={isLoading}
                isEmpty={isEmpty}
              />
            </section>
          </div>
        </div>
      </main>

      {/* Right sidebar - project detail (overlay on mobile) */}
      <ProjectDetail
        project={selectedProject}
        onClose={() => setSelected('')}
      />
    </div>
  );
};

export default App;
