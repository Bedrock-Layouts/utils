import {
  ResizeFunc,
  init,
  registerCallback,
} from "@bedrock-layout/register-resize-callback";
import { useStatefulRef } from "@bedrock-layout/use-stateful-ref";
import { useEffect, useLayoutEffect, useRef } from "react";

export function useResizeObserver<T extends Element>(
  callback: ResizeFunc,
  node?: T,
): React.MutableRefObject<T> {
  const callbackRef = useRef<ResizeFunc>(callback);

  const nodeRef = useStatefulRef<T>();

  // eslint-disable-next-line functional/no-return-void
  useLayoutEffect(() => {
    // eslint-disable-next-line functional/immutable-data
    callbackRef.current = callback;
  });

  // eslint-disable-next-line functional/no-return-void
  useEffect(() => {
    init();
  }, []);

  const currentNode = nodeRef.current ?? node;

  useEffect(() => {
    init();

    /**
     * node is undefined when the component is unmounted or not yet mounted
     */
    /* c8 ignore start */
    const cleanup = currentNode
      ? registerCallback(currentNode, callbackRef)
      : () => 0;
    /* c8 ignore end */

    // eslint-disable-next-line functional/no-return-void
    return () => {
      cleanup();
    };
  }, [currentNode]);

  return nodeRef;
}
