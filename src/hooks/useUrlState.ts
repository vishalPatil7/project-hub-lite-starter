import { useEffect, useState } from 'react';
import { URLState, ProjectStatus } from '../types';
import { parseURLState, updateURLState } from '../utils/queryParams';

export function useUrlState() {
  const [state, setState] = useState<URLState>(() => parseURLState());

  const updateState = (newState: Partial<URLState>) => {
    setState((prev) => {
      const updated = { ...prev, ...newState };
      updateURLState(updated);
      return updated;
    });
  };

  useEffect(() => {
    const handlePopState = () => {
      setState(parseURLState());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    q: state.q,
    status: state.status as ProjectStatus | '',
    tag: state.tag,
    selected: state.selected,
    setQuery: (q: string) => updateState({ q }),
    setStatus: (status: ProjectStatus | '') => updateState({ status }),
    setTag: (tag: string) => updateState({ tag }),
    setSelected: (selected: string) => updateState({ selected }),
  };
}
