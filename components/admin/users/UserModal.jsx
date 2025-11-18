'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import Select from '../forms/Select';

export default function UserModal({ isOpen, onClose, onSave, user = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    familyName: '',
    email: '',
    phoneNumber: '',
    telegramId: '',
    role: 'user',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        familyName: user.familyName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        telegramId: user.telegramId || '',
        role: user.role || 'user',
      });
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        familyName: '',
        email: '',
        phoneNumber: '',
        telegramId: '',
        role: 'user',
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // At least one of email, phone, or telegram must be provided
    if (!formData.email && !formData.phoneNumber && !formData.telegramId) {
      newErrors.email = 'حداقل یکی از ایمیل، شماره تلفن یا آیدی تلگرام باید وارد شود';
    }

    // Email format validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
    }

    // Phone number validation if provided
    if (formData.phoneNumber && !/^09\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'شماره تلفن باید با 09 شروع شود و 11 رقم باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Remove empty fields
    const cleanData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    onSave(cleanData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
                     hover:bg-gray-50 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            لغو
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium
                     hover:bg-primary/90 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="نام"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="نام"
          />
          <Input
            label="نام خانوادگی"
            name="familyName"
            value={formData.familyName}
            onChange={handleChange}
            placeholder="نام خانوادگی"
          />
        </div>

        <Input
          label="ایمیل"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@domain.com"
          error={errors.email}
        />

        <Input
          label="شماره تلفن"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="09123456789"
          error={errors.phoneNumber}
        />

        <Input
          label="آیدی تلگرام"
          name="telegramId"
          value={formData.telegramId}
          onChange={handleChange}
          placeholder="@username"
        />

        <Select
          label="نقش کاربر"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: 'user', label: 'کاربر عادی' },
            { value: 'admin', label: 'مدیر' },
          ]}
          required
        />
      </div>
    </Modal>
  );
}

