import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertTriangle, Clock, Check, Plus, Trash2, Sparkles } from 'lucide-react';
import { PantryItem, ShoppingListItem } from '../types';
import { getItems } from '../data/items';
import { isLowStock, isExpiringSoon } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

function ShoppingItem({
  item,
  onToggle,
  onRemove,
}: {
  item: ShoppingListItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-4 transition-all ${
        item.purchased ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(item.id)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            item.purchased
              ? 'bg-green-600 border-green-600'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {item.purchased && <Check className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-gray-900 ${
              item.purchased ? 'line-through text-gray-500' : ''
            }`}
          >
            {item.itemName}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {item.reason === 'low-stock' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <AlertTriangle className="w-3 h-3" />
                Low stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                <Clock className="w-3 h-3" />
                Expiring soon
              </span>
            )}
            <span className="text-xs text-gray-500">
              Suggest: {item.suggestedQuantity}
            </span>
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AddCustomItemModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, quantity: number) => void;
}) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), quantity);
      setName('');
      setQuantity(1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-[430px] p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Custom Item</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
        />
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-gray-600">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
            className="w-20 px-3 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="w-full py-3.5 bg-green-600 text-white rounded-xl font-medium"
        >
          Add to List
        </button>
      </div>
    </div>
  );
}

export function ShoppingList() {
  const { showToast } = useToast();
  const [shoppingItems, setShoppingItems] = useState<ShoppingListItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    generateShoppingList();
  }, []);

  const generateShoppingList = () => {
    const items = getItems();
    const lowStockItems = items.filter(isLowStock);
    const expiringItems = items.filter(isExpiringSoon);

    const shoppingList: ShoppingListItem[] = [];

    lowStockItems.forEach(item => {
      const suggestedQty = Math.max(item.lowStockThreshold - item.quantity, item.lowStockThreshold);
      shoppingList.push({
        id: generateId(),
        itemName: item.name,
        reason: 'low-stock',
        suggestedQuantity: suggestedQty,
        purchased: false,
      });
    });

    expiringItems.forEach(item => {
      if (!shoppingList.find(s => s.itemName === item.name)) {
        shoppingList.push({
          id: generateId(),
          itemName: item.name,
          reason: 'expiring-soon',
          suggestedQuantity: item.quantity,
          purchased: false,
        });
      }
    });

    setShoppingItems(shoppingList);
  };

  const handleToggle = (id: string) => {
    setShoppingItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setShoppingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearPurchased = () => {
    const count = shoppingItems.filter(item => item.purchased).length;
    if (count === 0) return;
    setShoppingItems(prev => prev.filter(item => !item.purchased));
    showToast(`${count} item${count > 1 ? 's' : ''} cleared`);
  };

  const handleAddCustom = (name: string, quantity: number) => {
    setShoppingItems(prev => [
      ...prev,
      {
        id: generateId(),
        itemName: name,
        reason: 'low-stock',
        suggestedQuantity: quantity,
        purchased: false,
      },
    ]);
    showToast('Item added');
  };

  const purchasedCount = shoppingItems.filter(item => item.purchased).length;
  const unpurchasedCount = shoppingItems.length - purchasedCount;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white pt-12 pb-4 px-5 sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-[430px] mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
            {purchasedCount > 0 && (
              <button
                onClick={handleClearPurchased}
                className="text-sm text-red-600 font-medium"
              >
                Clear purchased
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            {shoppingItems.length === 0
              ? 'Your list is empty'
              : `${unpurchasedCount} item${unpurchasedCount !== 1 ? 's' : ''} to buy`}
          </p>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-5 py-4">
        {shoppingItems.length > 0 ? (
          <div className="space-y-3">
            {shoppingItems
              .sort((a, b) => {
                if (a.purchased !== b.purchased) return a.purchased ? 1 : -1;
                return 0;
              })
              .map(item => (
                <ShoppingItem
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onRemove={handleRemove}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-gray-900 font-medium mb-2">All stocked up!</p>
            <p className="text-gray-500 text-sm mb-6">
              No items need restocking right now
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Add to list
            </button>
          </div>
        )}

        {shoppingItems.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-24 right-[calc(50%-215px)] w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg z-30"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>

      <AddCustomItemModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddCustom}
      />
    </div>
  );
}
