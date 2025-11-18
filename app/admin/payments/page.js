'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, ENTITY_NAMES } from '@/utils/errorHandler';
import { paymentManagement } from '@/utils/adminApi';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import SearchBar from '@/components/admin/ui/SearchBar';
import Table from '@/components/admin/ui/Table';
import Badge from '@/components/admin/ui/Badge';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import Modal from '@/components/admin/ui/Modal';
import { CreditCard, Eye } from 'lucide-react';

export default function PaymentsPage() {
  const { authenticatedFetch } = useAuth();
  const { error: notifyError } = useNotification();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      fetchPayments();
    }
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentManagement.getAllPayments(authenticatedFetch);
      setPayments(response.data.payments || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.payments);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchPayments();
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      
      const isPhone = /^\d+$/.test(searchQuery.trim());
      const filters = isPhone 
        ? { phoneNumber: searchQuery.trim() }
        : { email: searchQuery.trim() };

      const response = await paymentManagement.searchPayments(filters, authenticatedFetch);
      setPayments(response.data || []);
    } catch (error) {
      handleApiError(error, notifyError, 'جستجوی ' + ENTITY_NAMES.payments);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      COMPLETED: 'success',
      PENDING: 'warning',
      FAILED: 'danger',
      PARTIAL_PAYMENT: 'info',
      SUSPENDED: 'default',
    };
    const labels = {
      COMPLETED: 'تکمیل شده',
      PENDING: 'در انتظار',
      FAILED: 'ناموفق',
      PARTIAL_PAYMENT: 'پرداخت جزئی',
      SUSPENDED: 'معلق',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const columns = [
    {
      key: 'user',
      label: 'کاربر',
      render: (payment) => (
        <div>
          <p className="font-medium">{payment.user.name || payment.user.email || 'نامشخص'}</p>
          <p className="text-xs text-gray-500">{payment.user.email || payment.user.phoneNumber || ''}</p>
        </div>
      ),
    },
    {
      key: 'packages',
      label: 'پکیج‌ها',
      render: (payment) => (
        <div className="text-sm">{payment.packages?.length || 0} پکیج</div>
      ),
    },
    {
      key: 'finalPrice',
      label: 'مبلغ',
      render: (payment) => (
        <span className="font-medium">{payment.finalPrice?.toLocaleString('fa-IR')} تومان</span>
      ),
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (payment) => getStatusBadge(payment.status),
    },
    {
      key: 'paymentMethod',
      label: 'روش پرداخت',
      render: (payment) => payment.paymentMethod === 'FULL_PAYMENT' ? 'نقدی' : 'اقساطی',
    },
    {
      key: 'createdAt',
      label: 'تاریخ',
      render: (payment) => new Date(payment.createdAt).toLocaleDateString('fa-IR'),
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (payment) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(payment);
          }}
          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
          aria-label="مشاهده جزئیات"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'مدیریت پرداخت‌ها' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت پرداخت‌ها</h1>
          <p className="text-gray-600 mt-1">مشاهده و مدیریت پرداخت‌های کاربران</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="جستجو با ایمیل یا شماره تلفن..."
        />
      </div>

      {loading ? (
        <LoadingSpinner message="در حال بارگذاری پرداخت‌ها..." />
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="پرداختی یافت نشد" message="هنوز پرداختی ثبت نشده است" />
      ) : (
        <Table columns={columns} data={payments} onRowClick={handleViewDetails} />
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title="جزئیات پرداخت"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">کاربر</p>
                <p className="font-medium">{selectedPayment.user.name || selectedPayment.user.email || 'نامشخص'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">وضعیت</p>
                {getStatusBadge(selectedPayment.status)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">مبلغ کل</p>
                <p className="font-medium">{selectedPayment.totalPrice?.toLocaleString('fa-IR')} تومان</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">مبلغ نهایی</p>
                <p className="font-medium text-primary">{selectedPayment.finalPrice?.toLocaleString('fa-IR')} تومان</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">روش پرداخت</p>
                <p className="font-medium">{selectedPayment.paymentMethod === 'FULL_PAYMENT' ? 'نقدی' : 'اقساطی'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">تاریخ</p>
                <p className="font-medium">{new Date(selectedPayment.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
            </div>

            {selectedPayment.discountCode && (
              <div>
                <p className="text-sm text-gray-600 mb-1">کد تخفیف</p>
                <p className="font-medium">{selectedPayment.discountCode} ({selectedPayment.discoundPercentage}%)</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 mb-2">پکیج‌ها</p>
              <div className="space-y-2">
                {selectedPayment.packages?.map((pkg) => (
                  <div key={pkg.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{pkg.packageName}</p>
                    <p className="text-sm text-gray-600">{pkg.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

