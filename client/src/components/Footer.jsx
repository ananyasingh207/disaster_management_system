export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 text-slate-400">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 pr-8">
            <h3 className="text-2xl font-black text-white tracking-wider mb-4">
              DISASTER<span className="text-red-600">PORTAL</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              Coordinating humanity's response to crisis. Powered by real-time data, community action, and rapid deployment technology.
            </p>
          </div>

          {/* Links 1 */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Emergency</h4>
            <a href="#" className="hover:text-red-500 transition-colors text-sm">Report Incident</a>
            <a href="#" className="hover:text-red-500 transition-colors text-sm">Live Storm Tracker</a>
            <a href="#" className="hover:text-red-500 transition-colors text-sm">Find Shelter</a>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Support</h4>
            <a href="#" className="hover:text-blue-500 transition-colors text-sm">Admin Login</a>
            <a href="#" className="hover:text-blue-500 transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition-colors text-sm">Contact Control</a>
          </div>
        </div>

        {/* Helpline Banner */}
        <div className="border-t border-slate-900 pt-8 pb-8 flex flex-col md:flex-row justify-between items-center bg-slate-900/30 rounded-2xl px-8 mb-8 border border-slate-800/50">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Emergency Helpline</p>
            <p className="text-3xl font-black text-red-500 mt-1">108 <span className="text-lg text-slate-600 font-normal">/ 112</span></p>
          </div>
          <div className="text-right">
             <p className="text-sm text-slate-400">National Disaster Management Authority</p>
             <p className="text-sm font-bold text-slate-300">011-1078</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 2025 Disaster Response Unit. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <span>Secure Connection</span>
            <span>v2.4.1</span>
          </div>
        </div>

      </div>
    </footer>
  );
}