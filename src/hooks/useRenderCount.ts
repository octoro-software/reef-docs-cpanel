import { useRef, useEffect } from "react";

export const useRenderCount = (label = "Render Count") => {
  const count = useRef(1);

  useEffect(() => {
    count.current += 1;
  });

  return count.current;
};
