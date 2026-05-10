import { create } from 'zustand';
import { currentYearMonth } from '../utils/date';

interface AppStore {
  activeModal: string | null;
  selectedMonth: { year: number; month: number };
  setActiveModal: (modal: string | null) => void;
  setSelectedMonth: (year: number, month: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeModal: null,
  selectedMonth: currentYearMonth(),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setSelectedMonth: (year, month) => set({ selectedMonth: { year, month } }),
}));
