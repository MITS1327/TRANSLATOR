import { create } from 'zustand';
import { PaginatedResponseDTO, apiTranslator } from 'shared/api';
import { Lang } from './model';

interface State {
  isLoading: boolean;
  error: string;
  langs: PaginatedResponseDTO<Lang>;
  getLangs: () => void;
  createLang: (payload: string) => void;
}

export const useLangStore = create<State>((set, get) => ({
  isLoading: false,
  error: null,
  langs: null,
  getLangs: async () => {
    set({ isLoading: true });
    try {
      const response = apiTranslator.getLangs();
      set({ langs: (await response)?.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  createLang: async (payload: string) => {
    set({ isLoading: true });
    try {
      await apiTranslator.createLang(payload);
      get().getLangs();
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
