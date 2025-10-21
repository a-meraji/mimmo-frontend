export default function Stats() {
  const stats = [
    {
      value: "۱۰",
      label: "دوره آموزشی",
    },
    {
      value: "% ۹۸",
      label: "رضایت دانشجویان",
    },
    {
      value: "۲،۵۰۰",
      label: "کاربر",
    },
    {
      value: "۸",
      label: "سال تجربه",
    },
  ];

  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Grid: 2 columns on mobile, 4 columns on larger screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-8"
            >
              {/* Value - Large, Bold */}
              <h3 className="text-3xl font-bold scale-150 mb-2 bg-gradient-to-b from-[#212529] to-[#2125298a] bg-clip-text text-transparent">
                {stat.value}
              </h3>
              {/* Label - Smaller, Medium weight */}
              <p className="text-lg font-medium text-text-gray">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

