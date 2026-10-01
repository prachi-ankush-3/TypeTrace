import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";

export default function Profile() {
  const [p, setP] = useState(null);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    api.profile().then(setP).catch(() => {});
    api.ghostRaces()
      .then((rows) => setWins(rows.filter((x) => x.won).length))
      .catch(() => {});
  }, []);

  const rows = [
    ["USERNAME", p?.username || "LOADING..."],
    ["EMAIL", p?.email || "LOADING..."],
    ["STATUS", "ACTIVE"],
    ["BEST SPEED", p ? `${Math.round(p.best_wpm || 0)} WPM` : "LOADING..."],
    ["CURRENT STREAK", p ? `${p.current_streak || 0} NIGHTS` : "LOADING..."],
    ["GHOSTS DEFEATED", `${wins}`],
  ];

  return (
    <div className="page profile">
      <span className="eyebrow">CLASSIFIED PERSONNEL RECORD</span>
      <h1>TRACE SUBJECT</h1>

      <div className="classified">
        {rows.map(([key, value]) => (
          <div key={key}>
            <span>{key}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <Link className="btn" to="/settings">
        EDIT RECORD
      </Link>
    </div>
  );
}
