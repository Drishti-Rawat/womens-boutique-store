'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore, getInMemoryToken } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

type CheckoutStep = 'address' | 'review' | 'confirmed';

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { openModal, addToast } = useUIStore();
  const {
    items, couponCode, getSubtotal, getDiscountAmount, getShippingFee, getTotal, clearCart,
  } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [addressSaved, setAddressSaved] = useState(false);

  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  // ── Prefill from user + saved address from DB on load ──────────────────────
  useEffect(() => {
    if (!user) return;

    const baseForm: Partial<ShippingForm> = {
      fullName: user.name,
      email: user.email,
    };

    const fetchSavedAddress = async () => {
      try {
        const token = getInMemoryToken();
        const res = await fetch('/api/user/address', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { address: saved } = await res.json();
          if (saved) {
            setForm((prev) => ({
              ...prev,
              ...baseForm,
              phone:   saved.savedPhone   || prev.phone,
              address: saved.savedAddress || prev.address,
              city:    saved.savedCity    || prev.city,
              state:   saved.savedState   || prev.state,
              pincode: saved.savedPincode || prev.pincode,
            }));
            if (saved.savedAddress) setAddressSaved(true);
            return;
          }
        }
      } catch {
        // no saved address, just prefill name/email
      }
      setForm((prev) => ({ ...prev, ...baseForm }));
    };

    fetchSavedAddress();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Redirect to catalog if cart is empty (unless order just placed) ─────────
  useEffect(() => {
    if (items.length === 0 && step !== ('confirmed' as CheckoutStep)) {
      router.replace('/catalog');
    }
  }, [items.length, step, router]);

  const subtotal  = getSubtotal();
  const discount  = getDiscountAmount();
  const shipping  = getShippingFee();
  const total     = getTotal();

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Partial<ShippingForm> = {};
    if (!form.fullName.trim())   e.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Valid 10-digit phone number is required';
    if (!form.address.trim() || form.address.length < 10)
      e.address = 'Full address required (min. 10 characters)';
    if (!form.city.trim())   e.city   = 'City is required';
    if (!form.state)         e.state  = 'Please select your state';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      e.pincode = '6-digit PIN code required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFieldChange = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Save address to DB + go to review ──────────────────────────────────────
  const handleAddressNext = async () => {
    if (!user) {
      addToast('Please sign in to proceed to checkout', 'info');
      openModal('login');
      return;
    }
    if (!validate()) return;

    // Save address to user profile in DB (fire-and-forget)
    try {
      const token = getInMemoryToken();
      await fetch('/api/user/address', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone:   form.phone,
          address: form.address,
          city:    form.city,
          state:   form.state,
          pincode: form.pincode,
        }),
      });
      setAddressSaved(true);
    } catch {
      // Non-blocking — continue to review even if save fails
    }

    setStep('review');
  };

  // ── Place order ─────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!user) { openModal('login'); return; }
    setIsPlacing(true);
    try {
      const token = getInMemoryToken();
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName:    form.fullName,
          customerEmail:   form.email,
          customerPhone:   form.phone,
          shippingAddress: form.address,
          shippingCity:    form.city,
          shippingState:   form.state,
          shippingPincode: form.pincode,
          subtotal,
          discount,
          shippingFee: shipping,
          total,
          couponCode: couponCode || null,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name:      item.name,
            slug:      item.slug,
            price:     item.price,
            size:      item.size,
            color:     item.color,
            quantity:  item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        addToast(data.error || 'Failed to place order. Please try again.', 'error');
        return;
      }

      const data = await res.json();
      setPlacedOrderNumber(data.order.orderNumber);
      clearCart(true);   // Wipe DB cart + in-memory
      setStep('confirmed');
    } catch {
      addToast('Network error. Please check your connection.', 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ORDER CONFIRMED SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-[#F6F0E6] flex flex-col">
        {/* Mini header */}
        <div className="w-full bg-[#4A1724] text-[#D7B982] text-[10px] py-2 text-center uppercase tracking-[0.3em] font-semibold">
          NOORÉ — Secure Checkout
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-lg w-full text-center space-y-8">
            <div className="relative mx-auto w-28 h-28">
              <div className="w-28 h-28 rounded-full bg-[#4A1724] border-4 border-[#D7B982] flex items-center justify-center shadow-2xl animate-bounce-once">
                <svg className="w-14 h-14 text-[#D7B982]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[#D7B982]">❀</span>
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-[#4A1724]">ORDER CONFIRMED</span>
                <span className="text-[#D7B982]">❀</span>
              </div>
              <h1 className="font-serif text-4xl font-light text-[#4A1724]">
                Thank You, <span className="italic text-[#D7B982]">{user?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-sm text-[#21191A]/70 font-light leading-relaxed max-w-sm mx-auto">
                Your royal order has been placed. Our artisans are carefully preparing your heirloom pieces.
              </p>
            </div>

            <div className="bg-[#E8DDCE]/60 rounded-3xl p-6 border border-[#D7B982]/50 text-sm space-y-3 shadow-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#21191A]/60 uppercase tracking-wider font-semibold">Order Reference</span>
                <span className="font-bold text-[#4A1724] font-mono text-base">{placedOrderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-[#D7B982]/30 pt-3">
                <span className="text-[#21191A]/60 uppercase tracking-wider font-semibold">Confirmation sent to</span>
                <span className="font-semibold text-[#21191A]">{form.email}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-[#D7B982]/30 pt-3">
                <span className="text-[#21191A]/60 uppercase tracking-wider font-semibold">Delivering to</span>
                <span className="font-semibold text-[#21191A]">{form.city}, {form.state}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/account?tab=orders"
                className="px-8 py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow-lg border border-[#D7B982]/40"
              >
                VIEW MY ORDERS →
              </Link>
              <Link
                href="/catalog"
                className="px-8 py-3.5 rounded-full bg-[#F6F0E6] text-[#4A1724] border border-[#D7B982] font-bold text-xs uppercase tracking-widest hover:bg-[#E8DDCE] transition-all"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN CHECKOUT LAYOUT
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] antialiased">

      {/* ── Announcement Bar ── */}
      <div className="w-full bg-[#4A1724] text-[#D7B982] text-[10px] uppercase tracking-[0.3em] py-2.5 text-center font-semibold">
        NOORÉ — Secure Checkout — Crafted in India
      </div>

      {/* ── Checkout Header ── */}
      <header className="border-b border-[#D7B982]/30 bg-[#F6F0E6]/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-[0.15em] text-[#4A1724]">
            NOORÉ
          </Link>

          {/* Step Indicator */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold">
            <span className={`flex items-center gap-1.5 ${step === 'address' ? 'text-[#4A1724]' : 'text-[#D7B982]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border font-bold ${
                step !== 'address' ? 'bg-[#D7B982] text-[#4A1724] border-[#D7B982]' : 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724]'
              }`}>
                {step === 'review' ? '✓' : '1'}
              </span>
              DELIVERY
            </span>
            <span className="text-[#D7B982]/40">──</span>
            <span className={`flex items-center gap-1.5 ${step === 'review' ? 'text-[#4A1724]' : 'text-[#21191A]/40'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border font-bold ${
                step === 'review' ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724]' : 'bg-[#E8DDCE] text-[#21191A]/40 border-[#D7B982]/30'
              }`}>
                2
              </span>
              REVIEW
            </span>
          </div>

          <Link href="/catalog" className="text-xs text-[#21191A]/60 hover:text-[#4A1724] transition-colors font-medium">
            ← Continue Shopping
          </Link>
        </div>
      </header>

      {/* ── Guest Warning ── */}
      {!user && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-amber-800 font-semibold flex items-center gap-2">
            <span>⚠️</span> Sign in to save your order history and access exclusive member perks
          </p>
          <button onClick={() => openModal('login')} className="text-xs font-bold text-[#4A1724] underline hover:no-underline whitespace-nowrap">
            SIGN IN →
          </button>
        </div>
      )}

      {/* ── Saved Address Banner ── */}
      {addressSaved && step === 'address' && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
          <span>✓</span>
          <span>Delivery address auto-filled from your saved profile</span>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">

        {/* ══ LEFT: FORM STEPS ══════════════════════════════════════════════ */}
        <div className="space-y-8">

          {/* ─── STEP 1: SHIPPING ADDRESS ────────────────────────────────── */}
          {step === 'address' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#D7B982]">❀</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#4A1724] font-bold">Step 1 of 2</span>
                </div>
                <h1 className="font-serif text-3xl font-light text-[#4A1724]">
                  Delivery <span className="italic text-[#D7B982]">Details</span>
                </h1>
                <p className="text-xs text-[#21191A]/60 mt-1 font-light">
                  Your heirloom pieces will be carefully packaged and dispatched to this address.
                  {user && <span className="ml-1 text-emerald-700 font-semibold">Address is saved automatically to your profile ✓</span>}
                </p>
              </div>

              <div className="bg-[#E8DDCE]/40 rounded-3xl p-6 sm:p-8 border border-[#D7B982]/40 space-y-5 shadow-sm">
                {/* Contact Info */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#B98282] font-bold mb-3">Contact Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="checkout-fullname"
                        value={form.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        placeholder="Priya Sharma"
                        className={`w-full px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all ${errors.fullName ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                      />
                      {errors.fullName && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                        Email Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="checkout-email"
                        value={form.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="priya@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all ${errors.email ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                      />
                      {errors.email && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                        Mobile Number <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 py-3 rounded-xl bg-[#E8DDCE] border border-[#D7B982]/50 text-sm text-[#4A1724] font-bold whitespace-nowrap">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          id="checkout-phone"
                          value={form.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          className={`flex-1 px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all ${errors.phone ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                        />
                      </div>
                      {errors.phone && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#D7B982]/30 pt-5">
                  <p className="text-[10px] uppercase tracking-widest text-[#B98282] font-bold mb-3">Shipping Address</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                        Street / Flat / Area <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        id="checkout-address"
                        value={form.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        placeholder="Flat 4B, Rosewood Towers, MG Road, Koregaon Park"
                        rows={2}
                        className={`w-full px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all resize-none ${errors.address ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                      />
                      {errors.address && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                          City <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="checkout-city"
                          value={form.city}
                          onChange={(e) => handleFieldChange('city', e.target.value)}
                          placeholder="Pune"
                          className={`w-full px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all ${errors.city ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                        />
                        {errors.city && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                          State <span className="text-rose-600">*</span>
                        </label>
                        <select
                          id="checkout-state"
                          value={form.state}
                          onChange={(e) => handleFieldChange('state', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all appearance-none cursor-pointer ${errors.state ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                        >
                          <option value="">Select State</option>
                          {INDIA_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors.state && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.state}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#21191A]/60 font-semibold mb-1.5">
                          PIN Code <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="checkout-pincode"
                          value={form.pincode}
                          onChange={(e) => handleFieldChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="411001"
                          maxLength={6}
                          className={`w-full px-4 py-3 rounded-xl bg-[#F6F0E6] border text-sm text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:ring-2 focus:ring-[#4A1724]/30 transition-all ${errors.pincode ? 'border-rose-400' : 'border-[#D7B982]/50 hover:border-[#D7B982]'}`}
                        />
                        {errors.pincode && <p className="text-rose-600 text-[10px] mt-1 font-medium">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddressNext}
                className="w-full py-4 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-sm uppercase tracking-widest hover:bg-[#331019] active:scale-[0.99] transition-all shadow-xl border border-[#D7B982]/40 flex items-center justify-center gap-3"
              >
                <span>SAVE & CONTINUE TO REVIEW</span>
                <span>→</span>
              </button>
            </div>
          )}

          {/* ─── STEP 2: ORDER REVIEW ─────────────────────────────────────── */}
          {step === 'review' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#D7B982]">❀</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#4A1724] font-bold">Step 2 of 2</span>
                </div>
                <h1 className="font-serif text-3xl font-light text-[#4A1724]">
                  Review Your <span className="italic text-[#D7B982]">Order</span>
                </h1>
              </div>

              {/* Delivery Summary */}
              <div className="bg-[#E8DDCE]/40 rounded-3xl p-5 border border-[#D7B982]/40 space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-[#B98282] font-bold">Delivering To</p>
                  <button
                    onClick={() => setStep('address')}
                    className="text-[10px] font-bold text-[#4A1724] uppercase tracking-wider underline hover:no-underline"
                  >
                    EDIT
                  </button>
                </div>
                <div className="text-sm space-y-0.5">
                  <p className="font-bold text-[#21191A]">{form.fullName}</p>
                  <p className="text-[#21191A]/70 font-light">{form.address}</p>
                  <p className="text-[#21191A]/70 font-light">{form.city}, {form.state} – {form.pincode}</p>
                  <p className="text-[#21191A]/70 font-light">📱 +91 {form.phone} &nbsp;·&nbsp; ✉ {form.email}</p>
                </div>
                <div className="pt-1">
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ✓ Address saved to your profile
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="bg-[#E8DDCE]/40 rounded-3xl p-5 border border-[#D7B982]/40 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest text-[#B98282] font-bold mb-4">
                  Your Silhouettes ({items.length})
                </p>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#D7B982]/30 bg-[#E8DDCE]">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#4A1724] text-[#F6F0E6] text-[9px] font-bold rounded-full flex items-center justify-center border border-[#F6F0E6]">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm font-bold text-[#4A1724] truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] bg-[#D7B982]/30 text-[#4A1724] px-2 py-0.5 rounded font-bold uppercase">
                            Size: {item.size}
                          </span>
                          {item.color && <span className="text-[10px] text-[#21191A]/50 font-mono">{item.color}</span>}
                        </div>
                        {item.fabric && <p className="text-[10px] text-[#B98282] font-semibold mt-0.5">{item.fabric}</p>}
                      </div>
                      <p className="text-sm font-bold text-[#4A1724] flex-shrink-0">
                        ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#E8DDCE]/40 rounded-3xl p-5 border border-[#D7B982]/40 shadow-sm space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-[#B98282] font-bold">Payment Method</p>
                <div className="flex items-center gap-3 p-3 bg-[#F6F0E6] rounded-xl border border-[#D7B982]/50">
                  <div className="w-8 h-8 rounded-lg bg-[#4A1724] flex items-center justify-center text-[#D7B982] text-sm">💳</div>
                  <div>
                    <p className="text-sm font-bold text-[#21191A]">Cash on Delivery / Pay on Arrival</p>
                    <p className="text-[10px] text-[#21191A]/50 font-light">No advance payment required</p>
                  </div>
                  <div className="ml-auto">
                    <span className="w-4 h-4 rounded-full bg-[#4A1724] border-4 border-[#D7B982] block" />
                  </div>
                </div>
                <p className="text-[10px] text-[#21191A]/50 font-light">
                  🔒 All orders are secured. Payment collected at delivery.
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full py-4 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-sm uppercase tracking-widest hover:bg-[#331019] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-xl border border-[#D7B982]/40 flex items-center justify-center gap-3"
              >
                {isPlacing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#F6F0E6]/40 border-t-[#F6F0E6] rounded-full animate-spin" />
                    <span>PLACING YOUR ORDER…</span>
                  </>
                ) : (
                  <>
                    <span>PLACE ORDER • ₹ {total.toLocaleString('en-IN')}</span>
                    <span>✓</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-[#21191A]/50 font-light">
                By placing your order you agree to our{' '}
                <span className="underline cursor-pointer hover:text-[#4A1724]">Terms & Conditions</span>{' '}
                and{' '}
                <span className="underline cursor-pointer hover:text-[#4A1724]">Privacy Policy</span>.
              </p>
            </div>
          )}
        </div>

        {/* ══ RIGHT: ORDER SUMMARY PANEL ════════════════════════════════════ */}
        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="bg-[#E8DDCE]/50 rounded-3xl p-6 border border-[#D7B982]/50 shadow-lg space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B98282] font-bold">Your Order</p>
              <h2 className="font-serif text-xl font-bold text-[#4A1724] mt-0.5">
                {items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Selected
              </h2>
            </div>

            {/* Mini item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-[#D7B982]/30 bg-[#E8DDCE]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#4A1724] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#21191A]/50 font-mono">Qty: {item.quantity} · Size: {item.size}</p>
                  </div>
                  <p className="text-xs font-bold text-[#4A1724] flex-shrink-0">
                    ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-[#D7B982]/40 pt-4 space-y-2 text-xs text-[#21191A]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1"><span>🎟️</span><span>{couponCode} Applied</span></span>
                  <span className="font-mono">– ₹ {discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono font-semibold">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹ ${shipping}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#D7B982]/40 text-sm font-bold text-[#4A1724]">
                <span>Total Payable</span>
                <span className="font-mono text-base">₹ {total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="border-t border-[#D7B982]/30 pt-4 space-y-2">
              {[
                { icon: '🔒', text: 'Secure & Encrypted Checkout' },
                { icon: '🚚', text: 'Free Shipping above ₹5,000' },
                { icon: '↩️', text: 'Easy 7-Day Returns' },
                { icon: '🪡', text: 'Authentic Handwoven Craftsmanship' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[10px] text-[#21191A]/70 font-medium">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 border border-[#D7B982]/30 bg-[#4A1724]/5 text-center space-y-1">
            <p className="text-[9px] uppercase tracking-[0.35em] text-[#4A1724] font-bold">NOORÉ PROMISE</p>
            <p className="text-[10px] text-[#21191A]/70 font-light leading-relaxed">
              Every piece is inspected by our artisans before dispatch. If you're not delighted, we'll make it right.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
