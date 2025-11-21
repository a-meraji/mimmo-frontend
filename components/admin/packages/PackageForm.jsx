'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import Checkbox from '../forms/Checkbox';
import ImageUpload from '../forms/ImageUpload';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUrl';

// Predefined constants
const PREDEFINED_LEVELS = ['A1', 'A2', 'B1'];
const PREDEFINED_BADGES = ['پرفروش', 'محبوب', 'جدید'];
const PREDEFINED_CATEGORIES = [
  { id: 'italian', label: 'زبان ایتالیایی' },
  { id: 'license', label: 'گواهینامه رانندگی' }
];
const DEFAULT_SPECIFICATIONS = [
  { icon: 'Clock', label: 'ساعت ویدیو آموزشی', value: '۲۴' },
  { icon: 'BookOpenText', label: 'از متوسطه تا پیشرفته', value: 'سطح A1' },
  { icon: 'NotebookText', label: 'تمرین و آزمون', value: 'دارد' }
];

export default function PackageForm({ isOpen, onClose, onSave, packageData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    packageName: '',
    subtitle: '',
    level: '',
    category: [],
    description: '',
    originalPrice: '',
    discountedPrice: '',
    euroPrice: '',
    euroDiscountPrice: '',
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
  
  // State for custom inputs
  const [customLevel, setCustomLevel] = useState('');
  const [showCustomLevel, setShowCustomLevel] = useState(false);
  const [customBadge, setCustomBadge] = useState('');
  const [showCustomBadge, setShowCustomBadge] = useState(false);

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
        euroPrice: packageData.euroPrice || '',
        euroDiscountPrice: packageData.euroDiscountPrice || '',
        discountTitle: packageData.discountTitle || '',
        isInstallmentAvailable: packageData.isInstallmentAvailable || false,
        installmentCount: packageData.installmentCount || '',
        source: packageData.source || '',
        imageUrl: packageData.imageUrl || '',
        badge: packageData.badge || '',
        rate: packageData.rate || '',
        rateCount: packageData.rateCount || '',
        specifications: packageData.specifications || [...DEFAULT_SPECIFICATIONS],
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
      euroPrice: '',
      euroDiscountPrice: '',
      discountTitle: '',
      isInstallmentAvailable: false,
      installmentCount: '',
      source: '',
      imageUrl: '',
      badge: '',
      rate: '',
      rateCount: '',
      specifications: [...DEFAULT_SPECIFICATIONS],
    });
    setCategoryInput('');
    setSpecInput({ icon: '', label: '', value: '' });
    setCustomLevel('');
    setShowCustomLevel(false);
    setCustomBadge('');
    setShowCustomBadge(false);
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
  const removeCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (specInput.label && specInput.value) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { 
          icon: 'BookOpenText',
          label: specInput.label,
          value: specInput.value
        }],
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
    // discountTitle is now optional
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

    // Ensure all specs have icon
    const specsWithIcons = formData.specifications.map(spec => ({
      ...spec,
      icon: spec.icon || 'BookOpenText'
    }));

    // Convert prices to numbers and clean data
    const cleanData = {
      ...formData,
      specifications: specsWithIcons,
      originalPrice: Number(formData.originalPrice),
      discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : null,
      euroPrice: formData.euroPrice ? Number(formData.euroPrice) : null,
      euroDiscountPrice: formData.euroDiscountPrice ? Number(formData.euroDiscountPrice) : null,
      discountTitle: formData.discountTitle || '',
      installmentCount: formData.installmentCount ? Number(formData.installmentCount) : 0,
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
            placeholder="مثلا ۵ درس اول اسپرو۱"
            required
            error={errors.subtitle}
          />
          
          <div className="grid grid-cols-2 gap-4">
            {/* Level Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سطح <span className="text-red-500">*</span>
              </label>
              {!showCustomLevel ? (
                <div className="space-y-2">
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">انتخاب کنید</option>
                    {PREDEFINED_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomLevel(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    + افزودن سطح سفارشی
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLevel}
                    onChange={(e) => setCustomLevel(e.target.value)}
                    placeholder="سطح سفارشی"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customLevel.trim()) {
                        setFormData(prev => ({ ...prev, level: customLevel }));
                        setCustomLevel('');
                        setShowCustomLevel(false);
                      }
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    تایید
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomLevel(false);
                      setCustomLevel('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    لغو
                  </button>
                </div>
              )}
              {errors.level && <p className="text-sm text-red-600 mt-1">{errors.level}</p>}
            </div>

            {/* Badge Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نشان <span className="text-red-500">*</span>
              </label>
              {!showCustomBadge ? (
                <div className="space-y-2">
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">انتخاب کنید</option>
                    {PREDEFINED_BADGES.map(badge => (
                      <option key={badge} value={badge}>{badge}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomBadge(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    + افزودن نشان سفارشی
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customBadge}
                    onChange={(e) => setCustomBadge(e.target.value)}
                    placeholder="نشان سفارشی"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customBadge.trim()) {
                        setFormData(prev => ({ ...prev, badge: customBadge }));
                        setCustomBadge('');
                        setShowCustomBadge(false);
                      }
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    تایید
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomBadge(false);
                      setCustomBadge('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    لغو
                  </button>
                </div>
              )}
              {errors.badge && <p className="text-sm text-red-600 mt-1">{errors.badge}</p>}
            </div>
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
          <div>
            <select
              value=""
              onChange={(e) => {
                const value = e.target.value;
                if (value && !formData.category.includes(value)) {
                  setFormData(prev => ({
                    ...prev,
                    category: [...prev.category, value]
                  }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">انتخاب دسته‌بندی</option>
              {PREDEFINED_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.category.map((catId, index) => {
              const catData = PREDEFINED_CATEGORIES.find(c => c.id === catId);
              return (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {catData?.label || catId}
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">قیمت‌گذاری</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="قیمت اصلی (تومان)"
              name="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={handleChange}
              required
              error={errors.originalPrice}
            />
            <Input
              label="قیمت تخفیف‌خورده (تومان)"
              name="discountedPrice"
              type="number"
              value={formData.discountedPrice}
              onChange={handleChange}
              placeholder="اختیاری"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="قیمت یورو"
              name="euroPrice"
              type="number"
              value={formData.euroPrice}
              onChange={handleChange}
              placeholder="اختیاری"
            />
            <Input
              label="قیمت یورو با تخفیف"
              name="euroDiscountPrice"
              type="number"
              value={formData.euroDiscountPrice}
              onChange={handleChange}
              placeholder="اختیاری"
            />
          </div>
          <Input
            label="عنوان تخفیف"
            name="discountTitle"
            value={formData.discountTitle}
            onChange={handleChange}
            placeholder="اختیاری - مثال: 10% تخفیف ویژه"
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
            placeholder="لینک پکیج در نرم افزار دیگر و یا اشاره به بخش های کتاب اسپرسو"
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
          <div>
            <ImageUpload
              label="تصویر پکیج"
              value={formData.imageUrl}
              onChange={handleImageChange}
              required
              error={errors.imageUrl}
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">پیش‌نمایش:</p>
                <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden">
                  <Image
                    src={getImageUrl(formData.imageUrl)}
                    alt="پیش‌نمایش"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={75}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">مشخصات</h3>
          
          {/* Existing specifications with edit capability */}
          {formData.specifications.length > 0 && (
            <div dir="rtl" className="space-y-2">
              {formData.specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    value={spec.label}
                    onChange={(e) => {
                      const updated = [...formData.specifications];
                      updated[index].label = e.target.value;
                      setFormData(prev => ({ ...prev, specifications: updated }));
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="عنوان"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => {
                      const updated = [...formData.specifications];
                      updated[index].value = e.target.value;
                      setFormData(prev => ({ ...prev, specifications: updated }));
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="مقدار"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new specification */}
          <div>
            <p className="text-sm text-gray-600 mb-2">افزودن مشخصه جدید:</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={specInput.label}
                onChange={(e) => setSpecInput(prev => ({ ...prev, label: e.target.value }))}
                placeholder="عنوان مشخصه جدید"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                value={specInput.value}
                onChange={(e) => setSpecInput(prev => ({ ...prev, value: e.target.value }))}
                placeholder="مقدار"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={addSpecification}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
            >
              + افزودن مشخصه
            </button>
          </div>
          
          {errors.specifications && <p className="text-sm text-red-600">{errors.specifications}</p>}
        </div>
      </div>
    </Modal>
  );
}

