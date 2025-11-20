"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { getProgressTracker } from '@/utils/examApi';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProgressDashboard Component
 * Displays comprehensive progress tracking for user's lessons and exams
 */
export default function ProgressDashboard({ lessonIds = [], packageTitle = '' }) {
  const { isAuthenticated, authenticatedFetch } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated || lessonIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getProgressTracker(lessonIds, authenticatedFetch);
        
        if (result.success) {
          setProgress(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError('خطا در بارگذاری پیشرفت');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [lessonIds, isAuthenticated, authenticatedFetch]);

  // Calculate statistics
  const stats = {
    total: lessonIds.length,
    completed: progress.filter(p => p.isCompleted).length,
    inProgress: progress.filter(p => !p.isCompleted && p.lastAttemptAt).length,
    notStarted: lessonIds.length - progress.length
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const averageScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.averageScore || 0), 0) / progress.length)
    : 0;

  if (loading) {
    return (
      <div className="bg-white border border-neutral-light rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-neutral-indigo/20 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-neutral-indigo/10 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-charcoal mb-4">
          {packageTitle ? `پیشرفت ${packageTitle}` : 'پیشرفت کلی'}
        </h3>
        
        <div className="grid sm:grid-cols-4 gap-4 mb-4">
          <StatCard
            icon={Target}
            label="کل دروس"
            value={stats.total}
            color="text-primary"
          />
          <StatCard
            icon={CheckCircle2}
            label="تکمیل شده"
            value={stats.completed}
            color="text-emerald-600"
          />
          <StatCard
            icon={Clock}
            label="در حال انجام"
            value={stats.inProgress}
            color="text-amber-600"
          />
          <StatCard
            icon={Circle}
            label="شروع نشده"
            value={stats.notStarted}
            color="text-neutral-gray"
          />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-text-charcoal">میزان پیشرفت</span>
            <span className="text-2xl font-black text-primary">{completionPercentage}%</span>
          </div>
          <div className="h-4 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Average Score */}
        {averageScore > 0 && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-secondary" aria-hidden="true" />
            <span className="text-text-gray">میانگین نمره:</span>
            <span className="font-bold text-secondary">{averageScore}%</span>
          </div>
        )}
      </div>

      {/* Detailed Progress List */}
      {progress.length > 0 && (
        <div className="bg-white border border-neutral-light rounded-2xl p-6">
          <h4 className="text-base font-bold text-text-charcoal mb-4">
            جزئیات پیشرفت
          </h4>
          
          <div className="space-y-2">
            {progress.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-neutral-indigo/5 rounded-lg border border-neutral-extralight"
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                ) : item.lastAttemptAt ? (
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <Circle className="w-5 h-5 text-neutral-gray flex-shrink-0" aria-hidden="true" />
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-charcoal truncate">
                    درس {item.lessonId.substring(0, 8)}...
                  </p>
                  {item.lastAttemptAt && (
                    <p className="text-xs text-text-light">
                      آخرین تلاش: {new Date(item.lastAttemptAt).toLocaleDateString('fa-IR')}
                    </p>
                  )}
                </div>
                
                {item.averageScore !== null && (
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Award className="w-4 h-4 text-primary" aria-hidden="true" />
                    <span className={`${
                      item.averageScore >= 80 ? 'text-emerald-600' :
                      item.averageScore >= 60 ? 'text-amber-600' :
                      'text-rose-600'
                    }`}>
                      {item.averageScore}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} aria-hidden="true" />
      <p className="text-2xl font-black text-text-charcoal">{value}</p>
      <p className="text-xs text-text-gray mt-1">{label}</p>
    </div>
  );
}

