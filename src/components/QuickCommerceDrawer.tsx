import React, { useState } from 'react';
import {
  Bike,
  Check,
  CheckCircle2,
  Clock,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { CartItem, PantryItem } from '../types';

interface QuickCommerceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lowStockItems: PantryItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddToCart: (item: PantryItem) => void;
  onOrderDelivered: (deliveredItems: CartItem[]) => void;
}

export const QuickCommerceDrawer: React.FC<QuickCommerceDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  lowStockItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onOrderDelivered,
}) => {
  const [orderStage, setOrderStage] = useState<
    'cart' | 'confirming' | 'dispatching' | 'out_for_delivery' | 'delivered'
  >('cart');
  const [etaCountdown, setEtaCountdown] = useState<number>(11);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 299 ? 0 : 25;
  const platformFee = 5;
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee + platformFee : 0;

  const handlePlaceOrder = () => {
    setOrderStage('confirming');
    setTimeout(() => {
      setOrderStage('dispatching');
      setTimeout(() => {
        setOrderStage('out_for_delivery');
        // Countdown simulated
        const interval = setInterval(() => {
          setEtaCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setOrderStage('delivered');
              onOrderDelivered(cart);
              return 0;
            }
            return prev - 1;
          });
        }, 1200);
      }, 1500);
    }, 1200);
  };

  const handleReset = () => {
    setOrderStage('cart');
    setEtaCountdown(11);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-[#fdfbf7] shadow-hearth-modal flex flex-col justify-between border-l border-[#1e293b]/10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header with Hairline Gradient Ring */}
        <div className="p-1 ring-express-gradient">
          <div className="bg-[#fdfbf7] p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#facc15] to-[#f59e0b] text-[#1e293b] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold font-display text-[#1e293b] leading-tight">
                    11-Min Instant Restock
                  </h2>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 uppercase">
                    Dark Store Live
                  </span>
                </div>
                <p className="text-[11px] text-[#1e293b]/60">
                  Direct pantry auto-replenishment
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#1e293b]/10 border border-[#1e293b]/10 flex items-center justify-center text-[#1e293b]/70 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Simulation Tracker View if placed */}
        {orderStage !== 'cart' ? (
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-6 text-center pt-6">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr from-[#facc15] to-[#f59e0b] text-[#1e293b] shadow-lg shadow-amber-500/20">
                {orderStage === 'delivered' ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-800" />
                ) : (
                  <Bike className="w-10 h-10 animate-bounce" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-[#d35400] font-display uppercase tracking-wider">
                  {orderStage === 'confirming' && 'Order Received · Order #CH-9821'}
                  {orderStage === 'dispatching' && 'Packing at Indiranagar Dark Store'}
                  {orderStage === 'out_for_delivery' && 'Rider Vikram is en route on EV scooter'}
                  {orderStage === 'delivered' && 'Hearth Restock Delivered!'}
                </span>
                <h3 className="text-2xl font-black font-display text-[#1e293b] mt-1">
                  {orderStage === 'delivered' ? 'Pantry Replenished' : `Arriving in ${etaCountdown} mins`}
                </h3>
                <p className="text-xs text-[#1e293b]/70 mt-1 max-w-xs mx-auto">
                  {orderStage === 'delivered'
                    ? 'All items have been verified and added to your pantry rasan stock levels.'
                    : 'Delivering fresh unpolished grains, spices, and dairy in insulated bags.'}
                </p>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-2 max-w-xs mx-auto text-left text-xs bg-white p-4 rounded-xl border border-[#1e293b]/10">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">
                    ✓
                  </div>
                  <span className="font-medium text-[#1e293b]">Order Packed &amp; Weighed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                      orderStage === 'out_for_delivery' || orderStage === 'delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 text-white animate-pulse'
                    }`}
                  >
                    ✓
                  </div>
                  <span className="font-medium text-[#1e293b]">Dispatched via Electric Fleet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                      orderStage === 'delivered' ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    ✓
                  </div>
                  <span
                    className={
                      orderStage === 'delivered'
                        ? 'font-bold text-emerald-800'
                        : 'text-[#1e293b]/50'
                    }
                  >
                    Delivered &amp; Restocked
                  </span>
                </div>
              </div>
            </div>

            {orderStage === 'delivered' && (
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[#d35400] hover:bg-[#b84500] text-white font-display font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Back to Pantry
              </button>
            )}
          </div>
        ) : (
          /* Normal Cart Body */
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Cart Items List */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]/10 mb-3">
                <span className="text-xs font-bold font-display text-[#1e293b]">
                  Replenishment Items ({cart.length})
                </span>
                <span className="text-[11px] text-[#1e293b]/50">Instant delivery</span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-[#1e293b]/10 p-4">
                  <ShoppingBag className="w-8 h-8 text-[#1e293b]/30 mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#1e293b] font-display">
                    Your restock cart is empty
                  </p>
                  <p className="text-[11px] text-[#1e293b]/60 mt-0.5">
                    Add low stock pantry items below to restock in 11 minutes.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#1e293b]/10 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <h4 className="text-xs font-bold font-display text-[#1e293b] leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#1e293b]/60 font-mono">
                            ₹{item.price} per unit
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-[#fdfaf5] border border-[#1e293b]/15 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#1e293b] hover:bg-black/5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-[#1e293b] hover:bg-black/5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold font-mono text-[#1e293b] tabular-nums w-12 text-right">
                          ₹{item.price * item.quantity}
                        </span>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#1e293b]/40 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-suggested Low-Stock Items from Pantry */}
            {lowStockItems.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-display text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d35400]" />
                    Low-Stock Detected in Pantry
                  </span>
                  <span className="text-[10px] text-[#1e293b]/50">Recommended</span>
                </div>

                <div className="space-y-2">
                  {lowStockItems.slice(0, 4).map((pantryItem) => {
                    const isInCart = cart.some((c) => c.pantryItemId === pantryItem.id);

                    return (
                      <div
                        key={pantryItem.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-[#1e293b] block leading-tight">
                            {pantryItem.name}
                          </span>
                          <span className="text-[10px] text-amber-800">
                            Only {pantryItem.currentQuantity} {pantryItem.unit} left · ₹{pantryItem.price}
                          </span>
                        </div>

                        <button
                          disabled={isInCart}
                          onClick={() => onAddToCart(pantryItem)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold font-display transition-colors cursor-pointer shrink-0 ${
                            isInCart
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-white hover:bg-amber-100 text-[#d35400] border border-[#d35400]/30 shadow-xs'
                          }`}
                        >
                          {isInCart ? 'In Cart' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bill Summary */}
            {cart.length > 0 && (
              <div className="p-4 bg-white rounded-2xl border border-[#1e293b]/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#1e293b]/70">
                  <span>Items Subtotal</span>
                  <span className="font-mono tabular-nums">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-[#1e293b]/70">
                  <span>11-Min Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE (Above ₹299)</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#1e293b]/70">
                  <span>Hearth Handling Fee</span>
                  <span className="font-mono tabular-nums">₹{platformFee}</span>
                </div>
                <div className="pt-2 border-t border-[#1e293b]/10 flex items-center justify-between font-bold text-sm text-[#1e293b]">
                  <span>Total Payable</span>
                  <span className="font-mono text-base tabular-nums text-[#d35400]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Checkout CTA */}
        {orderStage === 'cart' && (
          <div className="p-4 bg-white border-t border-[#1e293b]/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#1e293b]/70 px-1">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#d35400]" />
                Guaranteed 11-min doorstep drop
              </span>
              <span className="font-semibold text-emerald-700">Cash on Delivery / UPI</span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handlePlaceOrder}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#facc15] via-[#f59e0b] to-[#ea580c] text-[#1e293b] font-display font-extrabold text-sm shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Place 11-Minute Restock Order · ₹{grandTotal}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
