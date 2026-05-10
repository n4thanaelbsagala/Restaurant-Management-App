import { useKitchenStore } from '../stores/useKitchenStore';
import { getStockLevel } from '../utils/calculations';

export function useLowStockAlert(): { lowCount: number; emptyCount: number } {
  const resources = useKitchenStore((s) => s.resources);
  let lowCount = 0;
  let emptyCount = 0;
  for (const r of resources) {
    const level = getStockLevel(r);
    if (level === 'empty') emptyCount++;
    else if (level === 'low') lowCount++;
  }
  return { lowCount, emptyCount };
}
