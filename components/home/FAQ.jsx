"use client";

import { useState, useCallback, useMemo } from "react";
import FAQItem from "./FAQItem";
import Image from "next/image";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null); // Track which FAQ is open (null = none open)

  const faqs = [
    {
      id: 1,
      question: "نحوه کار میمو چجوریه؟",
      answer:
        "میمو یک پلتفرم آموزشی جامع است که با ترکیب ویدیوهای آموزشی، تمرینات تعاملی، آزمون‌های منظم و پشتیبانی مستمر، به شما کمک می‌کند تا زبان ایتالیایی را به طور کامل فرا بگیرید. شما می‌توانید در هر زمان و مکان به محتوای آموزشی دسترسی داشته باشید.",
    },
    {
      id: 2,
      question: "گواهینامه حقوق طول میدیشه صادر شه؟",
      answer:
        "پس از اتمام موفقیت‌آمیز دوره و قبولی در آزمون نهایی، گواهینامه معتبر شما ظرف 2 تا 3 هفته صادر و به آدرس شما ارسال می‌شود. این گواهینامه دارای اعتبار بین‌المللی است.",
    },
    {
      id: 3,
      question: "سابقه میمو چقدره ؟",
      answer:
        "میمو با بیش از 8 سال تجربه در زمینه آموزش زبان ایتالیایی و کمک به اخذ گواهینامه رانندگی در ایتالیا، توانسته هزاران دانشجو را به موفقیت برساند. تیم ما متشکل از اساتید با تجربه و بومی ایتالیایی است.",
    },
    {
      id: 4,
      question: "هزینه ثبت نام آزمون چقدره ؟",
      answer:
        "هزینه ثبت نام در آزمون‌ها بسته به نوع دوره و سطح آن متفاوت است. برای اطلاع از هزینه دقیق می‌توانید با پشتیبانی ما تماس بگیرید یا به بخش پکیج‌های آموزشی مراجعه کنید. ما معمولاً تخفیف‌های ویژه‌ای برای ثبت نام زودهنگام ارائه می‌دهیم.",
    },
  ];

  const handleToggle = useCallback((index) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  return (
    <section className="w-full mx-auto py-20 bg-gradient-to-b from-white via-neutral-indigo to-white" aria-label="سوالات متداول">
      <div className="container w-fit mx-auto px-6 gap-x-4 lg:grid lg:grid-cols-3 justify-center">
        {/* Section Title */}
        <div>
          <h2 className="text-3xl font-extrabold text-text-charcoal text-center lg:text-right mb-4">
            پاسخ به سوالات متداول شما
          </h2>
          <p className="text-text-gray text-lg font-medium text-center lg:text-right mb-12">
            شاید جواب سوالتون اینجا باشه!
          </p>
          <Image 
            src="/questions.webp"
            className="hidden lg:block"
            alt="تصویر سوالات متداول"
            width={300}
            height={300}
            loading="lazy"
            quality={75}
          />
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl space-y-4 lg:col-span-2" role="list">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={faq.id} 
              question={faq.question} 
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

