"use client";

import { useState, useCallback, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Mail, ArrowRight, Edit2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import OTPInput from '@/components/auth/OTPInput';
import CountryCodeSelector from '@/components/auth/CountryCodeSelector';
import { getPhoneCodeByISO } from '@/constants/countries';

// Constants
const OTP_LENGTH = 4;
const OTP_TIMER_SECONDS = 120;
const DEFAULT_REDIRECT = '/profile';
const DEFAULT_COUNTRY = 'IR';
const PHONE_REGEX = /^\d{7,15}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Separate component that uses useSearchParams (must be wrapped in Suspense)
function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendPhoneOTP, sendEmailOTP, verifyPhoneOTP, verifyEmailOTP, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // State
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [inputType, setInputType] = useState('phone'); // 'phone' or 'email'
  const [countryISO, setCountryISO] = useState(DEFAULT_COUNTRY);
  const [inputValue, setInputValue] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  // Refs
  const isVerifyingRef = useRef(false);

  // Redirect URL
  const redirectUrl = searchParams.get('redirect') || DEFAULT_REDIRECT;

  // Redirect if already authenticated (single source of truth for redirects)
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  // Timer countdown for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  // Format timer display
  const timerDisplay = useMemo(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timer]);

  // Get full phone number with country code
  const fullPhoneNumber = useMemo(() => {
    if (inputType !== 'phone') return inputValue;
    
    // Get phone code from ISO code
    const phoneCode = getPhoneCodeByISO(countryISO);
    if (!phoneCode) return inputValue;
    
    // Remove leading zero if present (for Iran: 09123456789 -> 9123456789)
    const cleanNumber = inputValue.startsWith('0') ? inputValue.slice(1) : inputValue;
    return `${phoneCode}${cleanNumber}`;
  }, [inputType, countryISO, inputValue]);

  // Validate input
  const isValidInput = useMemo(() => {
    if (inputType === 'phone') {
      const cleanNumber = inputValue.replace(/^0+/, '');
      return PHONE_REGEX.test(cleanNumber);
    }
    return EMAIL_REGEX.test(inputValue);
  }, [inputType, inputValue]);

  // Handle send OTP
  const handleSendOTP = useCallback(async () => {
    if (!isValidInput) {
      toast.error(inputType === 'phone' ? 'شماره تلفن معتبر نیست' : 'ایمیل معتبر نیست');
      return;
    }

    setIsLoading(true);

    try {
      if (inputType === 'phone') {
        await sendPhoneOTP(fullPhoneNumber);
      } else {
        await sendEmailOTP(inputValue);
      }

      toast.success('کد تأیید ارسال شد');
      setStep('verify');
      setTimer(OTP_TIMER_SECONDS);
      setCanResend(false);
      setOtp('');
    } catch (error) {
      toast.error(error.message || 'خطا در ارسال کد تأیید');
    } finally {
      setIsLoading(false);
    }
  }, [inputType, inputValue, fullPhoneNumber, isValidInput, sendPhoneOTP, sendEmailOTP, toast]);

  // Handle resend OTP
  const handleResendOTP = useCallback(async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setCanResend(false);

    try {
      if (inputType === 'phone') {
        await sendPhoneOTP(fullPhoneNumber);
      } else {
        await sendEmailOTP(inputValue);
      }

      toast.success('کد تأیید مجدداً ارسال شد');
      setTimer(OTP_TIMER_SECONDS);
      setOtp('');
    } catch (error) {
      toast.error(error.message || 'خطا در ارسال مجدد کد');
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  }, [canResend, inputType, inputValue, fullPhoneNumber, sendPhoneOTP, sendEmailOTP, toast]);

  // Handle verify OTP
  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== OTP_LENGTH) {
      return;
    }

    // Prevent double submission
    if (isVerifyingRef.current) {
      return;
    }

    isVerifyingRef.current = true;
    setIsLoading(true);

    try {
      if (inputType === 'phone') {
        await verifyPhoneOTP(fullPhoneNumber, otp);
      } else {
        await verifyEmailOTP(inputValue, otp);
      }

      // Success! The useEffect will handle redirect when isAuthenticated becomes true
      toast.success('ورود موفقیت‌آمیز بود');
    } catch (error) {
      toast.error(error.message || 'کد تأیید نامعتبر است');
      setOtp('');
      isVerifyingRef.current = false; // Reset on error to allow retry
    } finally {
      setIsLoading(false);
    }
  }, [otp, inputType, inputValue, fullPhoneNumber, verifyPhoneOTP, verifyEmailOTP, toast]);

  // Handle edit input
  const handleEdit = useCallback(() => {
    setStep('input');
    setOtp('');
    setTimer(0);
    setCanResend(false);
    isVerifyingRef.current = false; // Reset verification flag
  }, []);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === OTP_LENGTH && !isLoading && !isVerifyingRef.current) {
      handleVerifyOTP();
    }
  }, [otp, isLoading, handleVerifyOTP]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-indigo/10 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-charcoal mb-2">
            {step === 'input' ? 'ورود / ثبت‌نام' : 'تأیید کد'}
          </h1>
          <p className="text-text-gray">
            {step === 'input' 
              ? `${inputType === 'phone' ? 'شماره تلفن' : 'ایمیل'} خود را وارد کنید`
              : `کد تأیید ارسال شده به ${inputType === 'phone' ? 'شماره' : 'ایمیل'} خود را وارد کنید`
            }
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-neutral-extralight">
          {step === 'input' ? (
            <>
              {/* Input Type Toggle */}
              <div className="flex gap-2 p-1 bg-neutral-extralight rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setInputType('phone');
                    setInputValue('');
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                    font-medium transition-all duration-200
                    ${inputType === 'phone' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-text-gray hover:text-text-charcoal'
                    }
                  `}
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span>شماره تلفن</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputType('email');
                    setInputValue('');
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                    font-medium transition-all duration-200
                    ${inputType === 'email' 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-text-gray hover:text-text-charcoal'
                    }
                  `}
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>ایمیل</span>
                </button>
              </div>

              {/* Input Field */}
              <div className="mb-6">
                <label htmlFor="auth-input" className="block text-sm font-medium text-text-charcoal mb-2">
                  {inputType === 'phone' ? 'شماره تلفن' : 'ایمیل'}
                </label>
                
                {inputType === 'phone' ? (
                  <div dir="ltr" className="flex gap-2 relative">
                    {/* Country Code Selector */}
                    <CountryCodeSelector
                      value={countryISO}
                      onChange={setCountryISO}
                      disabled={isLoading}
                    />
                    
                    {/* Phone Number Input */}
                    <input
                      id="auth-input"
                      type="tel"
                      inputMode="numeric"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={countryISO === 'IR' ? '9123456789' : '1234567890'}
                      disabled={isLoading}
                      className="flex-1 px-2 py-3 border-2 border-neutral-extralight rounded-xl
                        focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                        transition-all duration-200 text-text-charcoal
                        disabled:bg-neutral-lighter disabled:cursor-not-allowed
                        dir-ltr text-left"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isValidInput && !isLoading) {
                          handleSendOTP();
                        }
                      }}
                    />
                  </div>
                ) : (
                  <input
                    id="auth-input"
                    type="email"
                    inputMode="email"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="example@email.com"
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-neutral-extralight rounded-xl
                      focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                      transition-all duration-200 text-text-charcoal
                      disabled:bg-neutral-lighter disabled:cursor-not-allowed
                      dir-ltr text-left"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isValidInput && !isLoading) {
                        handleSendOTP();
                      }
                    }}
                  />
                )}
                
                {inputValue && !isValidInput && (
                  <p className="text-sm text-rose-600 mt-2">
                    {inputType === 'phone' 
                      ? 'شماره تلفن را بدون صفر اول وارد کنید (حداقل ۷ رقم)' 
                      : 'فرمت ایمیل نامعتبر است'
                    }
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={!isValidInput || isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold
                  py-3 px-6 rounded-xl transition-all duration-200
                  disabled:bg-neutral-gray disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <span>دریافت کد تأیید</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Display Input Value with Edit Button */}
              <div className="mb-6 p-4 bg-neutral-indigo/5 rounded-xl flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  {inputType === 'phone' ? (
                    <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
                  ) : (
                    <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
                  )}
                  <span className="font-medium text-text-charcoal dir-ltr">
                    {inputType === 'phone' ? fullPhoneNumber : inputValue}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="p-2 hover:bg-neutral-indigo/10 rounded-lg transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="ویرایش"
                >
                  <Edit2 className="w-4 h-4 text-primary" aria-hidden="true" />
                </button>
              </div>

              {/* OTP Input */}
              <div dir='ltr' className="mb-6">
                <label className="block text-sm font-medium text-text-charcoal mb-4 text-center">
                  کد {OTP_LENGTH} رقمی را وارد کنید
                </label>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  length={OTP_LENGTH}
                  disabled={isLoading}
                />
              </div>

              {/* Timer and Resend */}
              <div className="text-center mb-6">
                {timer > 0 ? (
                  <p className="text-text-gray">
                    ارسال مجدد کد در <span className="font-semibold text-primary dir-ltr inline-block">{timerDisplay}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResend || isLoading}
                    className="text-primary hover:text-primary-dark font-medium
                      disabled:text-neutral-gray disabled:cursor-not-allowed
                      transition-colors"
                  >
                    ارسال مجدد کد تأیید
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={otp.length !== OTP_LENGTH || isLoading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold
                  py-3 px-6 rounded-xl transition-all duration-200
                  disabled:bg-neutral-gray disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>در حال تأیید...</span>
                  </>
                ) : (
                  <>
                    <span>تأیید و ورود</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Info Text */}
        <p className="text-center text-sm text-text-gray mt-6">
          با ورود به سایت، شما{' '}
          <button type="button" className="text-primary hover:underline">
            قوانین و مقررات
          </button>
          {' '}را می‌پذیرید.
        </p>
      </div>
    </main>
  );
}

// Loading fallback for Suspense
function AuthLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-indigo/10 to-white flex items-center justify-center px-4 py-12">
      <div className="flex items-center gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
        <p className="text-lg font-medium text-text-gray">در حال بارگذاری...</p>
      </div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={<AuthLoading />}>
      <AuthForm />
    </Suspense>
  );
}

