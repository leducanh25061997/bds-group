import { RefObject } from 'react';

import useEventListener from './useEventListener';

type Handler = (event: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  optionalRef?: RefObject<any>,
): void {
  useEventListener('mousedown', (event: MouseEvent) => {
    const el = ref?.current;
    const optionalEl = optionalRef?.current;

    // Do nothing if clicking ref's element or descendent elements
    if (
      !el ||
      el.contains(event.target as Node) ||
      optionalEl?.contains(event.target as Node)
    ) {
      return;
    }

    handler(event);
  });
}

export default useOnClickOutside;
