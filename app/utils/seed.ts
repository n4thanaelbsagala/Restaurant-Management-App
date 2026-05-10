import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import { MenuItem, KitchenResource, Order, OrderStatus, MenuCategory, ResourceCategory } from '../types';

const SEED_MENU: MenuItem[] = [
  {
    id: 'seed_menu_1',
    name: 'Margherita Pizza',
    price: 14.99,
    category: MenuCategory.Mains,
    available: true,
  },
  {
    id: 'seed_menu_2',
    name: 'Caesar Salad',
    price: 8.99,
    category: MenuCategory.Starters,
    available: true,
  },
  {
    id: 'seed_menu_3',
    name: 'Lemonade',
    price: 3.99,
    category: MenuCategory.Drinks,
    available: true,
  },
];

const SEED_RESOURCES: KitchenResource[] = [
  {
    id: 'seed_res_1',
    name: 'All-Purpose Flour',
    category: ResourceCategory.Ingredients,
    quantity: 5,
    unit: 'kg',
    lowStockThreshold: 2,
  },
  {
    id: 'seed_res_2',
    name: 'Olive Oil',
    category: ResourceCategory.Ingredients,
    quantity: 2,
    unit: 'L',
    lowStockThreshold: 0.5,
  },
  {
    id: 'seed_res_3',
    name: 'Paper Cups',
    category: ResourceCategory.Packaging,
    quantity: 150,
    unit: 'pieces',
    lowStockThreshold: 50,
  },
];

const now = new Date().toISOString();
const SEED_ORDERS: Order[] = [
  {
    id: 'seed_order_1',
    tableNumber: '5',
    items: [
      { menuItemId: 'seed_menu_1', name: 'Margherita Pizza', quantity: 1, unitPrice: 14.99 },
      { menuItemId: 'seed_menu_3', name: 'Lemonade', quantity: 2, unitPrice: 3.99 },
    ],
    status: OrderStatus.Pending,
    createdAt: now,
    total: 22.97,
  },
];

export async function seedDataIfNeeded(): Promise<void> {
  const seeded = await AsyncStorage.getItem(STORAGE_KEYS.SEEDED);
  if (seeded) return;

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.MENU_ITEMS, JSON.stringify(SEED_MENU)],
    [STORAGE_KEYS.KITCHEN_RESOURCES, JSON.stringify(SEED_RESOURCES)],
    [STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS)],
    [STORAGE_KEYS.FINANCE_ENTRIES, JSON.stringify([])],
    [STORAGE_KEYS.SEEDED, 'true'],
  ]);
}
