'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';

export default function ChapterForm({ isOpen, onClose, onSave, chapter = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    numericOrder: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (chapter) {
      setFormData({
        title: chapter.title || '',
        numericOrder: chapter.numericOrder || '',
      });
    } else {
      setFormData({
        title: '',
        numericOrder: '',
      });
    }
    setErrors({});
  }, [chapter, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'عنوان فصل الزامی است';
    if (!formData.numericOrder) newErrors.numericOrder = 'ترتیب الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const cleanData = {
      title: formData.title.trim(),
      numericOrder: Number(formData.numericOrder),
    };

    onSave(cleanData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={chapter ? 'ویرایش فصل' : 'افزودن فصل جدید'}
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
        <Input
          label="عنوان فصل"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          error={errors.title}
        />
        <Input
          label="ترتیب نمایش"
          name="numericOrder"
          type="number"
          value={formData.numericOrder}
          onChange={handleChange}
          required
          error={errors.numericOrder}
        />
      </div>
    </Modal>
  );
}

