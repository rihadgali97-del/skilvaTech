const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-slate-400 text-sm">Loading...</span>
    </div>
  </div>
);

export default PageLoader;
