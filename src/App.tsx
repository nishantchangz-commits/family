import React, { useState } from 'react';
import { CookModeModal } from './components/CookModeModal';
import { Header } from './components/Header';
import { KitchenActivityView } from './components/KitchenActivityView';
import { MasalaDabbaView } from './components/MasalaDabbaView';
import { MealHearthView } from './components/MealHearthView';
import { PantryView } from './components/PantryView';
import { QuickCommerceDrawer } from './components/QuickCommerceDrawer';
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_MASALA_SPICES,
  INITIAL_MEAL_SLOTS,
  INITIAL_PANTRY_ITEMS,
} from './data/mockData';
import {
  CartItem,
  FamilyMember,
  MasalaSpice,
  MealOption,
  MealSlot,
  PantryItem,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pantry' | 'meals' | 'masala' | 'activity'>('pantry');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(INITIAL_PANTRY_ITEMS);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [mealSlots, setMealSlots] = useState<MealSlot[]>(INITIAL_MEAL_SLOTS);
  const [masalaSpices, setMasalaSpices] = useState<MasalaSpice[]>(INITIAL_MASALA_SPICES);

  // Quick commerce replenishment cart
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-1',
      pantryItemId: 'toor-dal',
      name: 'Toor Dal (Arhar) - 1kg pack',
      quantity: 1,
      unit: 'kg',
      price: 185,
      image:
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cart-2',
      pantryItemId: 'cow-ghee',
      name: 'Pure Desi Cow Ghee (Amul Vedic) - 1L',
      quantity: 1,
      unit: 'L',
      price: 680,
      image:
        'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active cooking modal
  const [activeCookSession, setActiveCookSession] = useState<{
    slot: MealSlot;
    option: MealOption;
  } | null>(null);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Kitchen Activity Log
  const [activityLogs, setActivityLogs] = useState<
    {
      id: string;
      type: 'cook' | 'restock' | 'vote' | 'note';
      title: string;
      timestamp: string;
      detail: string;
      author?: string;
    }[]
  >([
    {
      id: 'log-1',
      type: 'cook',
      title: 'Morning Nashta Cooked',
      timestamp: 'Today, 8:45 AM',
      detail: 'Indori Kanda Poha prepared for 4 family members with crisp Ratlami sev.',
      author: 'Mummy',
    },
    {
      id: 'log-2',
      type: 'restock',
      title: 'Dark Store 11-Min Delivery Arrived',
      timestamp: 'Yesterday, 6:15 PM',
      detail: 'Aashirvaad Sharbati Atta (5kg) & Fresh Farm Palak safely stocked into jars.',
      author: 'Papa',
    },
    {
      id: 'log-3',
      type: 'note',
      title: 'Dadi Fasting Reminder',
      timestamp: 'Yesterday, 3:30 PM',
      detail: 'Tomorrow is Ekadashi fasting. Ensure sendha namak and roasted makhana are on kitchen counter.',
      author: 'Dadi',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add item to cart
  const handleAddToCart = (item: PantryItem, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.pantryItemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.pantryItemId === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${item.id}`,
          pantryItemId: item.id,
          name: `${item.name} (${item.brand || 'Fresh'})`,
          quantity,
          unit: item.unit,
          price: item.price,
          image: item.image,
        },
      ];
    });
    showToast(`Added ${item.name} to 11-Min Restock Cart`);
    setIsCartOpen(true);
  };

  // Add all low stock items to cart
  const handleAddAllLowStockToCart = () => {
    const lowStock = pantryItems.filter((i) => i.currentQuantity <= i.lowStockThreshold);
    lowStock.forEach((item) => {
      handleAddToCart(item, 1);
    });
    showToast(`Queued ${lowStock.length} low stock items for instant restock`);
    setIsCartOpen(true);
  };

  // Cart quantity controls
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // When order is delivered, replenish matched pantry items
  const handleOrderDelivered = (deliveredItems: CartItem[]) => {
    setPantryItems((prev) =>
      prev.map((item) => {
        const ordered = deliveredItems.find((d) => d.pantryItemId === item.id);
        if (ordered) {
          return {
            ...item,
            currentQuantity: item.maxQuantity,
            daysRemaining: 18,
            lastRestocked: 'Just now (11-min express)',
          };
        }
        return item;
      })
    );

    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        type: 'restock',
        title: 'Instant 11-Min Dark Store Delivery Restocked',
        timestamp: 'Just now',
        detail: `Replenished ${deliveredItems.map((d) => d.name).join(', ')} directly into kitchen pantry jars.`,
        author: 'Quick-Commerce Fleet',
      },
      ...prev,
    ]);

    setCart([]);
    showToast('Pantry jars automatically replenished to full capacity!');
  };

  // Consume pantry item manually
  const handleConsumeItem = (itemId: string, amount: number) => {
    setPantryItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, Math.round((item.currentQuantity - amount) * 100) / 100);
          return {
            ...item,
            currentQuantity: newQty,
            daysRemaining: Math.max(1, Math.round((newQty / (item.maxQuantity || 1)) * 14)),
          };
        }
        return item;
      })
    );
  };

  // Add new item
  const handleAddItem = (newItem: Omit<PantryItem, 'id'>) => {
    const item: PantryItem = {
      ...newItem,
      id: `custom-${Date.now()}`,
    };
    setPantryItems((prev) => [item, ...prev]);
    showToast(`Added ${item.name} to kitchen pantry`);
  };

  // Meal voting toggle
  const handleToggleVote = (slotId: string, optionId: string, memberId: string) => {
    setMealSlots((prev) =>
      prev.map((slot) => {
        if (slot.id !== slotId) return slot;

        const updatedOptions = slot.options.map((opt) => {
          if (opt.id === optionId) {
            const hasVote = opt.votes.includes(memberId);
            return {
              ...opt,
              votes: hasVote
                ? opt.votes.filter((id) => id !== memberId)
                : [...opt.votes, memberId],
            };
          } else {
            // Remove member's vote from rival option in same meal
            return {
              ...opt,
              votes: opt.votes.filter((id) => id !== memberId),
            };
          }
        });

        // Determine active option by votes count
        let bestOpt = updatedOptions[0];
        updatedOptions.forEach((o) => {
          if (o.votes.length > bestOpt.votes.length) {
            bestOpt = o;
          }
        });

        return {
          ...slot,
          options: updatedOptions,
          activeOptionId: bestOpt.id,
        };
      })
    );
  };

  const handleSelectOption = (slotId: string, optionId: string) => {
    setMealSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId ? { ...slot, activeOptionId: optionId } : slot
      )
    );
  };

  // Add missing ingredients to cart
  const handleAddMissingToCart = (
    missing: { name: string; amount: number; unit: string; pantryItem?: PantryItem }[]
  ) => {
    missing.forEach((m) => {
      if (m.pantryItem) {
        handleAddToCart(m.pantryItem, 1);
      } else {
        setCart((prev) => [
          ...prev,
          {
            id: `missing-${Date.now()}-${m.name}`,
            name: `${m.name} (${m.amount} ${m.unit})`,
            quantity: 1,
            unit: m.unit,
            price: 75,
          },
        ]);
      }
    });
    setIsCartOpen(true);
    showToast(`Added ${missing.length} missing ingredients to restock cart`);
  };

  // Start interactive cooking session
  const handleStartCooking = (slot: MealSlot, option: MealOption) => {
    setActiveCookSession({ slot, option });
  };

  // Complete cooking
  const handleFinishCooking = (scaledOption: MealOption, scaledServings: number) => {
    // Deduct ingredients from pantry
    setPantryItems((prev) =>
      prev.map((item) => {
        const matchedIng = scaledOption.ingredients.find(
          (ing) => ing.pantryItemId === item.id
        );
        if (matchedIng) {
          const usedTotal = matchedIng.quantityPerServing * scaledServings;
          let newQty = item.currentQuantity;

          if (item.unit === matchedIng.unit) {
            newQty = Math.max(0, item.currentQuantity - usedTotal);
          } else if (item.unit === 'kg' && matchedIng.unit === 'g') {
            newQty = Math.max(0, item.currentQuantity - usedTotal / 1000);
          } else if (item.unit === 'L' && matchedIng.unit === 'ml') {
            newQty = Math.max(0, item.currentQuantity - usedTotal / 1000);
          } else {
            newQty = Math.max(0, item.currentQuantity - 0.2);
          }

          return {
            ...item,
            currentQuantity: Math.round(newQty * 100) / 100,
            daysRemaining: Math.max(1, Math.round((newQty / (item.maxQuantity || 1)) * 14)),
          };
        }
        return item;
      })
    );

    // Add log
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        type: 'cook',
        title: `Cooked ${scaledOption.title}`,
        timestamp: 'Just now',
        detail: `Prepared ${scaledServings} warm servings. Ingredients automatically deducted from kitchen inventory.`,
        author: 'Family Chef',
      },
      ...prev,
    ]);

    setActiveCookSession(null);
    showToast(`Meal cooked! Ingredients deducted from pantry jars.`);
  };

  // Refill spice katori
  const handleRefillSpice = (spiceId: string) => {
    setMasalaSpices((prev) =>
      prev.map((s) => (s.id === spiceId ? { ...s, fillPercentage: 100 } : s))
    );
    showToast('Masala Dabba katori topped up to 100%!');
  };

  // Add kitchen note
  const handleAddNote = (noteText: string, author: string) => {
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        type: 'note',
        title: 'Kitchen Hearth Notice',
        timestamp: 'Just now',
        detail: noteText,
        author,
      },
      ...prev,
    ]);
    showToast('Note pinned to Hearth Journal');
  };

  const lowStockCount = pantryItems.filter(
    (i) => i.currentQuantity <= i.lowStockThreshold
  ).length;

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1e293b] flex flex-col font-sans selection:bg-[#d35400]/20 selection:text-[#d35400]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e293b] text-white px-4 py-2.5 rounded-xl shadow-hearth-modal flex items-center gap-2 text-xs font-medium animate-in slide-in-from-bottom duration-200 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#facc15]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation conforming to the 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        lowStockCount={lowStockCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'pantry' && (
          <PantryView
            items={pantryItems}
            onAddToCart={handleAddToCart}
            onConsumeItem={handleConsumeItem}
            onAddItem={handleAddItem}
            onAddAllLowStockToCart={handleAddAllLowStockToCart}
          />
        )}

        {activeTab === 'meals' && (
          <MealHearthView
            mealSlots={mealSlots}
            familyMembers={familyMembers}
            pantryItems={pantryItems}
            onToggleVote={handleToggleVote}
            onSelectOption={handleSelectOption}
            onStartCooking={handleStartCooking}
            onAddMissingToCart={handleAddMissingToCart}
          />
        )}

        {activeTab === 'masala' && (
          <MasalaDabbaView
            spices={masalaSpices}
            onRefillSpice={handleRefillSpice}
          />
        )}

        {activeTab === 'activity' && (
          <KitchenActivityView
            familyMembers={familyMembers}
            activityLogs={activityLogs}
            onAddNote={handleAddNote}
          />
        )}
      </main>

      {/* Quick-Commerce Express Replenishment Drawer */}
      <QuickCommerceDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lowStockItems={pantryItems.filter((i) => i.currentQuantity <= i.lowStockThreshold)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onAddToCart={handleAddToCart}
        onOrderDelivered={handleOrderDelivered}
      />

      {/* Interactive Cooking Mode Modal */}
      {activeCookSession && (
        <CookModeModal
          slot={activeCookSession.slot}
          option={activeCookSession.option}
          onClose={() => setActiveCookSession(null)}
          onFinishCooking={handleFinishCooking}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-[#1e293b]/10 bg-white/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1e293b]/60">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1e293b] font-display">Culinary Hearth</span>
            <span>·</span>
            <span>Indian Kitchen Operating System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Tactile Rasan Gauges</span>
            <span>·</span>
            <span>Family Meal Voting</span>
            <span>·</span>
            <span>11-Min Instant Restock</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
