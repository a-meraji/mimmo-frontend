'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import Checkbox from '../forms/Checkbox';
import ImageUpload from '../forms/ImageUpload';

export default function LessonForm({ isOpen, onClose, onSave, lesson = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    numericOrder: '',
    imageUrl: '',
    isFree: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        numericOrder: lesson.numericOrder || '',
        imageUrl: lesson.imageUrl || '',
        isFree: lesson.isFree || false,
      });
    } else {
      setFormData({ title: '', description: '', numericOrder: '', imageUrl: '', isFree: false });
    }
    setErrors({});
  }, [lesson, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'عنوان درس الزامی است';
    if (!formData.description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (!formData.numericOrder) newErrors.numericOrder = 'ترتیب الزامی است';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'تصویر الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      numericOrder: Number(formData.numericOrder),
      imageUrl: formData.imageUrl,
      isFree: formData.isFree,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lesson ? 'ویرایش درس' : 'افزودن درس جدید'}
      size="lg"
      footer={
        <>
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">لغو</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isLoading ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="عنوان درس" name="title" value={formData.title} onChange={handleChange} required error={errors.title} />
        <TextArea label="توضیحات" name="description" value={formData.description} onChange={handleChange} rows={3} required error={errors.description} />
        <Input label="ترتیب نمایش" name="numericOrder" type="number" value={formData.numericOrder} onChange={handleChange} required error={errors.numericOrder} />
        <ImageUpload label="تصویر درس" value={formData.imageUrl} onChange={handleImageChange} required error={errors.imageUrl} />
        <Checkbox label="درس رایگان" name="isFree" checked={formData.isFree} onChange={handleChange} />
      </div>
    </Modal>
  );
}

