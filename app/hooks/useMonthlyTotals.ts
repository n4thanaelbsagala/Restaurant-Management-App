import { useMemo } from 'react';
import { useFinanceStore } from '../stores/useFinanceStore';
import { useOrderStore } from '../stores/useOrderStore';
import { isInMonth } from '../utils/date';
import { calculateRevenue } from '../utils/calculations';
import { OrderStatus } from '../types';

export function useMonthlyTotals(year: number, month: number) {
  const entries = useFinanceStore((s) => s.entries);
  const orders = useOrderStore((s) => s.orders);

  return useMemo(() => {
    const monthEntries = entries.filter((e) => isInMonth(e.date, year, month));
    const income = monthEntries
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const expenses = monthEntries
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const monthOrders = orders.filter(
      (o) => o.status === OrderStatus.Completed && isInMonth(o.createdAt, year, month)
    );
    const revenue = calculateRevenue(monthOrders);

    return { income, expenses, revenue, net: revenue + income - expenses };
  }, [entries, orders, year, month]);
}
