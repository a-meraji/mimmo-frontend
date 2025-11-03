"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { toast } = useToast();
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mimmo_cart');
      const savedDiscount = localStorage.getItem('mimmo_discount');
      
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      if (savedDiscount) {
        const discount = JSON.parse(savedDiscount);
        setDiscountCode(discount.code);
        setDiscountAmount(discount.amount);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('mimmo_cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cart, isLoaded]);

  // Save discount to localStorage
  useEffect(() => {
    if (isLoaded && discountCode && discountAmount > 0) {
      try {
        localStorage.setItem('mimmo_discount', JSON.stringify({ code: discountCode, amount: discountAmount }));
      } catch (error) {
        console.error('Failed to save discount to localStorage:', error);
      }
    }
  }, [discountCode, discountAmount, isLoaded]);

  // Add item to cart
  const addToCart = useCallback((item) => {
    // Check if item already exists before state update
    const itemExists = cart.some((cartItem) => cartItem.id === item.id);
    
    if (itemExists) {
      // Item already in cart, show info and open modal
      toast.info('این دوره قبلاً به سبد خرید اضافه شده است');
    } else {
      // New item, add to cart
      setCart((prevCart) => [...prevCart, item]);
      toast.success('دوره با موفقیت به سبد خرید اضافه شد');
    }
    
    // Always open modal to show cart summary
    setIsModalOpen(true);
  }, [cart, toast]);

  // Remove item from cart
  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.info('دوره از سبد خرید حذف شد');
  }, [toast]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountCode('');
    setDiscountAmount(0);
    localStorage.removeItem('mimmo_cart');
    localStorage.removeItem('mimmo_discount');
    toast.success('سبد خرید خالی شد');
  }, [toast]);

  // Apply discount code
  const applyDiscount = useCallback((code) => {
    // Mock discount codes - in production, validate with backend
    const discounts = {
      'MIMMO10': 10,
      'MIMMO20': 20,
      'WELCOME': 15,
    };

    const discount = discounts[code.toUpperCase()];
    
    if (discount) {
      setDiscountCode(code.toUpperCase());
      setDiscountAmount(discount);
      return { success: true, amount: discount };
    } else {
      return { success: false, message: 'کد تخفیف نامعتبر است' };
    }
  }, []);

  // Remove discount
  const removeDiscount = useCallback(() => {
    setDiscountCode('');
    setDiscountAmount(0);
    localStorage.removeItem('mimmo_discount');
  }, []);

  // Calculate subtotal (Toman)
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  // Calculate subtotal (Euro)
  const euroSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.euroPrice || 0), 0);
  }, [cart]);

  // Calculate discount value (Toman)
  const discountValue = useMemo(() => {
    return Math.round((subtotal * discountAmount) / 100);
  }, [subtotal, discountAmount]);

  // Calculate discount value (Euro)
  const euroDiscountValue = useMemo(() => {
    return Math.round((euroSubtotal * discountAmount) / 100);
  }, [euroSubtotal, discountAmount]);

  // Calculate total (Toman)
  const total = useMemo(() => {
    return subtotal - discountValue;
  }, [subtotal, discountValue]);

  // Calculate total (Euro)
  const euroTotal = useMemo(() => {
    return euroSubtotal - euroDiscountValue;
  }, [euroSubtotal, euroDiscountValue]);

  // Total items count (number of unique items)
  const itemCount = useMemo(() => {
    return cart.length;
  }, [cart]);

  const value = {
    cart,
    isModalOpen,
    setIsModalOpen,
    addToCart,
    removeFromCart,
    clearCart,
    applyDiscount,
    removeDiscount,
    discountCode,
    discountAmount,
    subtotal,
    euroSubtotal,
    discountValue,
    euroDiscountValue,
    total,
    euroTotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

