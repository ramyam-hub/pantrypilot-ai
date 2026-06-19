import { PantryItem, Category, Unit } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const STORAGE_KEY = 'pantrypilot_items';

export function getItems(): PantryItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const seedItems = generateSeedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedItems));
    return seedItems;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveItems(items: PantryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addItem(item: Omit<PantryItem, 'id' | 'createdAt'>): PantryItem {
  const items = getItems();
  const newItem: PantryItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveItems(items);
  return newItem;
}

export function updateItem(id: string, updates: Partial<PantryItem>): PantryItem | null {
  const items = getItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  saveItems(items);
  return items[index];
}

export function deleteItem(id: string): void {
  const items = getItems();
  const filtered = items.filter(item => item.id !== id);
  saveItems(filtered);
}

function generateSeedData(): PantryItem[] {
  const today = new Date();
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  const createItem = (
    name: string,
    category: Category,
    quantity: number,
    unit: Unit,
    expiryDays: number | null,
    threshold: number
  ): PantryItem => ({
    id: generateId(),
    name,
    category,
    quantity,
    unit,
    purchaseDate: addDays(today, 0),
    expiryDate: expiryDays !== null ? addDays(today, expiryDays) : undefined,
    lowStockThreshold: threshold,
    notes: '',
    createdAt: new Date().toISOString(),
  });

  return [
    createItem('Milk', 'Food', 1, 'L', 5, 2),
    createItem('Rice', 'Food', 5, 'kg', 180, 1),
    createItem('Dish Soap', 'Cleaning', 1, 'bottles', null, 1),
    createItem('Shampoo', 'Personal Care', 2, 'bottles', null, 1),
    createItem('Eggs', 'Food', 4, 'pieces', 10, 6),
  ];
}
