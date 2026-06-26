export const queryKeys = {
  summaries: {
    all: ['summaries'] as const,
    list: (params?: Record<string, unknown>) => ['summaries', 'list', params] as const,
    detail: (id: string) => ['summaries', 'detail', id] as const,
  },
};
