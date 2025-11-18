'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { userManagement } from '@/utils/adminApi';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import SearchBar from '@/components/admin/ui/SearchBar';
import Table from '@/components/admin/ui/Table';
import Pagination from '@/components/admin/ui/Pagination';
import Badge from '@/components/admin/ui/Badge';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import UserModal from '@/components/admin/users/UserModal';
import { Plus, Edit, Trash2, Users as UsersIcon } from 'lucide-react';

export default function UsersPage() {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      fetchUsers(currentPage);
    }
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await userManagement.getAllUsers(page, authenticatedFetch);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.users);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      fetchUsers(1);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      
      // Determine if search is email or phone
      const isPhone = /^\d+$/.test(searchQuery.trim());
      const filters = isPhone 
        ? { phoneNumber: searchQuery.trim() }
        : { email: searchQuery.trim() };

      const response = await userManagement.searchUsers(filters, authenticatedFetch);
      setUsers(response.data);
      setTotalPages(1); // Search results are not paginated
    } catch (error) {
      handleApiError(error, notifyError, 'جستجوی ' + ENTITY_NAMES.users);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      setIsSubmitting(true);
      
      if (selectedUser) {
        // Update existing user
        await userManagement.updateUser(selectedUser.id, userData, authenticatedFetch);
        notifySuccess(getSuccessMessage('update', ENTITY_NAMES.user));
      } else {
        // Create new user
        await userManagement.createUser(userData, authenticatedFetch);
        notifySuccess(getSuccessMessage('create', ENTITY_NAMES.user));
      }
      
      setIsUserModalOpen(false);
      fetchUsers(currentPage);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.user);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await userManagement.deleteUser(selectedUser.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.user));
      setIsDeleteDialogOpen(false);
      fetchUsers(currentPage);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.user);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'نام',
      render: (user) => (
        <div>
          <p className="font-medium">{user.name || '-'} {user.familyName || ''}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'ایمیل',
      render: (user) => user.email || '-',
    },
    {
      key: 'phoneNumber',
      label: 'شماره تلفن',
      render: (user) => user.phoneNumber || '-',
    },
    {
      key: 'role',
      label: 'نقش',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
          {user.role === 'admin' ? 'مدیر' : 'کاربر'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'تاریخ ثبت‌نام',
      render: (user) => new Date(user.createdAt).toLocaleDateString('fa-IR'),
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(user);
            }}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            aria-label="ویرایش"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user);
            }}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            aria-label="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'مدیریت کاربران' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
          <p className="text-gray-600 mt-1">مشاهده و مدیریت کاربران سیستم</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          افزودن کاربر
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="جستجو با ایمیل یا شماره تلفن..."
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="در حال بارگذاری کاربران..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="کاربری یافت نشد"
          message="هنوز کاربری در سیستم ثبت نشده است"
          action={
            <button
              onClick={handleCreateUser}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90
                       transition-colors font-medium"
            >
              افزودن اولین کاربر
            </button>
          }
        />
      ) : (
        <>
          <Table columns={columns} data={users} />
          {!isSearching && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف کاربر"
        message={`آیا از حذف کاربر "${selectedUser?.name || selectedUser?.email || 'این کاربر'}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`}
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

