import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinanceEntry } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { generateId } from '../utils/helpers';
import { isInMonth } from '../utils/date';
import { calculateFinanceTotals } from '../utils/calculations';

interface FinanceStore {
  entries: FinanceEntry[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addEntry: (data: Omit<FinanceEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<FinanceEntry, 'id'>>) => void;
  deleteEntry: (id: string) => void;
  getMonthlyTotals: (
    year: number,
    month: number
  ) => { income: number; expenses: number; net: number };
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  entries: [],
  hydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FINANCE_ENTRIES);
    set({
      entries: raw ? (JSON.parse(raw) as FinanceEntry[]) : [],
      hydrated: true,
    });
  },

  addEntry: (data) => {
    const entry: FinanceEntry = { id: generateId(), ...data };
    const entries = [...get().entries, entry];
    set({ entries });
    AsyncStorage.setItem(STORAGE_KEYS.FINANCE_ENTRIES, JSON.stringify(entries));
  },

  updateEntry: (id, updates) => {
    const entries = get().entries.map((e) => (e.id === id ? { ...e, ...updates } : e));
    set({ entries });
    AsyncStorage.setItem(STORAGE_KEYS.FINANCE_ENTRIES, JSON.stringify(entries));
  },

  deleteEntry: (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    set({ entries });
    AsyncStorage.setItem(STORAGE_KEYS.FINANCE_ENTRIES, JSON.stringify(entries));
  },

  getMonthlyTotals: (year, month) => {
    const monthEntries = get().entries.filter((e) => isInMonth(e.date, year, month));
    return calculateFinanceTotals(monthEntries);
  },
}));
