import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, MenuItem, OrderStatus, OrderItem } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { generateId } from '../utils/helpers';
import { calculateOrderTotal } from '../utils/calculations';

interface OrderStore {
  orders: Order[];
  menuItems: MenuItem[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  // Order actions
  addOrder: (data: { tableNumber: string; items: OrderItem[] }) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  // Menu item actions
  addMenuItem: (data: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<Omit<MenuItem, 'id'>>) => void;
  deleteMenuItem: (id: string) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  menuItems: [],
  hydrated: false,

  hydrate: async () => {
    const [ordersRaw, menuRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.ORDERS),
      AsyncStorage.getItem(STORAGE_KEYS.MENU_ITEMS),
    ]);
    set({
      orders: ordersRaw ? (JSON.parse(ordersRaw) as Order[]) : [],
      menuItems: menuRaw ? (JSON.parse(menuRaw) as MenuItem[]) : [],
      hydrated: true,
    });
  },

  addOrder: (data) => {
    const newOrder: Order = {
      id: generateId(),
      tableNumber: data.tableNumber,
      items: data.items,
      status: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
      total: calculateOrderTotal(data.items),
    };
    const orders = [...get().orders, newOrder];
    set({ orders });
    AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  updateOrderStatus: (id, status) => {
    const orders = get().orders.map((o) => (o.id === id ? { ...o, status } : o));
    set({ orders });
    AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  deleteOrder: (id) => {
    const orders = get().orders.filter((o) => o.id !== id);
    set({ orders });
    AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  addMenuItem: (data) => {
    const item: MenuItem = { id: generateId(), ...data };
    const menuItems = [...get().menuItems, item];
    set({ menuItems });
    AsyncStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  },

  updateMenuItem: (id, updates) => {
    const menuItems = get().menuItems.map((m) => (m.id === id ? { ...m, ...updates } : m));
    set({ menuItems });
    AsyncStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  },

  deleteMenuItem: (id) => {
    const menuItems = get().menuItems.filter((m) => m.id !== id);
    set({ menuItems });
    AsyncStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  },
}));
