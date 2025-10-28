"use client";

export default function StatsGrid({ stats }) {
  const statsData = [
    {
      id: 1,
      label: "دوره موجود در آکادمی",
      value: stats?.cartCount || 10,
    },
    {
      id: 2,
      label: "دوره ثبت نام شده",
      value: stats?.enrolledCount || 2,
    },
    {
      id: 3,
      label: "دوره تمام شده",
      value: stats?.freeCoursesCount || 1,
    },
    {
      id: 4,
      label: "پیشرفت شما",
      value: stats?.progressPercentage ? `${stats.progressPercentage}%` : "80%",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full">
      {statsData.map((stat) => {
        return (
          <div
            key={stat.id}
            className="bg-white/60 shadow-lg backdrop-blur-sm rounded-3xl p-8 flex flex-col items-center justify-center hover:bg-white/80 transition-all duration-200 min-h-[140px]"
          >
            {/* Value */}
            <div className="text-3xl font-bold scale-150 mb-2 bg-gradient-to-b from-[#212529] to-[#2125298a] bg-clip-text text-transparent">
              {stat.value}
            </div>
            
            {/* Label */}
            <p className="text-xs font-medium text-text-gray text-center">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

