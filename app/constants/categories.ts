import { MenuCategory, ResourceCategory, IncomeCategory, ExpenseCategory } from '../types';

export const MENU_CATEGORIES = Object.values(MenuCategory);
export const RESOURCE_CATEGORIES = Object.values(ResourceCategory);
export const INCOME_CATEGORIES = Object.values(IncomeCategory);
export const EXPENSE_CATEGORIES = Object.values(ExpenseCategory);

export const RESOURCE_UNITS = [
  'kg', 'g', 'lbs', 'oz',
  'L', 'mL', 'gallons',
  'pieces', 'packs', 'boxes', 'bottles', 'cans', 'bags',
  'dozen', 'units',
];

export const RESOURCE_CATEGORY_ICONS: Record<ResourceCategory, string> = {
  [ResourceCategory.Ingredients]: 'nutrition-outline',
  [ResourceCategory.Equipment]: 'construct-outline',
  [ResourceCategory.Packaging]: 'cube-outline',
};

export const MENU_CATEGORY_ICONS: Record<MenuCategory, string> = {
  [MenuCategory.Starters]: 'leaf-outline',
  [MenuCategory.Mains]: 'restaurant-outline',
  [MenuCategory.Drinks]: 'wine-outline',
  [MenuCategory.Desserts]: 'ice-cream-outline',
};
