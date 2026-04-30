export const BlogCardSkeleton = () => {
  return (
    <div className="w-full p-4 border-b border-slate-200 pb-4 animate-pulse">
      <div className="flex">
        <div className="flex justify-center flex-col">
          <div className="w-6 h-6 rounded-full bg-slate-300"></div>
        </div>

        <div className="flex justify-center flex-col pl-2">
          <div className="h-4 w-24 rounded bg-slate-300"></div>
        </div>

        <div className="flex justify-center flex-col pl-2">
          <div className="h-1 w-1 rounded-full bg-slate-300"></div>
        </div>

        <div className="flex justify-center flex-col pl-2">
          <div className="h-4 w-20 rounded bg-slate-300"></div>
        </div>
      </div>

      <div className="pt-2">
        <div className="h-6 w-3/4 rounded bg-slate-300"></div>
      </div>

      <div className="pt-2 space-y-2">
        <div className="h-4 w-full rounded bg-slate-300"></div>
        <div className="h-4 w-full rounded bg-slate-300"></div>
        <div className="h-4 w-2/3 rounded bg-slate-300"></div>
      </div>

      <div className="pt-2">
        <div className="h-4 w-28 rounded bg-slate-300"></div>
      </div>
    </div>
  );
};