import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ghost as GhostIcon, Trophy } from "lucide-react";
import { api } from "../utils/api";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.tests().then(setData).catch(() => setData([]));
  }, []);

  return (
    <div className="page">
      <span className="eyebrow">ARCHIVE // COMPLETED TRACES</span>
      <h1>THE ARCHIVE</h1>
      <p className="lead">
        Every run is stored to your personal account. Your past performances
        become the ghosts you can challenge.
      </p>

      {!data.length ? (
        <div className="empty">
          THE ARCHIVE IS EMPTY.
          <small>No traces have been recorded yet.</small>
          <Link to="/test">CREATE FIRST TRACE</Link>
        </div>
      ) : (
        <div className="archive">
          {data.map((x, i) => (
            <div className="archive-row" key={x.id || i}>
              <span>TRACE {String(x.id).padStart(3, "0")}</span>
              <span>{new Date(x.created_at).toLocaleDateString()}</span>
              <span>{x.duration} SEC</span>
              <strong>{Math.round(x.wpm)} WPM</strong>
              <span>{Number(x.accuracy).toFixed(1)}%</span>
              <strong>{Math.round(x.score || 0)} SCORE</strong>
              <span className={x.ghost_won ? "archive-win" : ""}>
                {x.ghost_won ? (
                  <>
                    <Trophy size={11} /> GHOST BEATEN
                  </>
                ) : (
                  "RECORDED"
                )}
              </span>
              <Link className="archive-challenge" to={`/test?ghost=${x.id}`}>
                <GhostIcon size={12} /> CHALLENGE
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
