import { selectAudience } from "../store/slices/userConfigSlice";
import { useAppSelector } from "./useRedux";

export const useAudience = (): {
  audience: "reef-docs" | "fresh-docs";
  isFresh: Boolean;
  isReef: Boolean;
} => {
  let audience = useAppSelector(selectAudience);

  if (!audience) {
    audience = "reef-docs";
  }

  const isFresh = audience === "fresh-docs";
  const isReef = audience === "reef-docs";

  return { audience, isFresh, isReef };
};
