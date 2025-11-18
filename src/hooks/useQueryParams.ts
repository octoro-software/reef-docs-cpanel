// hooks/useQueryParams.ts
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-native";

export const useQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTotalFilterCount = () => {
    const params = getParams();

    let count = 0;

    params.forEach((value, key) => {
      if (key === "filter") {
        count = value.split(",").length;
      }
    });

    return count;
  };

  const getParams = () => new URLSearchParams(location.search);

  const getParam = (key: string): string | null => {
    return getParams().get(key);
  };

  const setParam = (key: string, value: string | null, replace = false) => {
    const params = getParams();

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (!params.has("page")) {
      params.set("page", "1");
    }

    const queryString = `?${params.toString()}`;

    replace ? navigate(queryString, { replace: true }) : navigate(queryString);
  };

  const watchParam = (key: string): string | null => {
    const [value, setValue] = useState<string | null>(() => getParam(key));

    useEffect(() => {
      setValue(getParam(key));
    }, [location.search]);

    return value;
  };

  const setParams = (
    updates: Record<string, string | null>,
    replace = false
  ) => {
    const params = getParams();

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if (!params.has("page")) {
      params.set("page", "1");
    }

    const queryString = `?${params.toString()}`;
    replace ? navigate(queryString, { replace: true }) : navigate(queryString);
  };

  // Special filter param helpers
  const getFilterObject = (): Record<string, string> => {
    const filterString = getParam("filter") || "";
    const obj: Record<string, string> = {};

    filterString.split(",").forEach((pair) => {
      const [key, value] = pair.split(":");
      if (key && value) obj[key] = value;
    });

    return obj;
  };

  const setFilterParam = (
    key: string,
    value: string | null,
    replace = false
  ) => {
    const params = getParams();
    const filters = getFilterObject();

    if (value) {
      filters[key] = value;
    } else {
      delete filters[key];
    }

    const newFilterString = Object.entries(filters)
      .map(([k, v]) => `${k}:${v}`)
      .join(",");

    if (newFilterString) {
      params.set("filter", newFilterString);
    } else {
      params.delete("filter");
    }

    params.set("page", "1");

    const queryString = `?${params.toString()}`;
    replace ? navigate(queryString, { replace: true }) : navigate(queryString);
  };

  const clearParams = (keysToClear?: string | string[], replace = false) => {
    const params = getParams();
    if (!keysToClear) {
      const queryString = `?page=1`;

      return replace
        ? navigate(queryString, { replace: true })
        : navigate(queryString);
    }

    const keys = typeof keysToClear === "string" ? [keysToClear] : keysToClear;

    // Handle filter keys separately
    const filterString = params.get("filter") || "";
    const filters = filterString
      .split(",")
      .map((pair) => pair.split(":"))
      .filter(([key]) => key && !keys.includes(key)); // remove matching keys

    if (filters.length) {
      const newFilter = filters.map(([k, v]) => `${k}:${v}`).join(",");
      params.set("filter", newFilter);
    } else {
      params.delete("filter");
    }

    // Clear non-filter keys if any
    keys.forEach((key) => {
      if (key !== "filter") params.delete(key);
    });

    params.set("page", "1");

    const queryString = `?${params.toString()}`;
    replace ? navigate(queryString, { replace: true }) : navigate(queryString);
  };

  const deleteParam = (key: string, replace = false) => {
    const params = getParams();
    params.delete(key);

    if (!params.has("page")) {
      params.set("page", "1");
    }

    const queryString = `?${params.toString()}`;
    replace ? navigate(queryString, { replace: true }) : navigate(queryString);
  };

  return {
    getParams,
    getParam,
    setParam,
    setParams,
    setFilterParam,
    rawParams: location.search,
    getTotalFilterCount,
    getFilterObject,
    clearParams,
    watchParam,
    deleteParam,
  };
};
