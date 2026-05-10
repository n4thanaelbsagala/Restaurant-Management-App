import { Order, OrderItem, OrderStatus, KitchenResource, FinanceEntry, StockLevel } from '../types';

export function calculateOrderTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getStockLevel(resource: KitchenResource): StockLevel {
  if (resource.quantity <= 0) return 'empty';
  if (resource.quantity <= resource.lowStockThreshold) return 'low';
  return 'ok';
}

export function calculateRevenue(orders: Order[]): number {
  return orders
    .filter((o) => o.status === OrderStatus.Completed)
    .reduce((sum, o) => sum + o.total, 0);
}

export function calculateFinanceTotals(entries: FinanceEntry[]): {
  income: number;
  expenses: number;
  net: number;
} {
  const income = entries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const expenses = entries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  return { income, expenses, net: income - expenses };
}
