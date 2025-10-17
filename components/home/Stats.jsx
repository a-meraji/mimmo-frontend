export default function Stats() {
  const stats = [
    {
      value: "6 دوره",
      label: "ویدیو آموزشی",
    },
    {
      value: "% 98.5",
      label: "رضایت دانشجویان",
    },
    {
      value: "2,500 نفر",
      label: "مجموعی ها",
    },
    {
      value: "8 سال",
      label: "سال تجربه",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-gradient-yellow-muted to-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Grid: 2 columns on mobile, 4 columns on larger screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-start">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-8"
            >
              {/* Value - Large, Bold */}
              <h3 className="text-xl font-medium text-text-charcoal mb-2">
                {stat.value}
              </h3>
              {/* Label - Smaller, Medium weight */}
              <p className="text-sm font-medium text-text-gray">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

