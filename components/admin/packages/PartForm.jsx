'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';

export default function PartForm({ isOpen, onClose, onSave, part = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    numericOrder: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (part) {
      setFormData({
        title: part.title || '',
        numericOrder: part.numericOrder || '',
      });
    } else {
      setFormData({ title: '', numericOrder: '' });
    }
    setErrors({});
  }, [part, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'عنوان بخش الزامی است';
    if (!formData.numericOrder) newErrors.numericOrder = 'ترتیب الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      title: formData.title.trim(),
      numericOrder: Number(formData.numericOrder),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={part ? 'ویرایش بخش' : 'افزودن بخش جدید'}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            لغو
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="عنوان بخش" name="title" value={formData.title} onChange={handleChange} required error={errors.title} />
        <Input label="ترتیب نمایش" name="numericOrder" type="number" value={formData.numericOrder} onChange={handleChange} required error={errors.numericOrder} />
      </div>
    </Modal>
  );
}

