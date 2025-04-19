import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full text-gray-800 bg-white">
      {/* ✅ Hero */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <img
          src="https://sloanreview.mit.edu/wp-content/uploads/2020/05/GEN-Sheffi-Supply-Chain-Disruption-1290x860-1.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800">
            Premium Industrial Supplies, Delivered
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            High-quality ribbons, tapes, rubbers, and creasing materials —
            tailored for your business.
          </p>
          <Link
            to="/shop"
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* ✅ Our Promise */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Megadie?</h2>
          <p className="text-gray-600 text-lg">
            We cut out middlemen and deliver industrial-grade materials directly
            from factories to your store — saving you money, time, and hassle.
          </p>
        </div>
      </section>

      {/* ✅ Product Categories */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Product Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Tapes", "Rubbers", "Ribbons", "Creasing"].map((cat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition"
              >
                <img
                  src={`https://picsum.photos/seed/${cat}/300/200`}
                  alt={cat}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <p className="font-semibold text-lg text-gray-700">{cat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-14">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {["Browse Products", "Request a Quote", "Fast Delivery"].map(
              (step, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-purple-600 text-4xl font-bold mb-3">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step}</h3>
                  <p className="text-sm text-gray-600">
                    {i === 0 &&
                      "Explore a range of high-quality materials curated for industrial use."}
                    {i === 1 &&
                      "Tell us what you need and we’ll provide a competitive offer tailored to you."}
                    {i === 2 &&
                      "We ship directly to your store or factory, quickly and reliably."}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1011, 1027, 1005].map((id, i) => (
              <div
                key={i}
                className="bg-white border p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700 italic mb-4">
                  “Megadie helped us reduce costs and improve delivery times. We
                  trust them for every large order.”
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={`https://picsum.photos/id/${id}/40/40`}
                    alt="client"
                    className="rounded-full object-cover w-10 h-10"
                  />
                  <div>
                    <p className="font-semibold">Client Name</p>
                    <p className="text-sm text-gray-500">Company</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ CTA */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold mb-4">Let’s Work Together</h2>
        <p className="text-lg text-gray-600 mb-8">
          Whether you're looking to buy or supply — we're ready to partner with
          you.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/shop"
            className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition"
          >
            Browse Products
          </Link>
          <Link
            to="/become-a-supplier"
            className="border border-purple-700 text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-700 hover:text-white transition"
          >
            Become a Supplier
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
