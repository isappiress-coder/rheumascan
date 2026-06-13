export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3.5 animate-pulse">
      <div className="flex gap-2">
        <div className="h-5 w-24 bg-slate-100 rounded-full" />
        <div className="h-5 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-3 w-20 bg-slate-100 rounded" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
        <div className="h-4 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-50 rounded w-full" />
        <div className="h-3 bg-slate-50 rounded w-2/3" />
      </div>
      <div className="h-4 w-32 bg-teal-50 rounded mt-auto" />
    </div>
  );
}
