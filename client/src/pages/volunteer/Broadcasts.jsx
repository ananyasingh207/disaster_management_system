import { useEffect, useState } from "react";
import api from "../../api"; // Assuming 2 levels deep in client/src/pages/volunteer

export default function Broadcasts() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Fetch data from dashboard endpoint (simplest, no new route needed if that returns broadcasts)
        // Or check if there's a dedicated alerts endpoint. Admin uses getAlerts.
        // Volunteer Dashboard endpoint returns { adminAlerts, ... }

        const fetchBroadcasts = async () => {
            try {
                const res = await api.get("/volunteer/dashboard");
                // Showing ALL CitizenAlerts (Admin Broadcasts + Incidents)
                setMessages(res.data.alerts || []);
            } catch (err) {
                console.error("Failed to load broadcasts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBroadcasts();
    }, []);

    if (loading) return <div className="p-10 text-slate-500 font-mono animate-pulse">Scanning comms...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
            <div className="mb-8 border-b border-slate-800 pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                    System Broadcasts
                </h1>
                <p className="text-slate-400 text-sm">
                    Live feed of all system alerts, citizen reports, and administrative directives.
                </p>
            </div>

            <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                        No alerts available.
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6 shadow-lg border-l-4 border-l-blue-500"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                {msg.type || "SYSTEM BROADCAST"}
                            </span>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${msg.severity === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-slate-800 text-slate-400 border-slate-700"
                                }`}>
                                {msg.severity || "NORMAL"}
                            </span>
                        </div>

                        <h4 className="text-lg font-medium text-white mb-2">
                            {msg.title || "Alert"}
                        </h4>

                        <p className="text-slate-300 leading-relaxed text-sm">
                            {msg.message}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center text-xs font-mono text-slate-500">
                            <span>Target: {msg.region || "All Units"}</span>
                            <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
