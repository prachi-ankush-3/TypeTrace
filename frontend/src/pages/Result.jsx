import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw, Trophy, Ghost as GhostIcon } from "lucide-react";
import { motion } from "framer-motion";
import Metric from "../components/Metric";

function Celebration() {
  return (
    <div className="celebration" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.i
          key={i}
          initial={{ opacity: 0, y: 20, x: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, -60 - (i % 5) * 25, -150],
            x: [(i % 2 ? -1 : 1) * 10, (i % 2 ? -1 : 1) * (35 + i * 4)],
            scale: [0, 1, 0.7],
            rotate: [0, 180 + i * 10],
          }}
          transition={{ duration: 1.7 + (i % 4) * 0.15, delay: i * 0.035 }}
        />
      ))}
    </div>
  );
}

export default function Result() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      setData(JSON.parse(sessionStorage.getItem("tt_last")));
    } catch {
      setData(null);
    }
  }, []);

  if (!data) {
    return (
      <div className="empty">
        THE ARCHIVE IS EMPTY.
        <Link to="/test">START A TRACE</Link>
      </div>
    );
  }

  const ghost = data.ghost;
  const won = Boolean(ghost?.won);
  const isRecord = !ghost || won || ghost?.score_delta > 0;

  return (
    <div className="result">
      {won && <Celebration />}

      <span className="eyebrow">
        TRACE COMPLETE // REPORT GENERATED
      </span>

      <h1>
        {won ? (
          <>
            GHOST<br /><em>DEFEATED</em>
          </>
        ) : (
          <>
            TRACE<br /><em>COMPLETE</em>
          </>
        )}
      </h1>

      <div className="result-main">
        <div className="big-score">
          {Math.round(data.wpm)}
          <small>WPM</small>
        </div>
        <Metric label="ACCURACY" value={`${data.accuracy.toFixed(1)}%`} />
        <Metric label="ERRORS" value={data.errors} />
        <Metric label="SCORE" value={Math.round(data.score || 0)} />
        <Metric label="TIME" value={`${data.time_taken.toFixed(1)}s`} />
      </div>

      {ghost && (
        <motion.div
          className={`ghost-battle ${won ? "won" : "lost"}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <span><GhostIcon size={13} /> PAST SELF</span>
            <strong>{Math.round(ghost.wpm)} WPM</strong>
            <small>{Math.round(ghost.score)} SCORE</small>
          </div>

          <div className="battle-arrow">
            {won ? "YOU WON" : "TRY AGAIN"}
          </div>

          <div>
            <span><Trophy size={13} /> CURRENT RUN</span>
            <strong>{Math.round(data.wpm)} WPM</strong>
            <small>{Math.round(data.score || 0)} SCORE</small>
          </div>
        </motion.div>
      )}

      <div className="report">
        <span>
          {isRecord ? "PERSONAL PROGRESS" : "TRACE STATUS"}
        </span>
        <strong>
          {won
            ? `GHOST BEATEN // +${Math.round(ghost.score_delta)} SCORE`
            : isRecord
              ? "NEW PERFORMANCE RECORDED"
              : "TRACE RECORDED"}
        </strong>
      </div>

      <div className="actions">
        <Link className="btn primary" to="/test">
          <RotateCcw size={15} /> RUN AGAIN
        </Link>
        {ghost && (
          <Link className="btn" to={`/test?ghost=${ghost.id}`}>
            <GhostIcon size={15} /> CHALLENGE AGAIN
          </Link>
        )}
        <Link className="btn" to="/history">
          VIEW ARCHIVE <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
