import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans selection:bg-red-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_#ef4444]"></div>
            <span className="text-xl font-black tracking-widest uppercase text-white">
              DISASTER<span className="text-red-600">PORTAL</span>
            </span>
          </div>
          <Link 
            to="/admin/login" 
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
          >
            Command Center <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 relative flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden">
        
        {/* Background Ambience */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center opacity-5 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            System Operational
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight text-white animate-fade-in-up delay-100">
            Rapid Response.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
              Real-time Rescue.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200">
            A centralized command platform connecting citizens in distress with 
            volunteer task forces. Report incidents instantly or join the rescue effort.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link to="/citizen/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/20 transition-all transform hover:-translate-y-1 text-sm tracking-wider uppercase">
                I Need Help
              </button>
            </Link>
            
            <Link to="/volunteer/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all transform hover:-translate-y-1 text-sm tracking-wider uppercase">
                Join The Force
              </button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 pt-10 border-t border-slate-800/50 grid grid-cols-3 gap-8 md:gap-16 opacity-0 animate-fade-in delay-500" style={{opacity: 1}}>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">24/7</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-red-500 mb-1">108</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Emergency</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-blue-500 mb-1">1.2k+</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Volunteers</div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}