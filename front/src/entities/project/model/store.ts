import { create } from 'zustand';
import { PaginatedResponseDTO, apiTranslator } from 'shared/api';
import { CreateProjectPayload } from 'shared/api/translator/types';
import { Project } from '.';

interface State {
  isLoading: boolean;
  error: string;
  projects: PaginatedResponseDTO<Project>;
  getProjects: (payload?: any) => void;
  createProject: (payload: CreateProjectPayload) => void;
}

export const useProjectStore = create<State>((set, get) => ({
  isLoading: false,
  error: null,
  projects: null,
  getProjects: async (payload) => {
    set({ isLoading: true });
    try {
      const response = apiTranslator.getProjects(payload);
      set({ projects: (await response)?.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  createProject: async (payload) => {
    set({ isLoading: true });
    try {
      await apiTranslator.createProject(payload);
      get().getProjects();
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
