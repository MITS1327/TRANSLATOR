import { create } from 'zustand';
import { PaginatedResponseDTO, apiTranslator } from 'shared/api';
import { CreateKeyPayload, UpdateCommentPayload, UpdateKeyValue } from 'shared/api/translator/types';
import { Key } from '.';

interface State {
  isLoading: boolean;
  error: string;
  keys: PaginatedResponseDTO<Key>;
  getKeys: (payload: any) => void;
  updateKeys: (payload: UpdateKeyValue, getKeysPayload: any) => void;
  createKey: (payload: CreateKeyPayload, getKeysPayload: any) => void;
  updateComment: (payload: UpdateCommentPayload, getKeysPayload: any) => void;
}

export const useKeyStore = create<State>((set, get) => ({
  isLoading: false,
  error: null,
  keys: null,
  getKeys: async (payload) => {
    set({ isLoading: true });
    try {
      const response = apiTranslator.getKeys(payload);
      set({ keys: (await response)?.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateKeys: async (payload, getKeysPayload) => {
    set({ isLoading: true });
    try {
      await apiTranslator.updateKey(payload);
      get().getKeys(getKeysPayload);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  createKey: async (payload, getKeysPayload) => {
    set({ isLoading: true });
    try {
      await apiTranslator.createKey(payload);
      get().getKeys(getKeysPayload);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateComment: async (payload, getKeysPayload) => {
    set({ isLoading: true });
    try {
      await apiTranslator.updateComment(payload);
      get().getKeys(getKeysPayload);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
