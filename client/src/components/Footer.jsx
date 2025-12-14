export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-slate-400">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 pr-8">
            <h3 className="text-2xl font-black text-white tracking-wider mb-4">
              RESCUE<span className="text-red-600">OPS</span>
            </h3>
            {/* Tagline removed */}
          </div>

          {/* Links 1 */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Emergency</h4>
            <a href="#" className="hover:text-red-500 transition-colors text-sm">Find Shelter</a>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Support</h4>
            <a href="#" className="hover:text-blue-500 transition-colors text-sm">Admin Login</a>
          </div>
        </div>

        {/* Helpline Banner (Subtle Version) */}
        <div className="pt-8 pb-8 flex flex-col md:flex-row justify-between items-center 
                        bg-slate-900/60 rounded-2xl px-8 mb-8 
                        shadow-[0_0_25px_-5px_rgba(0,0,0,0.45)]">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Helpline</p>
            <p className="text-3xl font-black text-red-500 mt-1">
              108 <span className="text-lg text-slate-400 font-normal">/ 112</span>
            </p>
          </div>
          <div className="text-right">
             <p className="text-sm text-slate-400">National Disaster Management Authority</p>
             <p className="text-sm font-bold text-slate-300">011-1078</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2025 Rescue Ops Unit. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <span>Secure Connection</span>
            <span>v1.1</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
