import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ghost as GhostIcon, Trophy, Zap } from "lucide-react";
import Ghost from "../components/Ghost";
import { api } from "../utils/api";

export default function GhostRoom() {
  const [g, setG] = useState(null);
  const [past, setPast] = useState([]);

  useEffect(() => {
    api.ghost().then(setG).catch(() => setG(null));
    api.ghostPast().then(setPast).catch(() => setPast([]));
  }, []);

  return (
    <div className="ghost-room">
      <div className="room-copy">
        <span className="eyebrow">THE GHOST ROOM</span>
        <h1>
          YOUR FASTEST<br />
          <em>SELF IS WAITING.</em>
        </h1>

        <p>
          Every completed trace becomes a version of you that can be challenged.
          Pick a past run, enter the terminal, and try to erase its record.
        </p>

        {g?.id ? (
          <div className="ghost-record">
            <span>DEFAULT GHOST // {g.ghost_name}</span>
            <strong>{Math.round(g.best_wpm)} WPM</strong>
            <small>{Math.round(g.score || 0)} SCORE // {g.best_accuracy?.toFixed(1)}% ACC</small>
          </div>
        ) : (
          <div className="ghost-record">
            <span>NO GHOST DETECTED</span>
            <strong>CREATE YOUR FIRST TRACE</strong>
          </div>
        )}

        <Link className="btn primary" to={g?.id ? `/test?ghost=${g.id}` : "/test"}>
          <GhostIcon size={15} />
          {g?.id ? "CHALLENGE FASTEST SELF" : "CREATE FIRST TRACE"}
        </Link>
      </div>

      <div className="room-visual">
        <Ghost large visible />
        <motion.div
          className="ghost-readout"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {g?.id ? `GHOST // ${Math.round(g.best_wpm)} WPM` : "AWAITING FIRST TRACE"}
        </motion.div>
      </div>

      <section className="ghost-archive">
        <div className="ghost-archive-head">
          <span className="eyebrow">PERSONAL GHOST ARCHIVE</span>
          <span className="system">{past.length} TRACE{past.length === 1 ? "" : "S"}</span>
        </div>

        {!past.length ? (
          <div className="empty compact">
            YOUR PAST SELF DOES NOT EXIST YET.
            <small>Complete a trace to create your first ghost.</small>
          </div>
        ) : (
          <div className="ghost-list">
            {past.slice(0, 12).map((x) => (
              <motion.div
                className="ghost-card"
                key={x.id}
                whileHover={{ x: 4 }}
              >
                <div className="ghost-card-index">
                  <GhostIcon size={15} />
                  <span>TRACE {String(x.id).padStart(3, "0")}</span>
                </div>
                <div>
                  <strong>{Math.round(x.wpm)} WPM</strong>
                  <small>{Math.round(x.score)} SCORE</small>
                </div>
                <div>
                  <span>{Number(x.accuracy).toFixed(1)}% ACC</span>
                  <small>{new Date(x.created_at).toLocaleDateString()}</small>
                </div>
                <Link className="btn" to={`/test?ghost=${x.id}`}>
                  <Zap size={13} /> CHALLENGE
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
