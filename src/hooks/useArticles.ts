import apiClient from "../api/apiClient";
import { ARTICLE_MENU } from "../constants/articles";
import {
  setArticleHistory,
  setFeaturedArticles,
} from "../store/slices/moreSlice";
import { useApiRequest } from "./useApiRequest";
import { useAudience } from "./useAudience";
import { useAppDispatch } from "./useRedux";

export const useGetArticleBySlug = () => {
  const handleGetArticleBySlug = async (slug: string) => {
    const response = await apiClient.get(`/articles/bySlug/${slug}`);

    return response;
  };

  return useApiRequest(handleGetArticleBySlug);
};

export const useGetFeaturedArticles = () => {
  const dispatch = useAppDispatch();

  const handleGetFeaturedArticles = async () => {
    const response = await apiClient.get("/articles/getFeaturedArticles");

    dispatch(setFeaturedArticles(response.data?.data));

    return response;
  };

  return useApiRequest(handleGetFeaturedArticles);
};

export const useGetArticleMenu = () => {
  const dispatch = useAppDispatch();

  const { isFresh } = useAudience();

  const fn = async () => {
    const menu = isFresh ? [] : ARTICLE_MENU;

    dispatch(setArticleHistory([menu]));
  };

  return [fn];
};
