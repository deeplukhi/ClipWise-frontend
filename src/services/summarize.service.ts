import api from '@/lib/axios';
import type { ApiResponse } from '@/types';

export interface Summary {
  id: string;
  youtubeUrl: string;
  videoTitle: string | null;
  transcript: string | null;
  summary: string;
  keyPoints: string | null;
  motivational: string | null;
  timestamps: string | null;
  insight: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchResult {
  id: string;
  youtubeUrl: string;
  videoTitle: string | null;
  summary: string;
  rank: number;
}

export interface ShareLink {
  slug: string;
  url: string;
}

export const summarizeService = {
  async create(youtubeUrl: string): Promise<ApiResponse<{ jobId: string }>> {
    const res = await api.post<ApiResponse<{ jobId: string }>>('/summarize', { youtubeUrl });
    return res.data;
  },

  async generateFormat(id: string, format: string): Promise<ApiResponse<Summary>> {
    const res = await api.post<ApiResponse<Summary>>(`/summarize/${id}/generate`, { format });
    return res.data;
  },

  async list(params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<Summary>>> {
    const res = await api.get<ApiResponse<PaginatedResponse<Summary>>>('/summarize', { params });
    return res.data;
  },

  async getById(id: string): Promise<ApiResponse<Summary>> {
    const res = await api.get<ApiResponse<Summary>>(`/summarize/${id}`);
    return res.data;
  },

  async search(q: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<PaginatedResponse<SearchResult>>> {
    const res = await api.get<ApiResponse<PaginatedResponse<SearchResult>>>('/summarize/search', { params: { q, ...params } });
    return res.data;
  },

  async exportPdf(id: string): Promise<Blob> {
    const res = await api.get(`/summarize/export/${id}`, { params: { format: 'pdf' }, responseType: 'blob' });
    return res.data;
  },

  async exportMd(id: string): Promise<Blob> {
    const res = await api.get(`/summarize/export/${id}`, { params: { format: 'md' }, responseType: 'blob' });
    return res.data;
  },

  async remove(id: string): Promise<ApiResponse<void>> {
    const res = await api.delete<ApiResponse<void>>(`/summarize/${id}`);
    return res.data;
  },

  async createShare(id: string, pin?: string): Promise<ApiResponse<ShareLink>> {
    const res = await api.post<ApiResponse<ShareLink>>(`/summarize/${id}/share`, { pin });
    return res.data;
  },
};
