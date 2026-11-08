import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PantryCategory, PantryItem } from '../types';

interface PantryViewProps {
  items: PantryItem[];
  onAddToCart: (item: PantryItem, quantity?: number) => void;
  onConsumeItem: (itemId: string, amount: number) => void;
  onAddItem: (newItem: Omit<PantryItem, 'id'>) => void;
  onAddAllLowStockToCart: () => void;
}

export const PantryView: React.FC<PantryViewProps> = ({
  items,
  onAddToCart,
  onConsumeItem,
  onAddItem,
  onAddAllLowStockToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PantryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'healthy'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemHindi, setNewItemHindi] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PantryItem['category']>('dals');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemMaxQty, setNewItemMaxQty] = useState<number>(2);
  const [newItemUnit, setNewItemUnit] = useState<PantryItem['unit']>('kg');
  const [newItemPrice, setNewItemPrice] = useState<number>(120);
  const [newItemBrand, setNewItemBrand] = useState('');

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(searchQuery)) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const isLow = item.currentQuantity <= item.lowStockThreshold;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && isLow) ||
      (stockFilter === 'healthy' && !isLow);

    return matchesCategory && matchesSearch && matchesStock;
  });

  const lowStockItems = items.filter(
    (i) => i.currentQuantity <= i.lowStockThreshold
  );

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      hindiName: newItemHindi.trim() || undefined,
      category: newItemCategory,
      currentQuantity: Number(newItemQty) || 1,
      maxQuantity: Math.max(Number(newItemMaxQty) || 2, Number(newItemQty) || 1),
      unit: newItemUnit,
      lowStockThreshold: Math.round((Number(newItemMaxQty) || 2) * 0.3 * 10) / 10,
      daysRemaining: 14,
      price: Number(newItemPrice) || 99,
      brand: newItemBrand.trim() || 'Hearth Choice',
      image:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      lastRestocked: 'Just now',
    });

    // Reset & close
    setNewItemName('');
    setNewItemHindi('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Title & Overview Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
        <div>
          <span className="text-xs font-semibold text-[#d35400] uppercase tracking-wider font-display">
            Kitchen Rasan &amp; Pantry Inventory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e293b] font-display tracking-tight mt-1">
            Pantry Jars &amp; Rasan Levels
          </h1>
          <p className="text-sm text-[#1e293b]/70 mt-1 max-w-xl">
            Live container fullness, consumption tracking, and 1-tap quick-commerce
            restocking for the family kitchen.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {lowStockItems.length > 0 && (
            <button
              onClick={onAddAllLowStockToCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Restock {lowStockItems.length} Low Items</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d35400] hover:bg-[#b84500] text-white text-xs font-semibold font-display shadow-sm shadow-[#d35400]/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rasan Item</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e26d1e]/10 shadow-hearth-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#1e293b]/60 font-medium">Monitored Items</span>
            <div className="text-2xl font-bold font-display text-[#1e293b] mt-0.5 tabular-nums">
              {items.length} <span className="text-xs font-normal text-[#1e293b]/50">in pantry</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e26d1e]/10 shadow-hearth-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#1e293b]/60 font-medium">Attention Needed</span>
            <div className="text-2xl font-bold font-display text-amber-800 mt-0.5 tabular-nums">
              {lowStockItems.length}{' '}
              <span className="text-xs font-normal text-amber-700/70">low stock</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e26d1e]/10 shadow-hearth-1 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#1e293b]/60 font-medium">Est. Kitchen Runway</span>
            <div className="text-2xl font-bold font-display text-[#1e293b] mt-0.5 tabular-nums">
              ~14 <span className="text-xs font-normal text-[#1e293b]/50">days supply</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 text-[#d35400] flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 bg-white/70 backdrop-blur-sm rounded-xl border border-[#1e293b]/10 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {(
            [
              { id: 'all', label: 'All Items' },
              { id: 'dals', label: 'Dals & Lentils' },
              { id: 'grains', label: 'Atta & Rice' },
              { id: 'spices', label: 'Whole Spices' },
              { id: 'dairy', label: 'Dairy & Ghee' },
              { id: 'oils', label: 'Oils' },
              { id: 'produce', label: 'Fresh Produce' },
              { id: 'staples', label: 'Staples' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-display font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#1e293b] text-white shadow-sm'
                  : 'text-[#1e293b]/70 hover:bg-[#1e293b]/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Stock Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-[#1e293b]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spices, dals, brand..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#1e293b]/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]/40 text-[#1e293b]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#1e293b]/5 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                stockFilter === 'all'
                  ? 'bg-white text-[#1e293b] shadow-xs'
                  : 'text-[#1e293b]/60 hover:text-[#1e293b]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                stockFilter === 'low'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-[#1e293b]/60 hover:text-[#1e293b]'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('healthy')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                stockFilter === 'healthy'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-[#1e293b]/60 hover:text-[#1e293b]'
              }`}
            >
              Optimal
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Pantry Containers / Jars */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#1e293b]/10 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1e293b] font-display">No pantry items found</h3>
          <p className="text-xs text-[#1e293b]/60 mt-1">
            Try adjusting your search terms or category filter to discover items.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStockFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-[#d35400] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const fillRatio = Math.min(1, Math.max(0, item.currentQuantity / item.maxQuantity));
            const fillPercentage = Math.round(fillRatio * 100);
            const isLowStock = item.currentQuantity <= item.lowStockThreshold;
            const isCritical = fillPercentage < 20;

            // Rasan gauge color specification
            let barColor = 'bg-[#059669]'; // Mint Basil for optimal
            let statusBadge = (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ecfdf5] text-[#059669] border border-[#059669]/20">
                In Stock
              </span>
            );

            if (isCritical) {
              barColor = 'bg-[#e11d48]'; // Rose red for critical
              statusBadge = (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fff1f2] text-[#be123c] border border-[#be123c]/20">
                  Critical Low
                </span>
              );
            } else if (isLowStock) {
              barColor = 'bg-[#eab308]'; // Turmeric yellow
              statusBadge = (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef9c3] text-[#854d0e] border border-[#854d0e]/20">
                  Low Stock
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-hearth-1 hover:shadow-hearth-2 group ${
                  isLowStock ? 'border-amber-300 ring-1 ring-amber-200' : 'border-[#e26d1e]/10'
                }`}
              >
                {/* Image & Header */}
                <div className="relative h-36 bg-[#f8f6f0] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback gradient if hotlink fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Subtle scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Status & Category Tags */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#1e293b]">
                      {item.category}
                    </span>
                    {statusBadge}
                  </div>

                  {/* Brand & Hindi Name on Scrim */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <span className="text-[11px] font-medium text-white/80 block leading-tight truncate">
                      {item.brand || 'Pantry Staple'}
                    </span>
                    <h3 className="text-sm font-bold font-display leading-snug drop-shadow-xs truncate">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body & Rasan Gauge */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {item.hindiName && (
                      <span className="text-xs text-[#1e293b]/60 block font-normal">
                        {item.hindiName}
                      </span>
                    )}

                    {/* Quantity & Level Gauge */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-xs text-[#1e293b] font-medium mb-1.5">
                        <span className="font-semibold tabular-nums text-sm">
                          {item.currentQuantity} {item.unit}
                        </span>
                        <span className="text-[11px] text-[#1e293b]/60 tabular-nums">
                          of {item.maxQuantity} {item.unit} ({fillPercentage}%)
                        </span>
                      </div>

                      {/* Rasan Level Bar: 8px height pill track with cream-gray well */}
                      <div className="h-2 w-full rounded-full bg-[#1e293b]/10 overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Metadata indicators */}
                    <div className="flex items-center justify-between text-[11px] text-[#1e293b]/60 pt-2 border-t border-[#1e293b]/5">
                      <span>
                        Runway: <strong className="text-[#1e293b]">{item.daysRemaining} days</strong>
                      </span>
                      <span>
                        Restocked:{' '}
                        <span className="text-[#1e293b]/80">{item.lastRestocked}</span>
                      </span>
                    </div>
                  </div>

                  {/* Tactile Action Controls */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(item)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isLowStock
                          ? 'bg-gradient-to-r from-[#facc15] to-[#f59e0b] text-[#1e293b] hover:shadow-xs'
                          : 'bg-amber-50 hover:bg-amber-100 text-[#d35400] border border-[#d35400]/20'
                      }`}
                      title="Add to 11-Minute Quick-Commerce Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{isLowStock ? '⚡ 11m Restock' : 'Top-Up'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const step =
                          item.unit === 'kg' || item.unit === 'L' ? 0.2 : item.unit === 'g' ? 15 : 1;
                        onConsumeItem(item.id, step);
                      }}
                      className="px-2.5 py-1.5 text-xs text-[#1e293b]/70 hover:text-[#1e293b] hover:bg-[#1e293b]/5 rounded-lg border border-[#1e293b]/10 transition-colors cursor-pointer shrink-0"
                      title="Log cooking use (deducts small portion)"
                    >
                      - Use
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Rasan Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-hearth-modal border border-[#1e293b]/10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]/10">
              <div>
                <h3 className="text-lg font-bold font-display text-[#1e293b]">
                  Add New Pantry Rasan
                </h3>
                <p className="text-xs text-[#1e293b]/60">
                  Track another staple or spice in your kitchen inventory
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1e293b]/5 hover:bg-[#1e293b]/10 flex items-center justify-center text-[#1e293b]/70 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Item Name (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Masoor Dal"
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Hindi / Regional Name
                  </label>
                  <input
                    type="text"
                    value={newItemHindi}
                    onChange={(e) => setNewItemHindi(e.target.value)}
                    placeholder="e.g. मसूर दाल"
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  >
                    <option value="dals">Dals &amp; Lentils</option>
                    <option value="grains">Atta, Rice &amp; Grains</option>
                    <option value="spices">Whole &amp; Ground Spices</option>
                    <option value="dairy">Dairy &amp; Desi Ghee</option>
                    <option value="oils">Cooking Oils</option>
                    <option value="produce">Fresh Produce / Greens</option>
                    <option value="staples">Staples &amp; Salt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Preferred Brand
                  </label>
                  <input
                    type="text"
                    value={newItemBrand}
                    onChange={(e) => setNewItemBrand(e.target.value)}
                    placeholder="e.g. Tata Sampann / 24 Mantra"
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Current Qty
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">
                    Jar Capacity
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newItemMaxQty}
                    onChange={(e) => setNewItemMaxQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1e293b] mb-1">Unit</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#1e293b]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="bunch">bunch</option>
                    <option value="packet">packet</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#1e293b]/70 hover:text-[#1e293b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold font-display text-white bg-[#d35400] hover:bg-[#b84500] rounded-lg shadow-sm"
                >
                  Save to Pantry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
