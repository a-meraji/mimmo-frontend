'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, ENTITY_NAMES } from '@/utils/errorHandler';
import { paymentManagement, userManagement } from '@/utils/adminApi';
import { getAllPackages } from '@/utils/api';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import SearchBar from '@/components/admin/ui/SearchBar';
import Table from '@/components/admin/ui/Table';
import Badge from '@/components/admin/ui/Badge';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import Modal from '@/components/admin/ui/Modal';
import { CreditCard, Eye, Plus, User, Tag, Calendar, CheckCircle2, Clock, Package, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
  const { authenticatedFetch } = useAuth();
  const { error: notifyError } = useNotification();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleViewDetails = async (payment) => {
    setIsDetailsModalOpen(true);
    setSelectedPayment(null);
    setDetailsError(null);
    setLoadingDetails(true);

    try {
      const response = await paymentManagement.getPaymentById(payment.id, authenticatedFetch);
      
      if (response.status === 200 && response.data) {
        setSelectedPayment(response.data);
      } else {
        setDetailsError(response.message || 'خطا در بارگذاری جزئیات پرداخت');
        notifyError(response.message || 'خطا در بارگذاری جزئیات پرداخت');
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      setDetailsError('خطا در بارگذاری جزئیات پرداخت');
      handleApiError(error, notifyError, ENTITY_NAMES.payments);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    fetchPayments();
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          ایجاد پرداخت جدید
        </button>
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

      {/* Create Payment Modal */}
      <CreatePaymentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Payment Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPayment(null);
          setDetailsError(null);
        }}
        title="جزئیات پرداخت"
        size="2xl"
      >
        {loadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : detailsError ? (
          <div className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{detailsError}</p>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="btn btn-secondary"
            >
              بستن
            </button>
          </div>
        ) : selectedPayment ? (
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                اطلاعات کاربر
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">نام و نام خانوادگی</p>
                  <p className="font-medium text-sm">
                    {selectedPayment.user.name && selectedPayment.user.familyName
                      ? `${selectedPayment.user.name} ${selectedPayment.user.familyName}`
                      : selectedPayment.user.name || selectedPayment.user.familyName || 'نامشخص'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ایمیل</p>
                  <p className="font-medium text-sm">{selectedPayment.user.email || 'ندارد'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">شماره تماس</p>
                  <p className="font-medium text-sm">{selectedPayment.user.phoneNumber || 'ندارد'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">نقش</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    selectedPayment.user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedPayment.user.role === 'admin' ? 'مدیر' : 'کاربر'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">شناسه پرداخت</p>
                <p className="font-mono text-xs text-gray-700 break-all">{selectedPayment.id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">وضعیت</p>
                {getStatusBadge(selectedPayment.status)}
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">مبلغ کل (بدون تخفیف)</p>
                <p className="font-bold text-lg text-blue-900">{selectedPayment.totalPrice?.toLocaleString('fa-IR')} تومان</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">مبلغ نهایی (با تخفیف)</p>
                <p className="font-bold text-lg text-green-900">{selectedPayment.finalPrice?.toLocaleString('fa-IR')} تومان</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">روش پرداخت</p>
                <p className="font-medium flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {selectedPayment.paymentMethod === 'FULL_PAYMENT' ? 'پرداخت کامل' : 'پرداخت اقساطی'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">نوع پرداخت</p>
                <p className="font-medium">
                  {selectedPayment.paymentType === 'GATEWAY_PAYMENT' ? 'درگاه پرداخت' : 'کارت به کارت'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">تاریخ ایجاد</p>
                <p className="font-medium">{new Date(selectedPayment.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">آخرین بروزرسانی</p>
                <p className="font-medium">{new Date(selectedPayment.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
            </div>

            {/* Discount Information */}
            {selectedPayment.discountCode && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  اطلاعات تخفیف
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-orange-600 mb-1">کد تخفیف</p>
                    <p className="font-mono font-medium text-orange-900">{selectedPayment.discountCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 mb-1">درصد تخفیف</p>
                    <p className="font-bold text-orange-900">{selectedPayment.discoundPercentage}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Installments */}
            {selectedPayment.installments && selectedPayment.installments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  اقساط ({selectedPayment.installments.filter(i => i.isPaid).length} از {selectedPayment.installments.length} پرداخت شده)
                </h3>
                <div className="space-y-2">
                  {selectedPayment.installments.map((installment, index) => (
                    <div
                      key={installment.id}
                      className={`p-3 rounded-lg border-2 ${
                        installment.isPaid
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-700">قسط {index + 1}</span>
                          <span className="font-medium">
                            {installment.amount?.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {installment.isPaid ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="text-xs text-green-700">
                                {installment.paidAt
                                  ? new Date(installment.paidAt).toLocaleDateString('fa-IR')
                                  : 'پرداخت شده'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-5 h-5 text-gray-400" />
                              <span className="text-xs text-gray-600">پرداخت نشده</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packages */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                پکیج‌ها ({selectedPayment.packages?.length || 0})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {selectedPayment.packages?.map((pkg) => (
                  <div key={pkg.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{pkg.packageName}</h4>
                        <p className="text-sm text-gray-600 mb-2">{pkg.subtitle}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {pkg.level}
                          </span>
                          {pkg.category?.map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {cat}
                            </span>
                          ))}
                          {pkg.badge && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-left mr-4">
                        {pkg.discountedPrice && pkg.discountedPrice > 0 && pkg.discountedPrice < pkg.originalPrice ? (
                          <div>
                            <p className="text-xs text-gray-400 line-through">{pkg.originalPrice?.toLocaleString('fa-IR')}</p>
                            <p className="text-lg font-bold text-green-600">{pkg.discountedPrice?.toLocaleString('fa-IR')} تومان</p>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">{pkg.originalPrice?.toLocaleString('fa-IR')} تومان</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="btn btn-secondary"
              >
                بستن
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

// Create Payment Modal Component
function CreatePaymentModal({ isOpen, onClose, onSuccess }) {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  
  const [step, setStep] = useState(1); // 1: User, 2: Packages, 3: Details
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Step 1: User Selection
  const [userSearch, setUserSearch] = useState('');
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Step 2: Package Selection
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  
  // Step 3: Payment Details
  const [finalPrice, setFinalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('FULL_PAYMENT');

  // Reset form on open/close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setUserSearch('');
      setUsers([]);
      setSelectedUser(null);
      setPackages([]);
      setSelectedPackages([]);
      setFinalPrice('');
      setPaymentMethod('FULL_PAYMENT');
    }
  }, [isOpen]);

  // Search users
  const handleSearchUsers = async () => {
    if (!userSearch.trim()) return;

    try {
      setSearchingUsers(true);
      const isPhone = /^\+?\d+$/.test(userSearch.trim());
      const filters = isPhone 
        ? { phoneNumber: `+${userSearch.trim()}` }
        : { email: userSearch.trim() };

      const response = await userManagement.searchUsers(filters, authenticatedFetch);
      setUsers(response.data || []);
      
      if (!response.data || response.data.length === 0) {
        notifyError('کاربری یافت نشد');
      }
    } catch (error) {
      handleApiError(error, notifyError, 'جستجوی کاربر');
    } finally {
      setSearchingUsers(false);
    }
  };

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await getAllPackages(1);
      setPackages(response.data?.packages || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.packages);
    } finally {
      setLoadingPackages(false);
    }
  };

  // Toggle package selection
  const togglePackage = (pkg) => {
    setSelectedPackages(prev => {
      const exists = prev.find(p => p.id === pkg.id);
      if (exists) {
        return prev.filter(p => p.id !== pkg.id);
      }
      return [...prev, pkg];
    });
  };

  // Calculate total suggested price
  const calculateSuggestedPrice = () => {
    return selectedPackages.reduce((sum, pkg) => {
      return sum + (pkg.discountedPrice || pkg.originalPrice);
    }, 0);
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (step === 1 && !selectedUser) {
      notifyError('لطفاً یک کاربر انتخاب کنید');
      return;
    }
    if (step === 2 && selectedPackages.length === 0) {
      notifyError('لطفاً حداقل یک پکیج انتخاب کنید');
      return;
    }
    
    // Fetch packages when moving to step 2
    if (step === 1 && packages.length === 0) {
      fetchPackages();
    }
    
    // Auto-fill suggested price when moving to step 3
    if (step === 2) {
      const suggested = calculateSuggestedPrice();
      setFinalPrice(suggested.toString());
    }
    
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Submit payment creation
  const handleSubmit = async () => {
    if (!finalPrice || parseFloat(finalPrice) <= 0) {
      notifyError('لطفاً مبلغ نهایی را وارد کنید');
      return;
    }

    try {
      setSubmitting(true);
      
      const paymentData = {
        userId: selectedUser.id,
        packageIds: selectedPackages.map(p => p.id),
        finalPrice: parseFloat(finalPrice),
        paymentMethod: paymentMethod,
      };

      await paymentManagement.createPayment(paymentData, authenticatedFetch);
      notifySuccess('پرداخت با موفقیت ایجاد شد');
      onSuccess();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.payments);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ایجاد پرداخت جدید"
      size="xl"
    >
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: User Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">انتخاب کاربر</h3>
            <p className="text-sm text-gray-600">کاربر را با ایمیل یا شماره تلفن جستجو کنید</p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                placeholder="ایمیل یا شماره تلفن..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSearchUsers}
                disabled={searchingUsers || !userSearch.trim()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchingUsers ? 'جستجو...' : 'جستجو'}
              </button>
            </div>

            {users.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-medium">{user.name || user.email || 'نامشخص'}</p>
                    <p className="text-sm text-gray-600">{user.email || user.phoneNumber || ''}</p>
                    {user.telegramId && (
                      <p className="text-xs text-gray-500 mt-1">تلگرام: {user.telegramId}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Package Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">انتخاب پکیج‌ها</h3>
            <p className="text-sm text-gray-600">پکیج‌های مورد نظر را انتخاب کنید ({selectedPackages.length} انتخاب شده)</p>
            
            {loadingPackages ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner message="در حال بارگذاری پکیج‌ها..." />
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {packages.map((pkg) => {
                  const isSelected = selectedPackages.find(p => p.id === pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => togglePackage(pkg)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{pkg.packageName}</p>
                          <p className="text-sm text-gray-600">{pkg.subtitle}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {pkg.level}
                            </span>
                            {pkg.discountedPrice && (
                              <span className="text-xs line-through text-gray-400">
                                {pkg.originalPrice.toLocaleString('fa-IR')} تومان
                              </span>
                            )}
                            <span className="text-sm font-bold text-primary">
                              {(pkg.discountedPrice || pkg.originalPrice).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Payment Details */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">جزئیات پرداخت</h3>
            
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">کاربر:</span>
                <span className="font-medium">{selectedUser?.name || selectedUser?.email || 'نامشخص'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">تعداد پکیج:</span>
                <span className="font-medium">{selectedPackages.length} پکیج</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">مبلغ پیشنهادی:</span>
                <span className="font-medium text-primary">{calculateSuggestedPrice().toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>

            {/* Final Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مبلغ نهایی (تومان) *
              </label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                placeholder="مبلغ نهایی را وارد کنید"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                می‌توانید مبلغ را بر اساس تخفیف یا توافق تغییر دهید
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                روش پرداخت *
              </label>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'FULL_PAYMENT' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="FULL_PAYMENT"
                    checked={paymentMethod === 'FULL_PAYMENT'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="mr-3">
                    <p className="font-medium">پرداخت کامل (نقدی)</p>
                    <p className="text-sm text-gray-600">کاربر کل مبلغ را یکجا پرداخت می‌کند</p>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'INSTALLMENT' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="INSTALLMENT"
                    checked={paymentMethod === 'INSTALLMENT'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="mr-3">
                    <p className="font-medium">پرداخت اقساطی</p>
                    <p className="text-sm text-gray-600">کاربر به صورت اقساطی پرداخت می‌کند</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={step === 1 ? onClose : handlePrevStep}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {step === 1 ? 'لغو' : 'مرحله قبل'}
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={
                (step === 1 && !selectedUser) ||
                (step === 2 && selectedPackages.length === 0)
              }
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              مرحله بعد
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !finalPrice || parseFloat(finalPrice) <= 0}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال ایجاد...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  ایجاد پرداخت
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

