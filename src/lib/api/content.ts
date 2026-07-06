// Content/Blog API — public
import apiClient from "./client";
import type { BlogPostSummary, BlogPostDetail, PaginatedResponse } from "@/types";
import { API_ROUTES } from "@/lib/constants/routes";

export const contentApi = {
  listBlogPosts: async (language?: string, page = 1) => {
    const res = await apiClient.get<PaginatedResponse<BlogPostSummary>>(API_ROUTES.BLOG_POSTS, {
      params: { language, page },
    });
    return res.data;
  },

  getBlogPost: async (slug: string) => {
    const res = await apiClient.get<BlogPostDetail>(API_ROUTES.BLOG_POST_DETAIL(slug));
    return res.data;
  },
};
