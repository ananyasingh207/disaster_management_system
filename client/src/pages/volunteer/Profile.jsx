import { useEffect, useState } from "react";
import api from "../../api";

export default function Profile() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api.get("/volunteer/me").then((res) => setMe(res.data));
  }, []);

  if (!me) return <p>Loading...</p>;

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Profile</h1>

      <p><strong>Name:</strong> {me.name}</p>
      <p><strong>Phone:</strong> {me.phone}</p>
      <p><strong>Status:</strong> {me.status}</p>

      <h2 className="text-lg font-semibold mt-4">Skills</h2>
      <ul className="list-disc pl-5">
        {me.skills?.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
