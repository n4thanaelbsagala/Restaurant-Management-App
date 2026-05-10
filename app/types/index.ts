export enum OrderStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum MenuCategory {
  Starters = 'Starters',
  Mains = 'Mains',
  Drinks = 'Drinks',
  Desserts = 'Desserts',
}

export enum ResourceCategory {
  Ingredients = 'Ingredients',
  Equipment = 'Equipment',
  Packaging = 'Packaging',
}

export enum IncomeCategory {
  Sales = 'Sales',
  OtherIncome = 'Other Income',
}

export enum ExpenseCategory {
  Ingredients = 'Ingredients',
  Utilities = 'Utilities',
  Staff = 'Staff',
  Equipment = 'Equipment',
  Rent = 'Rent',
  Miscellaneous = 'Miscellaneous',
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  total: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  imageUri?: string;
  available: boolean;
}

export interface KitchenResource {
  id: string;
  name: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  category: string;
}

export type StockLevel = 'ok' | 'low' | 'empty';

// Navigation param lists
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetail: { orderId: string };
  Menu: undefined;
};

export type KitchenStackParamList = {
  KitchenList: undefined;
  ResourceDetail: { resourceId: string };
};

export type FinancesStackParamList = {
  FinancesList: undefined;
  EntryDetail: { entryId: string };
};

export type RootTabParamList = {
  Orders: undefined;
  Kitchen: undefined;
  Finances: undefined;
};
