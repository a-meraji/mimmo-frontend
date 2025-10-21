export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow">
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-charcoal mb-6">
            دوره‌های آموزشی
          </h1>
          <p className="text-xl text-text-gray max-w-2xl mx-auto mb-8">
            به جمع هزاران دانشجوی آکادمی میمو بپیوندید و مهارت‌های جدید بیاموزید
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border-light shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text-charcoal mb-2">
                  دوره آموزشی {i}
                </h3>
                <p className="text-text-gray mb-4">
                  یادگیری مهارت‌های حرفه‌ای با بهترین اساتید
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">۲۵۰,۰۰۰ تومان</span>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
                    مشاهده دوره
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

