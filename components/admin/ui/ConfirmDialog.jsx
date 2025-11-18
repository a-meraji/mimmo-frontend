'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'تأیید عملیات',
  message = 'آیا از انجام این عملیات اطمینان دارید؟',
  confirmText = 'تأیید',
  cancelText = 'لغو',
  variant = 'danger',
  isLoading = false,
}) {
  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    primary: 'bg-primary hover:bg-primary/90',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
                     hover:bg-gray-50 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg text-white font-medium transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              ${variantColors[variant]}
            `}
          >
            {isLoading ? 'در حال انجام...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            variant === 'danger' ? 'bg-red-100' :
            variant === 'warning' ? 'bg-amber-100' :
            'bg-primary/10'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              variant === 'danger' ? 'text-red-600' :
              variant === 'warning' ? 'text-amber-600' :
              'text-primary'
            }`} aria-hidden="true" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
}

