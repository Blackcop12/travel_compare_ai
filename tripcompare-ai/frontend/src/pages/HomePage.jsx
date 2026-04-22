import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="space-y-16 pb-14">
      <section className="relative min-h-[82vh] overflow-hidden rounded-none md:rounded-b-[2.5rem]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[82vh] w-full max-w-7xl items-end px-4 pb-14 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.26em] text-emerald-300">Premium AI Travel Platform</p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Explore Exotic <span className="text-emerald-400">Destinations</span> with AI
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Discover the world&apos;s best places with smart AI-powered comparison.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/planner" : "/signup"}
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-3 text-sm font-semibold text-black shadow-xl shadow-emerald-700/30 transition hover:-translate-y-0.5"
              >
                Compare Now
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-soft backdrop-blur-md transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-300">01</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Best Price Guarantee</h3>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Compare routes and travel modes instantly to lock the most cost-efficient choice.
            </p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-soft backdrop-blur-md transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-300">02</p>
            <h3 className="mt-3 text-xl font-semibold text-white">AI Recommendations</h3>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Intelligent destination, hotel, and food suggestions tailored to your trip profile.
            </p>
          </article>
          <article className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-soft backdrop-blur-md transition hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-300">03</p>
            <h3 className="mt-3 text-xl font-semibold text-white">Smart Travel Planning</h3>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Build day-wise itineraries with transparent travel, stay, and food cost breakdowns.
            </p>
          </article>
        </div>
      </section>

      <section id="destinations" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Discover Signature Destinations</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
            From alpine escapes to tropical coastlines, Trip Compare AI helps you compare the best way to travel.
          </p>
          <Link
            to="/destinations"
            className="mt-5 inline-block rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Explore Destinations
          </Link>
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Ready for your next trip?</h2>
          <p className="mt-2 text-sm text-white/80 sm:text-base">
            Start planning with AI and compare smarter before you book.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
