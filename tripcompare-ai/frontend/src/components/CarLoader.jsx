const CarLoader = () => {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-white/20 bg-black/35 p-3">
      <div className="relative h-8">
        <div className="absolute inset-y-0 left-0 right-0 top-3 h-[2px] bg-white/25" />
        <div className="car-runner text-lg">car</div>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
        AI is building your travel plan...
      </p>
    </div>
  );
};

export default CarLoader;
