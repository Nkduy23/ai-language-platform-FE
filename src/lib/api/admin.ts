// Admin API — chỉ gọi được khi user.role === "ADMIN"
import apiClient from "./client";
import type { AdminStats, AdminUserItem, PaginatedResponse } from "@/types";

export const adminApi = {
  getStats: async () => {
    const res = await apiClient.get<AdminStats>("/admin/stats");
    return res.data;
  },

  listUsers: async (page = 1, search?: string) => {
    const res = await apiClient.get<PaginatedResponse<AdminUserItem>>("/admin/users", { params: { page, search } });
    return res.data;
  },

  toggleUserActive: async (id: string) => {
    const res = await apiClient.patch(`/admin/users/${id}/toggle-active`);
    return res.data;
  },

  // Blog CMS — dùng chung endpoint content module (đã có sẵn RolesGuard admin)
  listAllBlogPosts: async (page = 1) => {
    const res = await apiClient.get("/content/blog/admin/all", { params: { page } });
    return res.data;
  },

  createBlogPost: async (data: { title: string; excerpt: string; content: string; language: string; coverImage?: string; isPublished?: boolean }) => {
    const res = await apiClient.post("/content/blog", data);
    return res.data;
  },

  updateBlogPost: async (id: string, data: Partial<{ title: string; excerpt: string; content: string; isPublished: boolean }>) => {
    const res = await apiClient.patch(`/content/blog/${id}`, data);
    return res.data;
  },
};
