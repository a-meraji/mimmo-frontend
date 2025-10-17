export default function ExamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow">
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-charcoal mb-6">
            آزمون‌ها
          </h1>
          <p className="text-xl text-text-gray max-w-2xl mx-auto mb-8">
            با آزمون‌های متنوع دانش خود را بسنجید و مهارت‌های خود را ارزیابی کنید
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-border-light shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-text-charcoal mb-3">آزمون‌های عمومی</h3>
            <p className="text-text-gray mb-4">
              شرکت در آزمون‌های عمومی و جامع در زمینه‌های مختلف
            </p>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
              مشاهده آزمون‌ها
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-border-light shadow-lg">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-text-charcoal mb-3">آزمون‌های تخصصی</h3>
            <p className="text-text-gray mb-4">
              آزمون‌های تخصصی مرتبط با دوره‌های آموزشی شما
            </p>
            <button className="bg-secondary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
              شروع آزمون
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

