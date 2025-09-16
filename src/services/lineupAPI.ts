import { apiService } from './apiService';

export const lineupAPI = {
  getAll: () => apiService.get<any[]>('/lineups'),
  getById: (id: string) => apiService.get<any>(`/lineups/${id}`),
  create: (lineup: any) => apiService.post<any>('/lineups', lineup),
  update: (id: string, lineup: any) => apiService.put<any>(`/lineups/${id}`, lineup),
  delete: (id: string) => apiService.delete<any>(`/lineups/${id}`)
};
