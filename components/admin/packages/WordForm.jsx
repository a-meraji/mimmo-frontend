'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import ImageUpload from '../forms/ImageUpload';

export default function WordForm({ isOpen, onClose, onSave, word = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    word: '',
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (word) {
      setFormData({
        word: word.word || '',
        title: word.title || '',
        subtitle: word.subtitle || '',
        description: word.description || '',
        imageUrl: word.imageUrl || '',
      });
    } else {
      setFormData({ word: '', title: '', subtitle: '', description: '', imageUrl: '' });
    }
    setErrors({});
  }, [word, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.word.trim()) newErrors.word = 'کلمه الزامی است';
    if (!formData.title.trim()) newErrors.title = 'عنوان الزامی است';
    if (!formData.subtitle.trim()) newErrors.subtitle = 'زیرعنوان الزامی است';
    if (!formData.description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'تصویر الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      word: formData.word.trim(),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={word ? 'ویرایش کلمه' : 'افزودن کلمه جدید'} size="lg"
      footer={
        <>
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">لغو</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{isLoading ? 'در حال ذخیره...' : 'ذخیره'}</button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="کلمه" name="word" value={formData.word} onChange={handleChange} required error={errors.word} />
        <Input label="عنوان" name="title" value={formData.title} onChange={handleChange} required error={errors.title} />
        <Input label="زیرعنوان" name="subtitle" value={formData.subtitle} onChange={handleChange} required error={errors.subtitle} />
        <TextArea label="توضیحات" name="description" value={formData.description} onChange={handleChange} rows={4} required error={errors.description} />
        <ImageUpload label="تصویر کلمه" value={formData.imageUrl} onChange={handleImageChange} required error={errors.imageUrl} />
      </div>
    </Modal>
  );
}

