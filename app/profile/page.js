"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MessageSquare, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, authenticatedFetch } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    familyName: '',
    email: '',
    telegramId: '',
  });

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        familyName: user.familyName || '',
        email: user.email || '',
        telegramId: user.telegramId || '',
      });
    }
  }, [user]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('خروج موفقیت‌آمیز بود');
    } catch (error) {
      toast.error('خطا در خروج از حساب');
    }
  }, [logout, toast]);

  // Handle save profile
  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);

    try {
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/user/profile`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('خطا در به‌روزرسانی اطلاعات');
    } finally {
      setIsSaving(false);
    }
  }, [formData, authenticatedFetch, toast]);

  // Handle input change
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-neutral-indigo/10 to-white flex items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری...</p>
        </div>
      </main>
    );
  }

  // Redirect if not authenticated (middleware should handle this, but as backup)
  if (!isAuthenticated) {
    router.push('/auth');
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-indigo/10 to-white px-4 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-charcoal mb-2">پروفایل کاربری</h1>
          <p className="text-text-gray">اطلاعات حساب کاربری شما</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-lighter overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="w-10 h-10" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.name || user?.familyName 
                    ? `${user.name || ''} ${user.familyName || ''}`.trim()
                    : 'کاربر میمو'
                  }
                </h2>
                <p className="text-white/80 dir-ltr">{user?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {/* Info Grid */}
            <div className="space-y-4 mb-8">
              {/* Name */}
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-text-gray mb-2">
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span>نام</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="نام خود را وارد کنید"
                  className="w-full px-4 py-3 border-2 border-neutral-gray rounded-xl
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                    transition-all duration-200 text-text-charcoal
                    disabled:bg-neutral-lighter disabled:cursor-not-allowed"
                />
              </div>

              {/* Family Name */}
              <div>
                <label htmlFor="familyName" className="flex items-center gap-2 text-sm font-medium text-text-gray mb-2">
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span>نام خانوادگی</span>
                </label>
                <input
                  id="familyName"
                  type="text"
                  value={formData.familyName}
                  onChange={(e) => handleInputChange('familyName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="نام خانوادگی خود را وارد کنید"
                  className="w-full px-4 py-3 border-2 border-neutral-gray rounded-xl
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                    transition-all duration-200 text-text-charcoal
                    disabled:bg-neutral-lighter disabled:cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-text-gray mb-2">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>ایمیل</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border-2 border-neutral-gray rounded-xl
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                    transition-all duration-200 text-text-charcoal
                    disabled:bg-neutral-lighter disabled:cursor-not-allowed
                    dir-ltr text-left"
                />
              </div>

              {/* Telegram ID */}
              <div>
                <label htmlFor="telegramId" className="flex items-center gap-2 text-sm font-medium text-text-gray mb-2">
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  <span>آیدی تلگرام</span>
                </label>
                <input
                  id="telegramId"
                  type="text"
                  value={formData.telegramId}
                  onChange={(e) => handleInputChange('telegramId', e.target.value)}
                  disabled={!isEditing}
                  placeholder="@username"
                  className="w-full px-4 py-3 border-2 border-neutral-gray rounded-xl
                    focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                    transition-all duration-200 text-text-charcoal
                    disabled:bg-neutral-lighter disabled:cursor-not-allowed
                    dir-ltr text-left"
                />
              </div>

              {/* Phone (Read-only) */}
              <div>
                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-text-gray mb-2">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>شماره تلفن</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={user?.phoneNumber || ''}
                  disabled
                  className="w-full px-4 py-3 border-2 border-neutral-gray rounded-xl
                    bg-neutral-lighter cursor-not-allowed text-text-gray
                    dir-ltr text-left"
                />
                <p className="text-xs text-text-gray mt-1">شماره تلفن قابل تغییر نیست</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold
                      py-3 px-6 rounded-xl transition-all duration-200
                      disabled:bg-neutral-gray disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                      shadow-lg hover:shadow-xl"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>در حال ذخیره...</span>
                      </>
                    ) : (
                      <span>ذخیره تغییرات</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data
                      setFormData({
                        name: user?.name || '',
                        familyName: user?.familyName || '',
                        email: user?.email || '',
                        telegramId: user?.telegramId || '',
                      });
                    }}
                    disabled={isSaving}
                    className="flex-1 bg-neutral-lighter hover:bg-neutral-gray text-text-charcoal font-semibold
                      py-3 px-6 rounded-xl transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    لغو
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold
                      py-3 px-6 rounded-xl transition-all duration-200
                      shadow-lg hover:shadow-xl"
                  >
                    ویرایش اطلاعات
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold
                      py-3 px-6 rounded-xl transition-all duration-200
                      flex items-center justify-center gap-2
                      border-2 border-rose-200"
                  >
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span>خروج از حساب</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-gray">
            عضو میمو آکادمی از{' '}
            <span className="font-medium text-text-charcoal">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '—'}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}

