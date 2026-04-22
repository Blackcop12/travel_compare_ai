const ItineraryBoard = ({ itinerary = [] }) => {
  if (!itinerary.length) {
    return null;
  }

  return (
    <section className="glass-card fade-in rounded-3xl p-5 shadow-soft">
      <h2 className="font-display text-2xl text-white">Day-wise Itinerary Planner</h2>
      <div className="mt-5 space-y-4">
        {itinerary.map((dayPlan) => (
          <article key={dayPlan.day} className="rounded-2xl bg-black/35 p-4 ring-1 ring-white/15">
            <h3 className="text-lg font-extrabold text-white">Day {dayPlan.day}: {dayPlan.title}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
              {dayPlan.schedule.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ItineraryBoard;
