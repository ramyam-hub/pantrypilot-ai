import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Category, Unit } from '../types';
import { getItems, addItem, updateItem } from '../data/items';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '../App';

const categories: Category[] = ['Food', 'Beverages', 'Cleaning', 'Personal Care', 'Medicines', 'Other'];
const units: Unit[] = ['kg', 'g', 'L', 'ml', 'pieces', 'bottles', 'boxes', 'packets', 'cans'];

interface FormData {
  name: string;
  category: Category;
  quantity: number;
  unit: Unit;
  purchaseDate: string;
  expiryDate: string;
  lowStockThreshold: number;
  notes: string;
}

const defaultFormData: FormData = {
  name: '',
  category: 'Food',
  quantity: 1,
  unit: 'pieces',
  purchaseDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  lowStockThreshold: 2,
  notes: '',
};

export function AddItem() {
  const { navigate, editingItemId } = useNavigation();
  const { showToast } = useToast();
  const isEditing = Boolean(editingItemId);

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    if (editingItemId) {
      const items = getItems();
      const existingItem = items.find(item => item.id === editingItemId);
      if (existingItem) {
        setFormData({
          name: existingItem.name,
          category: existingItem.category,
          quantity: existingItem.quantity,
          unit: existingItem.unit,
          purchaseDate: existingItem.purchaseDate,
          expiryDate: existingItem.expiryDate || '',
          lowStockThreshold: existingItem.lowStockThreshold,
          notes: existingItem.notes,
        });
      }
    }
  }, [editingItemId]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    if (formData.lowStockThreshold < 0) {
      newErrors.lowStockThreshold = 'Threshold cannot be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const itemData = {
      name: formData.name.trim(),
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate || undefined,
      lowStockThreshold: formData.lowStockThreshold,
      notes: formData.notes.trim(),
    };

    if (isEditing && editingItemId) {
      updateItem(editingItemId, itemData);
      showToast('Item updated');
    } else {
      addItem(itemData);
      showToast('Item added');
    }
    navigate('dashboard');
  };

  const handleBack = () => {
    if (isEditing) {
      navigate('inventory');
    } else {
      navigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white pt-12 pb-4 px-5 sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-[430px] mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Item' : 'Add Item'}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-5 py-6 pb-20">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="e.g., Milk, Rice, Soap..."
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={formData.category}
              onChange={e => updateField('category', e.target.value as Category)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={e => updateField('quantity', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.quantity ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
              <select
                value={formData.unit}
                onChange={e => updateField('unit', e.target.value as Unit)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={e => updateField('purchaseDate', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={e => updateField('expiryDate', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Alert me when below
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={e => updateField('lowStockThreshold', parseInt(e.target.value) || 0)}
                className={`w-24 px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.lowStockThreshold ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              <span className="text-gray-500">{formData.unit}</span>
            </div>
            {errors.lowStockThreshold && <p className="text-red-500 text-xs mt-1">{errors.lowStockThreshold}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBack}
            className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3.5 bg-green-600 text-white rounded-xl font-medium shadow-sm"
          >
            {isEditing ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
