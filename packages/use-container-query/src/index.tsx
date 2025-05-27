import { useForwardedRef } from "@bedrock-layout/use-forwarded-ref";
import { useResizeObserver } from "@bedrock-layout/use-resize-observer";
import React from "react";

interface UseContainerQueryProps {
  width?: number;
  maxWidth?: number;
}

export function useContainerQuery<T extends Element>(
  { width = 1, maxWidth }: Readonly<UseContainerQueryProps>,
  forwardedRef?: React.Ref<T>,
): [boolean, React.MutableRefObject<T>] {
  const [matches, setMatch] = React.useState(false);
  const containerRef = useForwardedRef(forwardedRef);

  useResizeObserver((entry: ResizeObserverEntry) => {
    //fix typings
    /* c8 ignore start */
    const nodeWidth =
      (entry.borderBoxSize as unknown as ResizeObserverSize)?.inlineSize ??
      entry.contentRect.width;
    /* c8 ignore end */
    //nodeWidth can be zero when it is switching from one node to another.  This will ignore that.
    if (nodeWidth > 0) {
      const newMatch =
        maxWidth === undefined
          ? nodeWidth <= width
          : nodeWidth >= width && nodeWidth <= maxWidth;

      setMatch(newMatch);
    }

    return entry;
  }, containerRef.current);

  return [matches, containerRef];
}
