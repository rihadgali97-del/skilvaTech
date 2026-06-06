const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-2 border-[#00d4d4] border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-400 text-sm">Loading...</span>
    </div>
  </div>
);

export default PageLoader;