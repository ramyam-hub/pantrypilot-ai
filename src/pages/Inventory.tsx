import React, { useState, useMemo, useEffect } from 'react';
import { Search, Trash2, Pencil, Package, AlertTriangle } from 'lucide-react';
import { PantryItem, Category } from '../types';
import { getItems, deleteItem } from '../data/items';
import { getDaysUntilExpiry, isLowStock, getExpiryStatus, getExpiryColor, categoryColors } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '../App';

const categories: Category[] = ['Food', 'Beverages', 'Cleaning', 'Personal Care', 'Medicines', 'Other'];

function ItemCard({ item, onDelete, onEdit }: { item: PantryItem; onDelete: (id: string) => void; onEdit: (id: string) => void }) {
  const expiryStatus = getExpiryStatus(item);
  const expiryColor = getExpiryColor(expiryStatus);
  const lowStock = isLowStock(item);
  const daysUntilExpiry = getDaysUntilExpiry(item);
  const catColor = categoryColors[item.category];

  const formatExpiry = () => {
    if (daysUntilExpiry === null) return 'No expiry';
    if (daysUntilExpiry < 0) return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    return `Expires in ${daysUntilExpiry} days`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate pr-2">{item.name}</h3>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${catColor.bg} ${catColor.text}`}>
            {item.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item.id)}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">{item.quantity}</span> {item.unit}
          </p>
          {item.expiryDate && (
            <p className={`text-sm ${expiryColor}`}>
              {formatExpiry()}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {lowStock && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              Low Stock
            </span>
          )}
          {expiryStatus === 'expired' && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
              Expired
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function Inventory() {
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    setItems(getItems());
  }, []);

  useEffect(() => {
    const handleFocus = () => setItems(getItems());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleDelete = (id: string) => {
    deleteItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
    showToast('Item deleted', 'delete');
  };

  const handleEdit = (id: string) => {
    navigate('edit', id);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white pt-12 pb-4 px-5 sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-[430px] mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Pantry</h1>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {(['All', ...categories] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-5 py-4">
        {filteredItems.length > 0 ? (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">
              {search || activeCategory !== 'All' ? 'No items found' : 'Your pantry is empty'}
            </p>
            <p className="text-gray-400 text-sm">
              {search || activeCategory !== 'All' ? 'Try a different search or filter' : 'Add items to start tracking'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
