"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(undefined);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = toastId++;
    
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, message, type, duration, isExiting: false }
    ]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  // Remove a toast by ID (with exit animation)
  const removeToast = useCallback((id) => {
    // First, mark as exiting to trigger animation
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );

    // After animation completes, actually remove from DOM
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 300); // Match animation duration
  }, []);

  // Helper methods for different toast types
  const toast = useCallback({
    info: (message, duration) => addToast(message, 'info', duration),
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    toast,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

