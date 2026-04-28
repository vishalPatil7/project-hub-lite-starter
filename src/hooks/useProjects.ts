import { useState, useEffect } from 'react';
import { Project } from '../types';
import projects from '../data/projects.json';

interface UseProjectsOptions {
  simulateDelay?: number;
  simulateError?: boolean;
}

export function useProjects(options?: UseProjectsOptions) {
  const [data, setData] = useState<Project[]>(projects as Project[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!options?.simulateDelay && !options?.simulateError) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (options.simulateError) {
        setError('Failed to load projects. Please try again.');
        setIsLoading(false);
      } else {
        setData(projects as Project[]);
        setIsLoading(false);
      }
    }, options.simulateDelay || 500);

    return () => clearTimeout(timer);
  }, [options?.simulateDelay, options?.simulateError]);

  return { data, isLoading, error };
}
