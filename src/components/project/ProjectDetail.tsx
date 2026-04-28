import React, { useCallback, useEffect, useRef } from 'react';
import { Project } from '../../types';
import { shareableURL, parseURLState } from '../../utils';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopyLink = useCallback(() => {
    const state = parseURLState();
    const url = shareableURL(state);
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  }, []);

  useEffect(() => {
    if (!project) return;

    // Focus on detail panel when opened
    if (panelRef.current) {
      panelRef.current.focus();
    }

    // Prevent body scroll when panel is open on mobile
    document.body.style.overflow = 'hidden';

    // Focus trap: keep focus within detail panel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [project, onClose]);

  if (!project) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 sm:w-96 bg-white shadow-lg sm:border-l border-gray-200 overflow-y-auto z-40 focus:outline-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 id="project-detail-title" className="text-lg sm:text-xl font-bold text-gray-900">
            Project Details
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close detail panel"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full text-xl font-light focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {project.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600">{project.description}</p>
          </section>

          <section className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
                role="status"
                aria-label={`Project status: ${project.status}`}
              >
                {project.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Owner
              </label>
              <p className="text-sm sm:text-base text-gray-700">{project.owner}</p>
            </div>
          </section>

          <section>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Updated
            </label>
            <time dateTime={project.updatedAt} className="text-sm sm:text-base text-gray-600">
              {new Date(project.updatedAt).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              )}
            </time>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Project tags">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  role="listitem"
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer action — pinned at bottom on mobile */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={handleCopyLink}
            className={`w-full px-4 py-3 sm:py-2 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              copySuccess
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
            }`}
            aria-label="Copy project URL to clipboard"
          >
            {copySuccess ? '✓ Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </aside>
    </>
  );
};
