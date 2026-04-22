const CostBreakdownCard = ({ dashboard }) => {
  if (!dashboard) {
    return null;
  }

  return (
    <section className="glass-card fade-in rounded-3xl p-5 shadow-soft">
      <h2 className="font-display text-2xl text-white">Trip Cost Dashboard</h2>
      <p className="mt-2 text-sm text-white/75">Total cost estimate with travel, stay, and food breakdown.</p>

      <div className="mt-5 rounded-2xl bg-black/45 p-5 text-white ring-1 ring-emerald-300/25">
        <p className="text-sm text-white/75">Estimated Total Trip Cost</p>
        <p className="mt-1 text-4xl font-extrabold">INR {dashboard.totalTripCost}</p>
        <p className="mt-2 text-sm text-white/75">Selected mode: {dashboard.selectedTravelMode.toUpperCase()}</p>
        {dashboard.selectedHotelName ? (
          <p className="mt-1 text-sm text-white/75">Selected hotel: {dashboard.selectedHotelName}</p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-black/35 p-4 ring-1 ring-white/15">
          <p className="text-sm text-white/65">Travel</p>
          <p className="text-xl font-bold text-white">INR {dashboard.breakdown.travel}</p>
        </div>
        <div className="rounded-xl bg-black/35 p-4 ring-1 ring-white/15">
          <p className="text-sm text-white/65">Stay</p>
          <p className="text-xl font-bold text-white">INR {dashboard.breakdown.stay}</p>
        </div>
        <div className="rounded-xl bg-black/35 p-4 ring-1 ring-white/15">
          <p className="text-sm text-white/65">Food</p>
          <p className="text-xl font-bold text-white">INR {dashboard.breakdown.food}</p>
        </div>
      </div>
    </section>
  );
};

export default CostBreakdownCard;
