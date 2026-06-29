const HeroVisual = () => (
  <div className="relative">
    <img
      src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=85"
      alt="Technology team collaborating around a product planning table"
      className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl"
    />
    <div className="absolute -bottom-6 left-6 right-6 rounded-lg border border-white/70 bg-white/95 p-5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Delivery pulse</p>
          <p className="mt-1 text-2xl font-black text-[#0d1f2d]">92%</p>
        </div>
        <div className="h-12 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Active roadmap</p>
          <p className="mt-1 text-2xl font-black text-[#0d1f2d]">8 weeks</p>
        </div>
      </div>
    </div>
  </div>
);

export default HeroVisual;
