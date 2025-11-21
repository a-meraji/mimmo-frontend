'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError } from '@/utils/errorHandler';
import { 
  userManagement, 
  paymentManagement, 
  packageManagement,
  commentManagement,
  questionManagement 
} from '@/utils/adminApi';
import StatCard from '@/components/admin/ui/StatCard';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import { Users, DollarSign, Package, TrendingUp, MessageSquare, HelpCircle } from 'lucide-react';
import { getAllPackages } from '@/utils/api';

export default function AdminDashboard() {
  const { authenticatedFetch } = useAuth();
  const { error: notifyError } = useNotification();
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    totalPackages: 0,
    pendingComments: 0,
    pendingQuestions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch users data
      const usersResponse = await userManagement.getAllUsers(1, authenticatedFetch);
      const totalUsers = usersResponse.data?.total || 0;

      // Calculate new users (last 30 days) from the first page
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const newUsers = usersResponse.data?.users?.filter(user => {
        const createdDate = new Date(user.createdAt);
        return createdDate >= thirtyDaysAgo;
      }).length || 0;

      // Fetch payments data
      const paymentsResponse = await paymentManagement.getAllPayments(authenticatedFetch);
      const payments = paymentsResponse.data?.payments || [];
      
      const completedPayments = payments.filter(p => p.status === 'COMPLETED').length;
      const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
      const totalRevenue = payments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + (p.finalPrice || 0), 0);

      // Fetch packages data
      const packagesResponse = await getAllPackages();
      const totalPackages = packagesResponse.data?.total || 0;

      // Fetch pending comments
      const commentsResponse = await commentManagement.getAll('PENDING', 1, authenticatedFetch);
      const pendingComments = commentsResponse.data?.total || 0;

      // Fetch pending questions
      const questionsResponse = await questionManagement.getQuestions('PENDING', 1, authenticatedFetch);
      const pendingQuestions = questionsResponse.data?.total || 0;

      setStats({
        totalUsers,
        newUsers,
        totalPayments: payments.length,
        completedPayments,
        pendingPayments,
        totalRevenue,
        totalPackages,
        pendingComments,
        pendingQuestions,
      });
    } catch (error) {
      handleApiError(error, notifyError, 'بارگذاری آمار');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="در حال بارگذاری آمار..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">داشبورد مدیریت</h1>
        <p className="text-gray-600">خوش آمدید! خلاصه‌ای از وضعیت سیستم را مشاهده کنید</p>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">آمار کاربران</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="کل کاربران"
            value={stats.totalUsers.toLocaleString('fa-IR')}
            icon={Users}
            color="primary"
          />
          <StatCard
            title="کاربران جدید (30 روز)"
            value={stats.newUsers.toLocaleString('fa-IR')}
            icon={TrendingUp}
            color="success"
            trend="up"
            trendValue={`+${stats.newUsers}`}
          />
        </div>
      </div>

      {/* Payment Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">آمار مالی</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="کل پرداخت‌ها"
            value={stats.totalPayments.toLocaleString('fa-IR')}
            icon={DollarSign}
            color="primary"
          />
          <StatCard
            title="پرداخت‌های موفق"
            value={stats.completedPayments.toLocaleString('fa-IR')}
            icon={DollarSign}
            color="success"
          />
          <StatCard
            title="در انتظار پرداخت"
            value={stats.pendingPayments.toLocaleString('fa-IR')}
            icon={DollarSign}
            color="warning"
          />
          <StatCard
            title="درآمد کل"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)} میلیون تومان`}
            icon={TrendingUp}
            color="success"
          />
        </div>
      </div>

      {/* Content Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">محتوا و تعاملات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="کل پکیج‌ها"
            value={stats.totalPackages.toLocaleString('fa-IR')}
            icon={Package}
            color="primary"
          />
          <StatCard
            title="نظرات در انتظار تأیید"
            value={stats.pendingComments.toLocaleString('fa-IR')}
            icon={MessageSquare}
            color="warning"
          />
          <StatCard
            title="سوالات بدون پاسخ"
            value={stats.pendingQuestions.toLocaleString('fa-IR')}
            icon={HelpCircle}
            color="danger"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/admin/users"
            className="flex flex-col items-center gap-2 p-4 rounded-lg
                     bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <Users className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-900">مدیریت کاربران</span>
          </a>
          <a
            href="/admin/packages"
            className="flex flex-col items-center gap-2 p-4 rounded-lg
                     bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <Package className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-900">مدیریت پکیج‌ها</span>
          </a>
          <a
            href="/admin/payments"
            className="flex flex-col items-center gap-2 p-4 rounded-lg
                     bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <DollarSign className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-900">مدیریت پرداخت‌ها</span>
          </a>
          <a
            href="/admin/comments"
            className="flex flex-col items-center gap-2 p-4 rounded-lg
                     bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-900">مدیریت نظرات</span>
          </a>
        </div>
      </div>
    </div>
  );
}

