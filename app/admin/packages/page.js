'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { packageManagement } from '@/utils/adminApi';
import { getAllPackages } from '@/utils/api';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import PackageForm from '@/components/admin/packages/PackageForm';
import { Plus, Edit, Trash2, ChevronLeft, Package as PackageIcon } from 'lucide-react';
import Link from 'next/link';

export default function PackagesPage() {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getAllPackages();
      setPackages(response.data || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.packages);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = () => {
    setSelectedPackage(null);
    setIsPackageFormOpen(true);
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsPackageFormOpen(true);
  };

  const handleDeletePackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleSavePackage = async (data) => {
    try {
      setIsSubmitting(true);
      
      if (selectedPackage) {
        await packageManagement.updatePackage(selectedPackage.id, data, authenticatedFetch);
        notifySuccess(getSuccessMessage('update', ENTITY_NAMES.package));
      } else {
        await packageManagement.createPackage(data, authenticatedFetch);
        notifySuccess(getSuccessMessage('create', ENTITY_NAMES.package));
      }
      
      setIsPackageFormOpen(false);
      fetchPackages();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.package);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await packageManagement.deletePackage(selectedPackage.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.package));
      setIsDeleteDialogOpen(false);
      fetchPackages();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.package);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'مدیریت پکیج‌ها' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت پکیج‌ها</h1>
          <p className="text-gray-600 mt-1">مشاهده و مدیریت پکیج‌های آموزشی</p>
        </div>
        <button
          onClick={handleCreatePackage}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          افزودن پکیج
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="در حال بارگذاری پکیج‌ها..." />
      ) : packages.length === 0 ? (
        <EmptyState
          icon={PackageIcon}
          title="پکیجی یافت نشد"
          message="هنوز پکیجی در سیستم ثبت نشده است"
          action={
            <button
              onClick={handleCreatePackage}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90
                       transition-colors font-medium"
            >
              افزودن اولین پکیج
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden
                       hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.packageName}
                  className="w-full h-full object-cover"
                />
                {pkg.badge && (
                  <span className="absolute top-3 right-3 px-3 py-1 bg-primary text-white
                                 text-xs font-medium rounded-full">
                    {pkg.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                    {pkg.packageName}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{pkg.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded">{pkg.level}</span>
                  {pkg.rate && (
                    <span>⭐ {pkg.rate}</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {pkg.discountedPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {pkg.discountedPrice.toLocaleString('fa-IR')} تومان
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {pkg.originalPrice.toLocaleString('fa-IR')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {pkg.originalPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <Link
                    href={`/admin/packages/${pkg.id}/chapters`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                             bg-primary/10 text-primary rounded-lg hover:bg-primary/20
                             transition-colors text-sm font-medium"
                  >
                    مشاهده فصل‌ها
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleEditPackage(pkg)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    aria-label="ویرایش"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    aria-label="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PackageForm
        isOpen={isPackageFormOpen}
        onClose={() => setIsPackageFormOpen(false)}
        onSave={handleSavePackage}
        packageData={selectedPackage}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف پکیج"
        message={`آیا از حذف پکیج "${selectedPackage?.packageName}" اطمینان دارید؟ این عمل تمام فصل‌ها، بخش‌ها و درس‌های مرتبط را نیز حذف می‌کند.`}
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

