import { useEffect, useRef } from "react";

export function useManageFlashListScroll(
  listRef,
  rawParams: string,
  savedScrollOffset: number,
  navigationScrollOffset?: number
) {
  const previousImportantParamsRef = useRef<Record<string, string>>({});

  // Restore scroll on mount
  useEffect(() => {
    if (listRef.current) {
      const timeout = setTimeout(() => {
        const offsetToRestore =
          navigationScrollOffset >= 0
            ? navigationScrollOffset
            : savedScrollOffset >= 0
            ? savedScrollOffset
            : 0;

        listRef.current?.scrollToOffset({
          offset: offsetToRestore,
          animated: false,
        });
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [navigationScrollOffset, savedScrollOffset, listRef]);

  // Reset scroll if important query params change (ignore `page`)
  // useEffect(() => {
  //   const params = new URLSearchParams(rawParams);

  //   const importantParams: Record<string, string> = {};
  //   params.forEach((value, key) => {
  //     if (key !== "page") {
  //       importantParams[key] = value;
  //     }
  //   });

  //   const previousImportantParams = previousImportantParamsRef.current;

  //   const importantParamsChanged =
  //     Object.keys(importantParams).some(
  //       (key) => importantParams[key] !== previousImportantParams[key]
  //     ) ||
  //     Object.keys(previousImportantParams).some(
  //       (key) => importantParams[key] !== previousImportantParams[key]
  //     );

  //   if (importantParamsChanged && listRef.current) {
  //     listRef.current.scrollToOffset({
  //       offset: 0,
  //       animated: false,
  //     });
  //   }

  //   previousImportantParamsRef.current = importantParams;
  // }, [rawParams, listRef]);
}
