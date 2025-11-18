/**
 * Error Handler Utility for Admin Dashboard
 * Maps error codes to user-friendly Persian messages
 */

/**
 * Get user-friendly error message based on error status code
 * @param {Error} error - Error object with status property
 * @param {string} context - Context of the error (e.g., 'user', 'package', 'payment')
 * @returns {string} User-friendly Persian error message
 */
export function getErrorMessage(error, context = 'عملیات') {
  // Handle network errors
  if (error.isNetworkError) {
    if (error.isTimeout) {
      return 'زمان درخواست تمام شد. لطفاً دوباره تلاش کنید.';
    }
    return 'خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
  }

  // Handle errors with status codes
  const status = error.status || error.statusCode;

  switch (status) {
    case 400:
      return error.message || 'اطلاعات ارسالی نامعتبر است. لطفاً مقادیر را بررسی کنید.';
    
    case 401:
      return 'دسترسی غیرمجاز. لطفاً دوباره وارد شوید.';
    
    case 403:
      return 'شما اجازه انجام این عملیات را ندارید.';
    
    case 404:
      return `${context} یافت نشد.`;
    
    case 409:
      return 'این اطلاعات قبلاً ثبت شده است.';
    
    case 422:
      return 'اطلاعات ارسالی قابل پردازش نیست. لطفاً فرمت را بررسی کنید.';
    
    case 425:
      return 'درخواست شما خیلی زود ارسال شده. لطفاً کمی صبر کنید.';
    
    case 429:
      return 'تعداد درخواست‌های شما زیاد است. لطفاً کمی صبر کنید.';
    
    case 500:
      return 'خطای سرور. لطفاً بعداً دوباره تلاش کنید.';
    
    case 502:
      return 'سرور در دسترس نیست. لطفاً بعداً تلاش کنید.';
    
    case 503:
      return 'سرویس موقتاً در دسترس نیست. لطفاً بعداً تلاش کنید.';
    
    default:
      // Return custom message if available
      if (error.message) {
        return error.message;
      }
      return 'خطای نامشخص. لطفاً دوباره تلاش کنید.';
  }
}

/**
 * Handle API errors with notification
 * @param {Error} error - Error object
 * @param {Function} notifyError - Notification error function
 * @param {string} context - Context of the error
 */
export function handleApiError(error, notifyError, context = 'عملیات') {
  console.error(`Error in ${context}:`, error);
  const message = getErrorMessage(error, context);
  notifyError(message);
}

/**
 * Get success message for CRUD operations
 * @param {string} action - Action type ('create', 'update', 'delete')
 * @param {string} entity - Entity name
 * @returns {string} Success message
 */
export function getSuccessMessage(action, entity) {
  const messages = {
    create: `${entity} با موفقیت ایجاد شد`,
    update: `${entity} با موفقیت به‌روزرسانی شد`,
    delete: `${entity} با موفقیت حذف شد`,
    save: `${entity} با موفقیت ذخیره شد`,
    approve: `${entity} با موفقیت تأیید شد`,
    reject: `${entity} با موفقیت رد شد`,
    send: `${entity} با موفقیت ارسال شد`,
    upload: `${entity} با موفقیت آپلود شد`,
  };

  return messages[action] || `عملیات با موفقیت انجام شد`;
}

/**
 * Entity name mapping for better error messages
 */
export const ENTITY_NAMES = {
  user: 'کاربر',
  users: 'کاربران',
  package: 'پکیج',
  packages: 'پکیج‌ها',
  chapter: 'فصل',
  chapters: 'فصل‌ها',
  part: 'بخش',
  parts: 'بخش‌ها',
  lesson: 'درس',
  lessons: 'درس‌ها',
  word: 'کلمه',
  words: 'کلمات',
  practice: 'تمرین',
  practices: 'تمرین‌ها',
  payment: 'پرداخت',
  payments: 'پرداخت‌ها',
  comment: 'نظر',
  comments: 'نظرات',
  question: 'سوال',
  questions: 'سوالات',
  image: 'تصویر',
  data: 'اطلاعات',
};

