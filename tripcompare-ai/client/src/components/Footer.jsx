const Footer = () => {
  return (
    <footer className="mt-12 border-t border-white/15 bg-black/45 backdrop-blur-md">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section>
          <h3 className="font-display text-2xl font-semibold text-white">
            Travel Compare <span className="text-emerald-400">AI</span>
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/75">
            AI-powered travel comparison and smart trip planning platform for better decisions and transparent budgets.
          </p>
        </section>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>
              Phone: <a className="hover:text-emerald-300" href="tel:+918329444018">+91 8329444018</a>
            </li>
            <li>
              Email:{" "}
              <a className="hover:text-emerald-300" href="mailto:travelcompareai@gmail.com">
                travelcompareai@gmail.com
              </a>
            </li>
            <li>Address: Amar Tech Park, Balewadi</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-300/35 bg-emerald-500/12 p-4">
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Company Info</h4>
          <p className="mt-3 text-sm leading-6 text-white/80">
            Travel Compare AI helps travelers compare transport costs, discover destinations, and plan smarter trips using
            AI-generated insights.
          </p>
        </section>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6 lg:px-8">
        Copyright {new Date().getFullYear()} Travel Compare AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
