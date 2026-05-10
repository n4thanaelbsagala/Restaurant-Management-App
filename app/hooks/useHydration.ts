import { useOrderStore } from '../stores/useOrderStore';
import { useKitchenStore } from '../stores/useKitchenStore';
import { useFinanceStore } from '../stores/useFinanceStore';

export function useHydration(): boolean {
  const ordersHydrated = useOrderStore((s) => s.hydrated);
  const kitchenHydrated = useKitchenStore((s) => s.hydrated);
  const financeHydrated = useFinanceStore((s) => s.hydrated);
  return ordersHydrated && kitchenHydrated && financeHydrated;
}
