"use client";

import { useEffect } from 'react';
import { X, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function EuroPaymentModal({ isOpen, onClose, euroTotal }) {
  const { toast } = useToast();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} کپی شد`);
    }).catch(() => {
      toast.error('خطا در کپی کردن');
    });
  };

  if (!isOpen) return null;

  const paymentMethods = [

    {
      title: "Revolut - ایبان",
      items: [
        { label: "نام صاحب حساب", value: "Soudabeh Amini Khoraskani", copy: false },
        { label: "Revolut ID", value: "soudiamini" },
        { label: "IBAN", value: "LT403250099043625613" },
      ]
    },
    {
      title: "BBVA",
      items: [
        { label: "نام صاحب حساب", value: "Soudabeh Amini Khoraskani", copy: false },
        { label: "IBAN", value: "IT87Z0357601601010001150628" },
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[90] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="euro-payment-title"
      >
        <div className="min-h-screen px-4 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 w-full max-w-2xl animate-slide-down">
            
            {/* Header */}
            <div className="bg-gradient-to-l from-amber-400 to-amber-500 p-4 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="بستن"
                type="button"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <div className="text-center">
                <h2 id="euro-payment-title" className="text-xl font-bold mb-1">
                  پرداخت با یورو (€)
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-white/90">مبلغ:</span>
                  <span className="text-2xl font-black">
                    €{euroTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              
              {/* Instruction */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 border border-amber-200">
                <p className="text-xs text-text-charcoal text-center">
                  یکی از روش‌های زیر را انتخاب کنید:
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                {paymentMethods.map((method, idx) => (
                  <div key={idx} className="bg-white border border-neutral-lighter rounded-xl p-3 hover:border-amber-200 transition-all">
                    <h3 className="text-sm font-bold text-text-charcoal mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      {method.title}
                    </h3>
                    <div className="space-y-2">
                      {method.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-text-gray whitespace-nowrap">
                            {item.label}:
                          </span>
                          <div className="flex items-center gap-1.5 flex-1 justify-end">
                            <span className="text-xs font-semibold text-text-charcoal text-left dir-ltr bg-neutral-extralight px-2 py-1.5 rounded-lg flex-1 max-w-sm">
                              {item.value}
                            </span>
                            {item.copy !== false && (
                              <button
                                onClick={() => copyToClipboard(item.value, item.label)}
                                className="p-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors flex-shrink-0"
                                aria-label={`کپی ${item.label}`}
                                type="button"
                              >
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-lighter"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-text-gray">بعد از پرداخت</span>
                </div>
              </div>

              {/* After Payment Instructions */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-xl p-3 border border-green-200">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-text-gray leading-relaxed mb-2">
                      تصویر فیش واریزی را ارسال کنید:
                    </p>
                    
                    {/* Social Links */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="https://www.instagram.com/italian4u.italian4u/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-white p-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white transition-all group border border-pink-200"
                      >
                        <span className="text-xs font-semibold">اینستاگرام</span>
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      </a>
                      
                      <a
                        href="https://web.telegram.org/a/#italian4u"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-white p-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all group border border-blue-200"
                      >
                        <span className="text-xs font-semibold">تلگرام</span>
                        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="border-t border-neutral-lighter p-4 bg-neutral-indigo/20">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl font-semibold bg-white text-text-charcoal hover:bg-neutral-extralight transition-colors border border-neutral-lighter text-sm"
                type="button"
              >
                بستن
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

