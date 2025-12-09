import { useState } from "react";
import api from "../../api";

export default function Training() {
  const [sessionState, setSessionState] = useState("BRIEFING"); // BRIEFING, SIMULATION, RESULT
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // 🎥 VIDEO TRAINING MODULES (Updated with working links)
  const modules = [
    { 
      id: 1, 
      title: "Protocol: START Triage", 
      videoUrl: "https://www.youtube.com/embed/nfBJGeAdu5o", 
      desc: "Learn the START method: Simple Triage and Rapid Treatment for mass casualty incidents." 
    },
    { 
      id: 2, 
      title: "Protocol: Urban Search & Rescue", 
      // Source: Fire and Rescue NSW (Official Demonstration)
      videoUrl: "https://www.youtube.com/embed/ibvpYRED45E", 
      desc: "Overview of equipment and safety protocols for entering collapsed structures." 
    }
  ];

  // 🎮 2. SIMULATION SCENARIOS (Practical Test)
  const scenarios = [
    {
      id: 1,
      situation: "FLOOD ZONE: You see a family stranded on a roof. The water current is extremely fast. You have a rope.",
      options: [
        { text: "Swim immediately with the rope tied to your waist.", impact: -20, outcome: "CRITICAL FAILURE. You are swept away by the current. Rescuer became a victim." },
        { text: "Call for a boat unit and throw a line from safety.", impact: 20, outcome: "PROTOCOL FOLLOWED. Safety ensured for both rescuer and victims." },
        { text: "Wait for the water to recede.", impact: -5, outcome: "POOR JUDGMENT. Hypothermia risk increases with time." }
      ]
    },
    {
      id: 2,
      situation: "COLLAPSE: You find a victim with a metal rod piercing their leg. Heavy bleeding.",
      options: [
        { text: "Pull the rod out immediately to bandage the wound.", impact: -30, outcome: "FATAL ERROR. Removing the object caused massive arterial bleeding." },
        { text: "Stabilize the object with bulky dressings and apply pressure around it.", impact: 20, outcome: "EXCELLENT. You controlled bleeding without causing further damage." },
        { text: "Leave them to find someone easier to save.", impact: -10, outcome: "FAILURE. Life-threatening hemorrhage requires immediate stabilization." }
      ]
    },
    {
      id: 3,
      situation: "GAS LEAK: You see an unconscious victim inside a room filled with yellow gas.",
      options: [
        { text: "Hold breath and run in to drag them out.", impact: -20, outcome: "DANGEROUS. You are now unconscious too. Two casualties." },
        { text: "Secure the perimeter and evacuate nearby civilians. Wait for Hazmat.", impact: 20, outcome: "CORRECT. Scene safety is Priority #1." },
        { text: "Throw water on the gas.", impact: -10, outcome: "INCORRECT. Chemical reaction unpredictable." }
      ]
    }
  ];

  const handleDecision = (impact, outcome) => {
    setFeedback({ impact, outcome });
    setScore(prev => prev + impact);
  };

  const nextScenario = () => {
    setFeedback(null);
    if (currentScenario + 1 < scenarios.length) {
      setCurrentScenario(prev => prev + 1);
    } else {
      submitResults();
    }
  };

  const submitResults = async () => {
    setLoading(true);
    // Normalize score to 0-100 range based on max possible points (20 per q)
    const maxPossible = scenarios.length * 20;
    const finalPercentage = Math.max(0, (score / maxPossible) * 100);

    try {
      await api.post("/volunteer/training/submit", { score: finalPercentage });
      setSessionState("RESULT");
    } catch (err) {
      alert("Error saving certification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Tactical Training Center</h1>
        <p className="text-slate-400 font-medium">Acquire skills and verify readiness via live simulation.</p>
      </div>

      {/* --- PHASE 1: BRIEFING (VIDEOS) --- */}
      {sessionState === "BRIEFING" && (
        <div className="space-y-8">
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl flex items-center gap-4">
            <span className="text-3xl">🎥</span>
            <div>
              <h3 className="font-bold text-blue-400">Step 1: Video Briefing</h3>
              <p className="text-sm text-slate-300">Watch the protocols below. You will be tested on these situations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map(m => (
              <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="aspect-video w-full bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={m.videoUrl} 
                    title={m.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white">{m.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button 
              onClick={() => setSessionState("SIMULATION")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-12 rounded-xl shadow-lg shadow-emerald-500/20 transform hover:scale-105 transition-all text-lg uppercase tracking-widest"
            >
              Start Live Simulation
            </button>
          </div>
        </div>
      )}

      {/* --- PHASE 2: LIVE SIMULATION --- */}
      {sessionState === "SIMULATION" && (
        <div className="max-w-3xl mx-auto">
          
          <div className="flex justify-between items-center mb-6 text-xs font-mono text-slate-500">
            <span>SCENARIO {currentScenario + 1} / {scenarios.length}</span>
            <span>TACTICAL SCORE: {score}</span>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Situation Header */}
            <div className="bg-slate-950 p-8 border-b border-slate-800">
              <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4 animate-pulse">
                Critical Incident In Progress
              </div>
              <h2 className="text-2xl font-bold text-white leading-snug">
                {scenarios[currentScenario].situation}
              </h2>
            </div>

            {/* Decision Area */}
            <div className="p-8 bg-slate-900/50 backdrop-blur">
              {!feedback ? (
                <div className="grid gap-4">
                  {scenarios[currentScenario].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDecision(opt.impact, opt.outcome)}
                      className="text-left p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all group"
                    >
                      <span className="font-bold mr-3 opacity-50 group-hover:opacity-100 text-sm tracking-wider">OPTION {String.fromCharCode(65 + idx)}:</span>
                      {opt.text}
                    </button>
                  ))}
                </div>
              ) : (
                // FEEDBACK OVERLAY
                <div className="text-center animate-fade-in">
                  <div className={`text-6xl mb-4 ${feedback.impact > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {feedback.impact > 0 ? "✓" : "✕"}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${feedback.impact > 0 ? "text-white" : "text-red-400"}`}>
                    {feedback.impact > 0 ? "PROTOCOL FOLLOWED" : "TACTICAL ERROR"}
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-lg mx-auto">{feedback.outcome}</p>
                  
                  <button 
                    onClick={nextScenario}
                    className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors uppercase tracking-wider text-sm"
                  >
                    {currentScenario + 1 < scenarios.length ? "Next Scenario →" : "Finish Assessment"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PHASE 3: RESULTS --- */}
      {sessionState === "RESULT" && (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl mx-auto shadow-2xl">
          {loading ? (
            <p className="text-slate-400 animate-pulse">Calculating Tactical Rating...</p>
          ) : (
            <>
              <div className="text-6xl mb-6">
                {score > 20 ? "🎖️" : "⚠️"}
              </div>
              
              <h2 className="text-3xl font-black text-white mb-2">
                {score > 20 ? "CERTIFICATION GRANTED" : "CERTIFICATION FAILED"}
              </h2>
              
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {score > 20 
                  ? "You have demonstrated excellent tactical judgment. Your profile has been updated with the 'Certified Responder' badge." 
                  : "Your survival score was too low. Please review the training modules and try again."}
              </p>

              <div className="flex gap-4 justify-center">
                {score <= 20 && (
                  <button onClick={() => { setScore(0); setCurrentScenario(0); setSessionState("BRIEFING"); }} className="px-6 py-3 bg-slate-800 text-slate-300 hover:text-white rounded-lg font-bold text-sm">
                    RETRY
                  </button>
                )}
                <button 
                  onClick={() => window.location.href = "/volunteer/profile"}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-colors text-sm"
                >
                  VIEW PROFILE
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}