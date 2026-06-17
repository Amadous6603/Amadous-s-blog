export default function Footer() {
  return (
    <footer className="py-10 text-center relative"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.15), transparent)' }}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="w-10 h-px bg-white/25 mx-auto mb-5" />
        <p className="font-mono text-xs uppercase tracking-widest text-white/85 mb-3"
           style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>Amadous的小屋</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <a href="http://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"
             className="text-white/75 hover:text-white transition-colors no-underline"
             style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            豫ICP备2026022600号-1
          </a>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41018302000589" target="_blank" rel="noopener noreferrer"
             className="text-white/75 hover:text-white transition-colors no-underline"
             style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            豫公网安备 41018302000589号
          </a>
        </div>
      </div>
    </footer>
  );
}
