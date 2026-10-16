export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden bg-[#087d81] shadow-sm ring-1 ring-[#087d81]/15"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3) }}
    >
      <svg viewBox="0 0 32 32" width={size * 0.72} height={size * 0.72} aria-hidden="true">
        <path d="M16 27s-10.5-6.4-10.5-13.2C5.5 10 8.1 7.5 11.2 7.5c2 0 3.7 1 4.8 2.6 1.1-1.6 2.8-2.6 4.8-2.6 3.1 0 5.7 2.5 5.7 6.3C26.5 20.6 16 27 16 27z" fill="none" stroke="white" strokeWidth="2.1" strokeLinejoin="round" />
        <path d="M9 16h4l2-3.5 2.2 7 1.8-3.5H23" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <LogoMark size={size} />
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-serif text-[17px] text-foreground">RCS Prime Comunity</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Concursos da saúde</span>
      </span>
    </span>
  );
}
