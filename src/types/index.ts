export type Category = 'Food' | 'Beverages' | 'Cleaning' | 'Personal Care' | 'Medicines' | 'Other';

export type Unit = 'kg' | 'g' | 'L' | 'ml' | 'pieces' | 'bottles' | 'boxes' | 'packets' | 'cans';

export interface PantryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  purchaseDate: string;
  expiryDate?: string;
  lowStockThreshold: number;
  notes: string;
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  itemName: string;
  reason: 'low-stock' | 'expiring-soon';
  suggestedQuantity: number;
  purchased: boolean;
}
