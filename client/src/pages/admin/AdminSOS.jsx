import { useEffect, useState } from "react";
import api from "../../api";
import {
  normalizeSOS,
  formatDate,
  formatNumber,
} from "../../utils/normalizeAdminData";

export default function AdminSOS() {
  const [sosList, setSosList] = useState([]);
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [activeTab, setActiveTab] = useState("PENDING");

  // ---------------- FETCH SOS ----------------
  const fetchSOS = async () => {
    try {
      const res = await api.get("/sos/all");
      const normalized = (res.data || []).map(normalizeSOS);
      setSosList(normalized);
    } catch (err) {
      console.error("Failed to fetch SOS:", err);
      setSosList([]);
    }
  };

  useEffect(() => {
    fetchSOS();
    const interval = setInterval(fetchSOS, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- FILTERED LISTS ----------------
  const pendingSOS = sosList.filter((s) => s.status === "PENDING");

  const resolvedSOS = sosList.filter(
    (s) => s.status === "COMPLETED" || s.status === "FALSE_ALARM"
  );

  const visibleSOS =
    activeTab === "PENDING" ? pendingSOS : resolvedSOS;

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (newStatus) => {
    try {
      const backendStatus =
        newStatus === "COMPLETED"
          ? "ACKNOWLEDGED"
          : newStatus === "FALSE_ALARM"
          ? "CONVERTED"
          : "PENDING";

      const res = await api.put(
        `/sos/${selectedSOS._id}/status`,
        { status: backendStatus }
      );

      const normalized = normalizeSOS(res.data);

      setSosList((prev) =>
        prev.map((s) => (s._id === normalized._id ? normalized : s))
      );

      setSelectedSOS(null);
    } catch (err) {
      console.error("Failed to update SOS:", err);
      alert("Action failed");
    }
  };

  // ---------------- COPY COORDINATES ----------------
  const copyCoordinates = () => {
    const { latitude, longitude } = selectedSOS;

    if (
      latitude === null ||
      longitude === null ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      alert("Coordinates unavailable");
      return;
    }

    navigator.clipboard.writeText(
      `${formatNumber(latitude, 6)}, ${formatNumber(longitude, 6)}`
    );
    alert("Coordinates copied!");
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          SOS Control Panel
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </h2>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-6 py-3 rounded-xl font-bold transition ${
            activeTab === "PENDING"
              ? "bg-red-600 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          Pending SOS ({pendingSOS.length})
        </button>

        <button
          onClick={() => setActiveTab("RESOLVED")}
          className={`px-6 py-3 rounded-xl font-bold transition ${
            activeTab === "RESOLVED"
              ? "bg-emerald-600 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          Completed / False ({resolvedSOS.length})
        </button>
      </div>

      {/* LIST CONTAINER */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-6 space-y-4">
          {visibleSOS.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-2xl mb-2">
                {activeTab === "PENDING"
                  ? "All Clear"
                  : "No History Yet"}
              </p>
              <p>
                {activeTab === "PENDING"
                  ? "No active SOS alerts"
                  : "Resolved alerts will appear here"}
              </p>
            </div>
          ) : (
            visibleSOS.map((sos) => {
              const hasCoords =
                sos.latitude !== null &&
                sos.longitude !== null &&
                !isNaN(sos.latitude) &&
                !isNaN(sos.longitude);

              return (
                <div
                  key={sos._id}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xl font-mono text-white">
                        {hasCoords
                          ? `${formatNumber(
                              sos.latitude,
                              6
                            )}, ${formatNumber(sos.longitude, 6)}`
                          : "📍 Location unavailable"}
                      </p>

                      <p className="text-sm text-slate-400 mt-2">
                        Received:{" "}
                        {formatDate(
                          sos.timestamp,
                          "Time unavailable"
                        )}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                        sos.status === "PENDING"
                          ? "bg-red-600 animate-pulse"
                          : sos.status === "COMPLETED"
                          ? "bg-emerald-600"
                          : "bg-slate-600"
                      }`}
                    >
                      {sos.status}
                    </span>
                  </div>

                  {sos.status === "PENDING" ? (
                    <button
                      onClick={() => setSelectedSOS(sos)}
                      className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white py-4 rounded-lg font-bold"
                    >
                      ACKNOWLEDGE SOS
                    </button>
                  ) : (
                    <div className="text-center text-slate-500 mt-4">
                      Action completed
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedSOS && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedSOS(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl p-10 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              SOS Acknowledgement
            </h3>

            <div className="bg-black/40 rounded-xl p-5 mb-6 font-mono text-lg text-center">
              {selectedSOS.latitude && selectedSOS.longitude
                ? `${formatNumber(
                    selectedSOS.latitude,
                    6
                  )}, ${formatNumber(selectedSOS.longitude, 6)}`
                : "Location unavailable"}
            </div>

            <p className="text-sm text-slate-400 mb-6 text-center">
              Received:{" "}
              {formatDate(
                selectedSOS.timestamp,
                "Time unavailable"
              )}
            </p>

            <div className="space-y-4">
              <button
                onClick={copyCoordinates}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
              >
                Copy Coordinates
              </button>

              <button
                onClick={() => updateStatus("COMPLETED")}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold"
              >
                Mark as Resolved
              </button>

              <button
                onClick={() => updateStatus("FALSE_ALARM")}
                className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold"
              >
                Mark as False Alarm
              </button>
            </div>

            <button
              onClick={() => setSelectedSOS(null)}
              className="mt-6 text-sm text-slate-400 hover:text-white w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
