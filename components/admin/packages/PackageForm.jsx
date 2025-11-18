'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import Checkbox from '../forms/Checkbox';
import ImageUpload from '../forms/ImageUpload';

export default function PackageForm({ isOpen, onClose, onSave, packageData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    packageName: '',
    subtitle: '',
    level: '',
    category: [],
    description: '',
    originalPrice: '',
    discountedPrice: '',
    discountTitle: '',
    isInstallmentAvailable: false,
    installmentCount: '',
    source: '',
    imageUrl: '',
    badge: '',
    rate: '',
    rateCount: '',
    specifications: [],
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [specInput, setSpecInput] = useState({ icon: '', label: '', value: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (packageData) {
      setFormData({
        packageName: packageData.packageName || '',
        subtitle: packageData.subtitle || '',
        level: packageData.level || '',
        category: packageData.category || [],
        description: packageData.description || '',
        originalPrice: packageData.originalPrice || '',
        discountedPrice: packageData.discountedPrice || '',
        discountTitle: packageData.discountTitle || '',
        isInstallmentAvailable: packageData.isInstallmentAvailable || false,
        installmentCount: packageData.installmentCount || '',
        source: packageData.source || '',
        imageUrl: packageData.imageUrl || '',
        badge: packageData.badge || '',
        rate: packageData.rate || '',
        rateCount: packageData.rateCount || '',
        specifications: packageData.specifications || [],
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [packageData, isOpen]);

  const resetForm = () => {
    setFormData({
      packageName: '',
      subtitle: '',
      level: '',
      category: [],
      description: '',
      originalPrice: '',
      discountedPrice: '',
      discountTitle: '',
      isInstallmentAvailable: false,
      installmentCount: '',
      source: '',
      imageUrl: '',
      badge: '',
      rate: '',
      rateCount: '',
      specifications: [],
    });
    setCategoryInput('');
    setSpecInput({ icon: '', label: '', value: '' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (url) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const addCategory = () => {
    if (categoryInput.trim()) {
      setFormData(prev => ({
        ...prev,
        category: [...prev.category, categoryInput.trim()],
      }));
      setCategoryInput('');
    }
  };

  const removeCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (specInput.icon && specInput.label && specInput.value) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { ...specInput }],
      }));
      setSpecInput({ icon: '', label: '', value: '' });
    }
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.packageName.trim()) newErrors.packageName = 'نام پکیج الزامی است';
    if (!formData.subtitle.trim()) newErrors.subtitle = 'زیرعنوان الزامی است';
    if (!formData.level.trim()) newErrors.level = 'سطح الزامی است';
    if (!formData.description.trim()) newErrors.description = 'توضیحات الزامی است';
    if (!formData.originalPrice) newErrors.originalPrice = 'قیمت اصلی الزامی است';
    if (!formData.discountTitle.trim()) newErrors.discountTitle = 'عنوان تخفیف الزامی است';
    if (!formData.source.trim()) newErrors.source = 'منبع الزامی است';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'تصویر الزامی است';
    if (!formData.badge.trim()) newErrors.badge = 'نشان الزامی است';
    if (formData.category.length === 0) newErrors.category = 'حداقل یک دسته‌بندی الزامی است';
    if (formData.specifications.length === 0) newErrors.specifications = 'حداقل یک مشخصه الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // Convert prices to numbers
    const cleanData = {
      ...formData,
      originalPrice: Number(formData.originalPrice),
      discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : null,
      installmentCount: formData.installmentCount ? Number(formData.installmentCount) : null,
      rate: formData.rate ? Number(formData.rate) : null,
      rateCount: formData.rateCount ? Number(formData.rateCount) : null,
    };

    onSave(cleanData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={packageData ? 'ویرایش پکیج' : 'افزودن پکیج جدید'}
      size="xl"
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
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">اطلاعات پایه</h3>
          <Input
            label="نام پکیج"
            name="packageName"
            value={formData.packageName}
            onChange={handleChange}
            required
            error={errors.packageName}
          />
          <Input
            label="زیرعنوان"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
            error={errors.subtitle}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="سطح"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="مثال: مبتدی، متوسط، پیشرفته"
              required
              error={errors.level}
            />
            <Input
              label="نشان"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="مثال: محبوب، جدید"
              required
              error={errors.badge}
            />
          </div>
          <TextArea
            label="توضیحات"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            error={errors.description}
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">دسته‌بندی‌ها</h3>
          <div className="flex gap-2">
            <Input
              name="categoryInput"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="دسته‌بندی جدید"
            />
            <button
              type="button"
              onClick={addCategory}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              افزودن
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.category.map((cat, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">قیمت‌گذاری</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="قیمت اصلی"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleChange}
              required
              error={errors.originalPrice}
            />
            <Input
              label="قیمت تخفیف‌خورده"
              name="discountedPrice"
              type="number"
              value={formData.discountedPrice}
              onChange={handleChange}
            />
          </div>
          <Input
            label="عنوان تخفیف"
            name="discountTitle"
            value={formData.discountTitle}
            onChange={handleChange}
            placeholder="مثال: تخفیف ویژه"
            required
            error={errors.discountTitle}
          />
          <Checkbox
            label="امکان خرید اقساطی"
            name="isInstallmentAvailable"
            checked={formData.isInstallmentAvailable}
            onChange={handleChange}
          />
          {formData.isInstallmentAvailable && (
            <Input
              label="تعداد اقساط"
              name="installmentCount"
              type="number"
              value={formData.installmentCount}
              onChange={handleChange}
            />
          )}
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">اطلاعات تکمیلی</h3>
          <Input
            label="منبع"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            error={errors.source}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="امتیاز"
              name="rate"
              type="number"
              step="0.1"
              value={formData.rate}
              onChange={handleChange}
            />
            <Input
              label="تعداد نظرات"
              name="rateCount"
              type="number"
              value={formData.rateCount}
              onChange={handleChange}
            />
          </div>
          <ImageUpload
            label="تصویر پکیج"
            value={formData.imageUrl}
            onChange={handleImageChange}
            required
            error={errors.imageUrl}
          />
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">مشخصات</h3>
          <div className="grid grid-cols-3 gap-2">
            <Input
              name="specIcon"
              value={specInput.icon}
              onChange={(e) => setSpecInput(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="آیکون"
            />
            <Input
              name="specLabel"
              value={specInput.label}
              onChange={(e) => setSpecInput(prev => ({ ...prev, label: e.target.value }))}
              placeholder="عنوان"
            />
            <Input
              name="specValue"
              value={specInput.value}
              onChange={(e) => setSpecInput(prev => ({ ...prev, value: e.target.value }))}
              placeholder="مقدار"
            />
          </div>
          <button
            type="button"
            onClick={addSpecification}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            افزودن مشخصه
          </button>
          <div className="space-y-2">
            {formData.specifications.map((spec, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-700">{spec.icon}</span>
                  <span className="font-medium">{spec.label}:</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          {errors.specifications && <p className="text-sm text-red-600">{errors.specifications}</p>}
        </div>
      </div>
    </Modal>
  );
}

