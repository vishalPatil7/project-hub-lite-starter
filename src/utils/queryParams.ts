import { URLState, ProjectStatus } from '../types';

export function parseURLState(): URLState {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get('q') || '',
    status: (params.get('status') as ProjectStatus) || '',
    tag: params.get('tag') || '',
    selected: params.get('selected') || '',
  };
}

export function updateURLState(state: URLState): void {
  const params = new URLSearchParams();

  if (state.q) params.set('q', state.q);
  if (state.status) params.set('status', state.status);
  if (state.tag) params.set('tag', state.tag);
  if (state.selected) params.set('selected', state.selected);

  const newUrl =
    params.toString() === ''
      ? window.location.pathname
      : `${window.location.pathname}?${params.toString()}`;

  window.history.replaceState(null, '', newUrl);
}

export function shareableURL(state: URLState): string {
  const params = new URLSearchParams();

  if (state.q) params.set('q', state.q);
  if (state.status) params.set('status', state.status);
  if (state.tag) params.set('tag', state.tag);
  if (state.selected) params.set('selected', state.selected);

  const queryString = params.toString();
  return queryString === ''
    ? window.location.origin + window.location.pathname
    : `${window.location.origin}${window.location.pathname}?${queryString}`;
}
