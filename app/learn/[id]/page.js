import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseChapters from "@/components/product/CourseChapters";
import {
  ArrowRight,
  BookOpenCheck,
  Clock3,
  Flame,
  Trophy,
} from "lucide-react";

const LEARN_COURSES = {
  "espresso-1": {
    id: "espresso-1",
    title: "اسپرسو ۱ - مکالمه روزمره",
    subtitle: "دروس ۱ تا ۵ | سطح A1",
    coverImage: "/es1.webp",
    level: "A1",
    description:
      "این دوره تمرکز ویژه‌ای روی مکالمه‌های روزمره، آشنایی با ساختارهای اولیه زبان ایتالیایی و تمرین‌های شنیداری دارد تا در کوتاه‌ترین زمان مکالمه‌های ساده را یاد بگیرید.",
    tags: ["مکالمه", "واژگان", "گرامر پایه"],
    progress: {
      totalSeasons: 3,
      completedSeasons: 1,
      totalChapters: 12,
      completedChapters: 5,
      totalLessons: 36,
      completedLessons: 18,
      streakDays: 6,
      practiceMinutes: 660,
      lastPracticed: "۲ روز پیش",
    },
    nextLesson: {
      title: "درس ۱۹ - سفارش قهوه در کافه",
      link: "/learn/espresso-1/lesson/19",
    },
    milestones: [
      {
        title: "تمرین روزانه ۱۵ دقیقه",
        description: "با حفظ تمرین روزانه، در مسیر یادگیری سریع باقی می‌مانید.",
      },
      {
        title: "بازبینی واژگان جدید",
        description: "واژگان جدید هر درس را در فلش‌کارت‌ها مرور کنید.",
      },
    ],
    seasons: [
      {
        title: "فصل ۱: شروع مکالمه",
        status: "completed",
        completedLessons: 12,
        totalLessons: 12,
        chapters: [
          {
            title: "معرفی و سلام و احوالپرسی",
            status: "completed",
            completedLessons: 6,
            lessons: [
              { id: "lesson-1", title: "سلام و آشنایی",  status: "completed" },
              { id: "lesson-2", title: "معرفی خود", status: "completed" },
              { id: "lesson-3", title: "پرسیدن احوال",  status: "completed" },
              { title: "تمرین تلفظ", status: "completed" },
            ],
          },
          {
            title: "واژگان کاربردی روز اول",
            status: "completed",
            completedLessons: 6,
            lessons: [
              { title: "اعداد و زمان", status: "completed" },
              { title: "واژگان روزمره", status: "completed" },
              { title: "کاربرد فعل بودن", status: "completed" },
            ],
          },
        ],
      },
      {
        title: "فصل ۲: موقعیت‌های شهری",
        status: "in-progress",
        completedLessons: 6,
        totalLessons: 12,
        chapters: [
          {
            title: "در مسیر شهر",
            status: "in-progress",
            completedLessons: 3,
            lessons: [
              { title: "پرسیدن آدرس", status: "completed" },
              { title: "گرفتن تاکسی", status: "in-progress" },
              { title: "راهنمایی مسیر", status: "locked" },
            ],
          },
          {
            title: "در کافه و رستوران",
            status: "in-progress",
            completedLessons: 3,
            lessons: [
              { title: "سفارش نوشیدنی", status: "in-progress" },
              { title: "رزرو میز", status: "locked" },
              { title: "پرداخت و انعام", status: "locked" },
            ],
          },
        ],
      },
      {
        title: "فصل ۳: برنامه‌ریزی سفر",
        status: "locked",
        completedLessons: 0,
        totalLessons: 12,
        chapters: [
          {
            title: "رزرو هتل",
            status: "locked",
            lessons: [
              { title: "تماس با هتل", status: "locked" },
              { title: "درخواست امکانات", status: "locked" },
            ],
          },
          {
            title: "برنامه سفر روزانه",
            status: "locked",
            lessons: [
              { title: "خرید بلیت", status: "locked" },
              { title: "سوال درباره ساعت حرکت", status: "locked" },
            ],
          },
        ],
      },
    ],
  },
  "espresso-2": {
    id: "espresso-2",
    title: "اسپرسو ۲ - مکالمه پیشرفته",
    subtitle: "دروس ۶ تا ۱۰ | سطح A2",
    coverImage: "/es2.webp",
    level: "A2",
    description:
      "ورود به سطح متوسط با تمرکز بر مکالمات پیچیده‌تر، بیان احساسات و شرکت در گفتگوهای طولانی‌تر.",
    tags: ["مکالمه", "گرامر پیشرفته", "واژگان تخصصی"],
    progress: {
      totalSeasons: 4,
      completedSeasons: 0,
      totalChapters: 16,
      completedChapters: 2,
      totalLessons: 48,
      completedLessons: 6,
      streakDays: 2,
      practiceMinutes: 180,
      lastPracticed: "۵ روز پیش",
    },
    nextLesson: {
      title: "درس ۷ - صحبت درباره برنامه روزانه",
      link: "/learn/espresso-2/lesson/7",
    },
    milestones: [
      {
        title: "شروع دوباره پیوسته",
        description: "برای حفظ انگیزه، روزانه حداقل ۱۰ دقیقه تمرین کنید.",
      },
      {
        title: "تمرین جملات ترکیبی",
        description: "با ترکیب جملات طولانی‌تر، مکالمه روان‌تری داشته باشید.",
      },
    ],
    seasons: [
      {
        title: "فصل ۱: گفتگوهای روزمره",
        status: "in-progress",
        completedLessons: 4,
        totalLessons: 12,
        chapters: [
          {
            title: "روایت داستان",
            status: "in-progress",
            completedLessons: 2,
            lessons: [
              { title: "تعریف اتفاقات گذشته", status: "in-progress" },
              { title: "گفتگو درباره برنامه فردا", status: "locked" },
            ],
          },
          {
            title: "بیان احساسات",
            status: "locked",
            lessons: [
              { title: "توصیف حالات روحی",  status: "locked" },
              { title: "صحبت درباره علایق", status: "locked" },
            ],
          },
        ],
      },
      {
        title: "فصل ۲: مکالمات کاری",
        status: "locked",
        completedLessons: 0,
        totalLessons: 12,
        chapters: [
          {
            title: "آشنایی در محیط کار",
            status: "locked",
            lessons: [
              { title: "جلسه کاری اول",  status: "locked" },
              { title: "نوشتن ایمیل رسمی", status: "locked" },
            ],
          },
        ],
      },
    ],
  },
  "driving-license": {
    id: "driving-license",
    title: "دوره جامع گواهینامه ایتالیا",
    subtitle: "یادگیری کامل آزمون تئوری",
    coverImage: "/license0.webp",
    level: "B1",
    description:
      "تمام قوانین و نکات لازم برای قبولی در آزمون آیین‌نامه ایتالیا با تمرین‌های تعاملی و نمونه سؤالات واقعی.",
    tags: ["آیین‌نامه", "آزمون تئوری", "تمرین تست"],
    progress: {
      totalSeasons: 5,
      completedSeasons: 2,
      totalChapters: 20,
      completedChapters: 9,
      totalLessons: 60,
      completedLessons: 28,
      streakDays: 10,
      practiceMinutes: 780,
      lastPracticed: "۱ روز پیش",
    },
    nextLesson: {
      title: "بخش ۲۱ - علائم راهنمایی جزء دوم",
      link: "/learn/driving-license/lesson/21",
    },
    milestones: [
      {
        title: "تکمیل علائم راهنمایی",
        description: "تمام علائم هشدار و راهنمایی را مرور کرده‌اید. بخش بعدی قوانین سرعت است.",
      },
      {
        title: "امتیاز تست آزمایشی",
        description: "امتیاز آخرین آزمون آزمایشی: ۸۶ از ۱۰۰. به همین روند ادامه دهید!",
      },
    ],
    seasons: [
      {
        title: "فصل ۱: مقدمات رانندگی",
        status: "completed",
        completedLessons: 12,
        totalLessons: 12,
        chapters: [
          {
            title: "مبانی رانندگی",
            status: "completed",
            lessons: [
              { title: "دانش پایه", status: "completed" },
              { title: "شناخت داشبورد", status: "completed" },
            ],
          },
          {
            title: "قوانین عمومی",
            status: "completed",
            lessons: [
              { title: "قوانین سرعت", status: "completed" },
              { title: "تقدم عبور", status: "completed" },
            ],
          },
        ],
      },
      {
        title: "فصل ۲: علائم راهنمایی",
        status: "in-progress",
        completedLessons: 8,
        totalLessons: 14,
        chapters: [
          {
            title: "علائم هشدار",
            status: "completed",
            lessons: [
              { title: "علائم خطر", status: "completed" },
              { title: "علائم بازدارنده", status: "completed" },
            ],
          },
          {
            title: "علائم راهنما",
            status: "in-progress",
            lessons: [
              { title: "شناسایی مسیر", status: "in-progress" },
              { title: "علائم خدماتی", status: "locked" },
            ],
          },
        ],
      },
      {
        title: "فصل ۳: موقعیت‌های خاص",
        status: "locked",
        completedLessons: 0,
        totalLessons: 10,
        chapters: [
          {
            title: "رانندگی در شرایط جوی",
            status: "locked",
            lessons: [
              { title: "باران و برف", status: "locked" },
              { title: "مه و یخ زدگی", status: "locked" },
            ],
          },
        ],
      },
    ],
  },
};

export default function LearnCoursePage({ params }) {
  const { id } = use(params);
  const course = LEARN_COURSES[id];

  if (!course) {
    notFound();
  }

  const completionPercent = Math.min(
    100,
    Math.round((course.progress.completedLessons / course.progress.totalLessons) * 100)
  );

  const chapterPercent = Math.min(
    100,
    Math.round((course.progress.completedChapters / course.progress.totalChapters) * 100)
  );

  const seasonPercent = Math.min(
    100,
    Math.round((course.progress.completedSeasons / course.progress.totalSeasons) * 100)
  );

  const progressStats = [
    {
      id: "lessons",
      icon: BookOpenCheck,
      label: "درس‌های تکمیل شده",
      value: `${course.progress.completedLessons} از ${course.progress.totalLessons}`,
      percent: completionPercent,
    },
    {
      id: "streak",
      icon: Flame,
      label: "رکورد پیوستگی",
      value: `${course.progress.streakDays} روز متوالی`,
      percent: null,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-8" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            بخش یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">{course.title}</span>
        </nav>

        <header className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="grid lg:grid-cols-12 gap-0">
            <div className="lg:col-span-5 relative min-h-[260px] bg-neutral-indigo/10">
              <Image
                src={course.coverImage}
                alt={course.title}
                fill
                className="object-contain p-8"
                priority
              />
              <span className="absolute top-6 right-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg">
                سطح {course.level}
              </span>
              <div className="absolute bottom-6 right-6 left-6 gap-x-4 bg-white/95 border border-neutral-extralight rounded-2xl shadow-lg px-5 py-4 flex items-center justify-between">
                <div className="w-fit">
                  <p className="text-xs text-text-light whitespace-nowrap">پیشرفت کلی</p>
                  <p className="text-lg font-bold text-text-charcoal">{completionPercent}%</p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-96">
                  <ProgressBar percent={completionPercent} />
                  <span className="text-[11px] text-text-gray">
                    {course.progress.completedLessons} از {course.progress.totalLessons} درس
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-black text-text-charcoal">
                  {course.title}
                </h1>
                <p className="text-sm text-text-gray">{course.subtitle}</p>
              </div>
              <p className="text-sm text-text-charcoal/80 leading-7">
                {course.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <StatBadge
                  icon={BookOpenCheck}
                  title="درس‌های کامل شده"
                  value={`${course.progress.completedLessons} درس`}
                />
                <StatBadge
                  icon={Clock3}
                  title="مدت زمان آموزش"
                  value={`${Math.round(course.progress.practiceMinutes / 60)} ساعت`}
                />
                <StatBadge
                  icon={Flame}
                  title="پیوستگی در تمرین"
                  value={`${course.progress.streakDays} روز`}
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4">
                <div>
                  <p className="text-xs text-text-light">آخرین فعالیت</p>
                  <p className="text-sm font-medium text-text-charcoal">{course.progress.lastPracticed}</p>
                </div>
                <Link
                  href={course.nextLesson.link}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
                >
                  ادامه از {course.nextLesson.title}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-4 lg:gap-8">
          <div className="lg:col-span-8 space-y-6 lg:space-y-8 min-w-0">
            <CourseChapters seasons={course.seasons} showProgress />

            <section className="bg-white border border-neutral-extralight rounded-2xl p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-bold text-text-charcoal flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" aria-hidden="true" />
                اهداف و پیشنهادها
              </h2>
              <div className="space-y-3">
                {course.milestones.map((milestone, index) => (
                  <div key={index} className="border border-neutral-extralight rounded-xl px-4 py-3 bg-neutral-indigo/20">
                    <p className="text-sm font-medium text-text-charcoal">{milestone.title}</p>
                    <p className="text-xs text-text-gray leading-6 mt-1">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-4 lg:space-y-6 min-w-0">
            <section className="bg-white border border-neutral-extralight rounded-2xl p-4 sm:p-6">
              <h2 className="text-base font-semibold text-text-charcoal mb-4">نمای کلی پیشرفت</h2>
              <div className="space-y-4">
                {progressStats.map((stat) => (
                  <ProgressSummary key={stat.id} {...stat} />
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border border-primary/10 rounded-2xl p-4 sm:p-6">
              <h2 className="text-base font-semibold text-text-charcoal mb-2">درس بعدی را شروع کنید</h2>
              <p className="text-sm text-text-gray mb-4">{course.nextLesson.title}</p>
              <div className="flex items-center justify-between text-xs text-text-light mb-4">
                <span>پیشرفت: {completionPercent}%</span>
              </div>
              <Link
                href={course.nextLesson.link}
                className="inline-flex w-full items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
              >
                شروع درس بعدی
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </section>

          </aside>
        </div>
      </div>
    </main>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="w-full h-2 rounded-full bg-neutral-indigo/90 overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      />
    </div>
  );
}

function StatBadge({ icon: Icon, title, value }) {
  return (
    <div className="bg-neutral-indigo/30 border border-neutral-extralight rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs text-text-light">{title}</p>
        <p className="text-sm font-semibold text-text-charcoal">{value}</p>
      </div>
    </div>
  );
}

function ProgressSummary({ icon: Icon, label, value, percent }) {
  return (
    <div className="border border-neutral-extralight rounded-xl p-4 bg-white/70">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-neutral-indigo/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs text-text-light">{label}</p>
            <p className="text-sm font-semibold text-text-charcoal">{value}</p>
          </div>
        </div>
        {typeof percent === "number" && (
          <span className="text-xs font-medium text-primary">{percent}%</span>
        )}
      </div>
      {typeof percent === "number" && <ProgressBar percent={percent} />}
    </div>
  );
}