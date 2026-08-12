export default function SkeletonMenuCard() {
  return (
    <div className="shrink-0 w-[82vw] sm:w-[55vw] md:w-[36vw] lg:w-[30vw] max-w-100 h-[55vh] max-h-125 min-h-102.5 mx-3 md:mx-5 relative">
      <div className="w-full h-full bg-white/10 rounded-2xl animate-pulse flex flex-col overflow-hidden">
        <div className="h-[46%] w-full bg-white/20" />
        <div className="flex-1 p-5 space-y-3">
          <div className="h-6 bg-white/20 rounded w-3/4" />
          <div className="h-4 bg-white/20 rounded w-1/2" />
          <div className="h-8 bg-white/20 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
}

