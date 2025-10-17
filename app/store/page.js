export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow">
      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-charcoal mb-6">
            فروشگاه
          </h1>
          <p className="text-xl text-text-gray max-w-2xl mx-auto mb-8">
            خرید کتاب، محصولات دیجیتال و لوازم آموزشی
          </p>
        </section>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {["همه محصولات", "کتاب‌ها", "محصولات دیجیتال", "لوازم آموزشی"].map((cat) => (
            <button
              key={cat}
              className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-border-light hover:border-primary transition-colors font-semibold text-text-charcoal"
            >
              {cat}
            </button>
          ))}
        </div>

        <section className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border-light shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-neutral-indigo to-neutral-yellow flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-text-charcoal mb-2">
                  محصول {i}
                </h3>
                <p className="text-text-gray text-sm mb-3">
                  توضیحات کوتاه محصول
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">۱۵۰,۰۰۰ تومان</span>
                  <button className="bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-sm">
                    خرید
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

