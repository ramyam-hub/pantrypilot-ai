import React from 'react';
import { Package, AlertTriangle, Clock, Lightbulb, ChevronRight, Plus } from 'lucide-react';
import { PantryItem } from '../types';
import { getItems } from '../data/items';
import { isLowStock, isExpiringSoon, getGreeting, formatDateLong, generateAITip, formatRelativeDate } from '../utils/helpers';
import { useNavigation } from '../App';

function StatCard({ icon: Icon, label, value, colorClass }: { icon: React.ElementType; label: string; value: number; colorClass: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

function RecentItemCard({ item }: { item: PantryItem }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
        <Package className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-gray-500">{formatRelativeDate(item.createdAt)}</p>
      </div>
      <span className="text-sm text-gray-600">{item.quantity} {item.unit}</span>
    </div>
  );
}

export function Dashboard() {
  const { navigate } = useNavigation();
  const items = getItems();
  const totalItems = items.length;
  const lowStockItems = items.filter(isLowStock);
  const expiringSoonItems = items.filter(isExpiringSoon);
  const recentItems = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const aiTip = generateAITip(items);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-green-600 to-green-500 pt-12 pb-8 px-5 rounded-b-3xl">
        <div className="max-w-[430px] mx-auto">
          <p className="text-green-100 text-sm mb-1">{formatDateLong()}</p>
          <h1 className="text-2xl font-bold text-white">{getGreeting()}!</h1>
          <p className="text-green-100 mt-1">Your Pantry</p>
        </div>
      </div>

      <div className="max-w-[430px] mx-auto px-5 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={Package}
            label="Total Items"
            value={totalItems}
            colorClass="bg-green-100 text-green-600"
          />
          <StatCard
            icon={AlertTriangle}
            label="Low Stock"
            value={lowStockItems.length}
            colorClass="bg-amber-100 text-amber-600"
          />
          <StatCard
            icon={Clock}
            label="Expiring"
            value={expiringSoonItems.length}
            colorClass="bg-red-100 text-red-600"
          />
        </div>

        <div className="mt-4 bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">AI Insight</h3>
              <p className="text-green-50 text-sm">{aiTip}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Items</h2>
            {recentItems.length > 0 && (
              <button
                onClick={() => navigate('inventory')}
                className="text-green-600 text-sm font-medium flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {recentItems.length > 0 ? (
            <div className="space-y-2">
              {recentItems.map(item => (
                <RecentItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Your pantry is empty</p>
              <button
                onClick={() => navigate('add')}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium"
              >
                <Plus className="w-5 h-5" />
                Add first item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
