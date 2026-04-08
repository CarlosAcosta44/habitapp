export function LandingFooter() {
  return (
    <footer className="py-12 bg-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              Habit<span className="text-indigo-500">App</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-white transition-colors">Google Login</a>
            <a href="#" className="hover:text-white transition-colors">Apple Login</a>
            <a href="#" className="hover:text-white transition-colors">Facebook Login</a>
          </div>

          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center md:text-right">
            © 2024 HabitApp. Una opción de estilo de vida premium.
          </p>
        </div>
      </div>
    </footer>
  );
}
