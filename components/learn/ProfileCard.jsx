"use client";

import { User, Edit2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileCard({ user, onLogout }) {
  const router = useRouter();

  const completedCourses = user?.completedCoursesCount || 0;
  const userName = user?.name || user?.familyName 
    ? `${user.name || ''} ${user.familyName || ''}`.trim()
    : 'نام کاربر میمو';

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 w-full h-full shadow-lg flex flex-col">
      {/* User Info */}
      <div className="flex items-start gap-5 mb-8">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0 overflow-hidden ring-4 ring-white shadow-lg">
          {user?.avatar ? (
            <Image 
              src={user.avatar} 
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Name and Actions */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-text-charcoal mb-1">
            {userName}
          </h3>
          <p className="text-sm text-text-gray mb-4">
            {completedCourses} دوره تکمیل شده
          </p>
          
          {/* Icon Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 group"
              aria-label="ویرایش پروفایل"
            >
              <Edit2 className="w-5 h-5" aria-hidden="true" />
            </button>
            
            <button
              type="button"
              onClick={onLogout}
              className="p-2.5 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200"
              aria-label="خروج از حساب"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Word Section */}
      <div className="space-y-3 mt-auto">
        {/* Password/Key Info */}
        {user?.specialKey && (
          <div className="bg-gradient-to-br from-neutral-yellow/30 to-secondary-accent/30 rounded-2xl p-4">
            <p className="text-sm text-text-gray text-center">
              کلمه رمز : <span className="font-bold text-text-charcoal">{user.specialKey}</span>
            </p>
          </div>
        )}

        {/* Daily Word of the Day */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-text-gray">کلمه روز</p>
            <span className="text-xs font-semibold text-primary">Today</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary mb-1 tracking-wide">
              {user?.dailyWord?.italian || "Ciao"}
            </p>
            <p className="text-sm text-text-gray">
              {user?.dailyWord?.persian || "سلام"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

