import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KitchenResource } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { generateId } from '../utils/helpers';

interface KitchenStore {
  resources: KitchenResource[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addResource: (data: Omit<KitchenResource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<Omit<KitchenResource, 'id'>>) => void;
  deleteResource: (id: string) => void;
}

export const useKitchenStore = create<KitchenStore>((set, get) => ({
  resources: [],
  hydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.KITCHEN_RESOURCES);
    set({
      resources: raw ? (JSON.parse(raw) as KitchenResource[]) : [],
      hydrated: true,
    });
  },

  addResource: (data) => {
    const resource: KitchenResource = { id: generateId(), ...data };
    const resources = [...get().resources, resource];
    set({ resources });
    AsyncStorage.setItem(STORAGE_KEYS.KITCHEN_RESOURCES, JSON.stringify(resources));
  },

  updateResource: (id, updates) => {
    const resources = get().resources.map((r) => (r.id === id ? { ...r, ...updates } : r));
    set({ resources });
    AsyncStorage.setItem(STORAGE_KEYS.KITCHEN_RESOURCES, JSON.stringify(resources));
  },

  deleteResource: (id) => {
    const resources = get().resources.filter((r) => r.id !== id);
    set({ resources });
    AsyncStorage.setItem(STORAGE_KEYS.KITCHEN_RESOURCES, JSON.stringify(resources));
  },
}));
