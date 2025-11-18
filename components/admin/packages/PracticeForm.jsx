'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import Select from '../forms/Select';
import ImageUpload from '../forms/ImageUpload';

export default function PracticeForm({ isOpen, onClose, onSave, practice = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (practice) {
      const opts = practice.options || {};
      setFormData({
        question: practice.question || '',
        optionA: opts.a || '',
        optionB: opts.b || '',
        optionC: opts.c || '',
        optionD: opts.d || '',
        correctAnswer: practice.correctAnswer || '',
        explanation: practice.explanation || '',
        imageUrl: practice.imageUrl || '',
      });
    } else {
      setFormData({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '', explanation: '', imageUrl: '' });
    }
    setErrors({});
  }, [practice, isOpen]);

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
    if (!formData.question.trim()) newErrors.question = 'سوال الزامی است';
    if (!formData.optionA.trim()) newErrors.optionA = 'گزینه الف الزامی است';
    if (!formData.optionB.trim()) newErrors.optionB = 'گزینه ب الزامی است';
    if (!formData.optionC.trim()) newErrors.optionC = 'گزینه ج الزامی است';
    if (!formData.optionD.trim()) newErrors.optionD = 'گزینه د الزامی است';
    if (!formData.correctAnswer) newErrors.correctAnswer = 'پاسخ صحیح الزامی است';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      question: formData.question.trim(),
      options: {
        a: formData.optionA.trim(),
        b: formData.optionB.trim(),
        c: formData.optionC.trim(),
        d: formData.optionD.trim(),
      },
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation.trim() || null,
      imageUrl: formData.imageUrl || null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={practice ? 'ویرایش تمرین' : 'افزودن تمرین جدید'} size="lg"
      footer={
        <>
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">لغو</button>
          <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">{isLoading ? 'در حال ذخیره...' : 'ذخیره'}</button>
        </>
      }
    >
      <div className="space-y-4">
        <TextArea label="سوال" name="question" value={formData.question} onChange={handleChange} rows={3} required error={errors.question} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="گزینه الف" name="optionA" value={formData.optionA} onChange={handleChange} required error={errors.optionA} />
          <Input label="گزینه ب" name="optionB" value={formData.optionB} onChange={handleChange} required error={errors.optionB} />
          <Input label="گزینه ج" name="optionC" value={formData.optionC} onChange={handleChange} required error={errors.optionC} />
          <Input label="گزینه د" name="optionD" value={formData.optionD} onChange={handleChange} required error={errors.optionD} />
        </div>
        <Select label="پاسخ صحیح" name="correctAnswer" value={formData.correctAnswer} onChange={handleChange} required error={errors.correctAnswer}
          options={[
            { value: 'a', label: 'الف' },
            { value: 'b', label: 'ب' },
            { value: 'c', label: 'ج' },
            { value: 'd', label: 'د' },
          ]}
        />
        <TextArea label="توضیحات" name="explanation" value={formData.explanation} onChange={handleChange} rows={3} />
        <ImageUpload label="تصویر سوال (اختیاری)" value={formData.imageUrl} onChange={handleImageChange} />
      </div>
    </Modal>
  );
}

