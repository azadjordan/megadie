import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProductType } from "../slices/filtersSlice";

const Home = () => {
  const fallbackImg =
    "https://via.placeholder.com/300x200?text=Image+Unavailable";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = [
    { name: "Ribbon", image: "https://picsum.photos/seed/Ribbons/300/200" },
    {
      name: "Creasing Matrix",
      image: "https://picsum.photos/seed/Creasing/300/200",
    },
    {
      name: "Double Face Tape",
      image: "https://picsum.photos/seed/Tapes/300/200",
    },
  ];

  const handleCategoryClick = (category) => {
    dispatch(setProductType(category));
    navigate("/shop", { state: { fromHome: true } });
  };

  return (
    <div className="w-full text-gray-800 bg-white">
      {/* ✅ Hero */}
      <section className="relative h-[70vh] flex items-center justify-center">
        <img
          src="https://sloanreview.mit.edu/wp-content/uploads/2020/05/GEN-Sheffi-Supply-Chain-Disruption-1290x860-1.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
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
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition cursor-pointer"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* ✅ Our Promise */}
      <section className="sm:py-28 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Megadie?</h2>
          <p className="text-gray-600 text-lg">
            We cut out middlemen and deliver industrial-grade materials directly
            from factories to your store — saving you money, time, and hassle.
          </p>
        </div>
      </section>

      {/* ✅ Product Categories */}
      <section className="sm:py-28 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Product Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImg;
                  }}
                />
                <div className="p-4 text-center">
                  <p className="font-semibold text-lg text-gray-700">
                    {cat.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ How It Works */}
      <section className="sm:py-28 py-20 bg-gray-50">
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
      {/* ✅ Testimonials */}
      <section className="sm:py-28 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-14">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                location: "Abu Dhabi",
                feedback:
                  "Great quality and always on time. I'm glad I was one of the early clients of Megadie!",
              },
              {
                location: "Al Ain",
                feedback: "Very helpful team. Easier work for us.",
              },
              {
                location: "Dubai",
                feedback:
                  "Prices are fair and the materials are strong. Definitely recommend them.",
              },
            ].map((client, i) => (
              <div
                key={i}
                className="bg-white border p-6 rounded-xl shadow-sm hover:shadow-md transition flex flex-col min-h-[140px]"
              >
                <p className="text-gray-700 italic mb-6">“{client.feedback}”</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-semibold blur-sm select-none">
                      Client Name
                    </p>
                    <p className="text-sm text-gray-500">{client.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ CTA */}
      <section className="sm:py-28 py-20 px-10 bg-gray-50 text-center">
      <h2 className="text-3xl font-bold mb-4">Let’s Work Together</h2>
        <p className="text-lg text-gray-600 mb-8">
          Whether you're looking to buy or supply — we're ready to partner with
          you.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/shop"
            className="bg-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition cursor-pointer"
          >
            Browse Products
          </Link>
          <a
            href="https://wa.me/971545050244"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-purple-700 text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-purple-700 hover:text-white transition cursor-pointer"
          >
            Become Our Supplier
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
