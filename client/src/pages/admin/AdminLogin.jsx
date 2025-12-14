// import { useState } from "react";
// import api from "../../api";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/admin/login", { email, password });
//       localStorage.setItem("token", res.data.token);
//       window.location.href = "/admin";
//     } catch {
//       setMsg("Invalid credentials. Access Denied.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      
//       {/* Soft Red Glow */}
//       <div className="absolute w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[120px] -top-20 -left-20"></div>

//       <div className="w-full max-w-md bg-[#111318] p-10 rounded-2xl shadow-2xl shadow-black/40 relative z-10">

//         {/* HEADER */}
//         <div className="text-center mb-10">
//           <h2 className="text-2xl font-black text-white tracking-widest mb-2">
//             RESCUE<span className="text-red-500">OPS</span> ADMIN
//           </h2>
//           <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em]">
//             Administrator Access Only
//           </p>
//         </div>

//         {/* ERROR MESSAGE */}
//         {msg && (
//           <div className="mb-6 p-3 bg-red-500/10 text-red-500 text-xs font-bold text-center rounded-lg shadow-sm shadow-red-900/20">
//             {msg}
//           </div>
//         )}

//         {/* FORM */}
//         <form onSubmit={submit} className="space-y-6">
          
//           <div>
//             <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
//               Admin Email
//             </label>
//             <input
//               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm 
//                          focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
//               placeholder="admin@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
//               Admin Password
//             </label>
//             <input
//               className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm 
//                          focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {/* BUTTON */}
//           <button
//             className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 
//                        text-white font-bold py-3.5 rounded-lg shadow-lg shadow-red-600/20 
//                        transition-all transform hover:scale-[1.02]"
//           >
//             Login to Dashboard
//           </button>
//         </form>

//         {/* RETURN */}
//         <div className="mt-8 text-center">
//           <a href="/" className="text-slate-500 text-xs hover:text-white transition-colors">
//             ← Return to Public Portal
//           </a>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../../api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch {
      setMsg("Invalid credentials. Access Denied.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Soft Red Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none"></div>

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-10 w-full max-w-md border border-slate-800 shadow-2xl shadow-red-900/20">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Admin Command Center</h1>
        <p className="text-sm text-slate-500 mb-8 text-center">Secure Access Required</p>

        <form onSubmit={submit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:border-red-500 transition-all"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-slate-600 focus:border-red-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          {msg && <p className="text-sm text-red-500 text-center">{msg}</p>}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 
                       text-white font-bold py-3.5 rounded-lg shadow-lg shadow-red-600/20 
                       transition-all transform hover:scale-[1.02]"
          >
            Login to Dashboard
          </button>
        </form>

        {/* Return */}
        <div className="mt-8 text-center">
          <a href="/" className="text-slate-500 text-xs hover:text-white transition-colors">
            ← Return to Public Portal
          </a>
        </div>
      </div>
    </div>
  );
}