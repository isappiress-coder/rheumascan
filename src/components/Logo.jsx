export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
        </svg>
      </div>
      {!collapsed && (
        <div className="leading-none">
          <div className="text-white font-bold text-base tracking-tight">RheumaScan</div>
          <div className="text-slate-400 text-[11px] mt-0.5">Ciência em foco</div>
        </div>
      )}
    </div>
  );
}
