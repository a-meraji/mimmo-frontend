"use client";

import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    // Reset form
    setFormData({ firstName: '', lastName: '', comment: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-6">
      <h2 className="text-lg font-bold text-text-charcoal">دیدگاه خود را بنویسید</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-xs font-medium text-text-gray">
            نام :
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-extralight bg-white text-text-charcoal placeholder:text-text-light focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 text-xs"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-xs font-medium text-text-gray">
            نام خانوادگی :
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-neutral-extralight bg-white text-text-charcoal placeholder:text-text-light focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 text-xs"
            placeholder="نام خانوادگی خود را وارد کنید"
          />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label htmlFor="comment" className="block text-xs font-medium text-text-gray">
            دیدگاه :
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-neutral-extralight bg-white text-text-charcoal placeholder:text-text-light focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 text-xs resize-none"
            placeholder="نظر خود را بنویسید..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
        >
          ارسال نظر
        </button>
      </form>
    </div>
  );
}

