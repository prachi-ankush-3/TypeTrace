import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Check, Ghost as GhostIcon, Zap } from "lucide-react";
import { api } from "../utils/api";

const chapters = [
  ["I", "THE FIRST TRACE", "Complete your first test", (s) => s.total_tests >= 1],
  ["II", "THE HALLWAY", "Complete 5 tests", (s) => s.total_tests >= 5],
  ["III", "THE OBSERVER", "Reach 60 WPM", (s) => s.best_wpm >= 60],
  ["IV", "THE ARCHIVE", "Reach 75 WPM", (s) => s.best_wpm >= 75],
  ["V", "THE FINAL GHOST", "Beat your past self 3 times", (s) => s.ghostWins >= 3],
];

export default function Adventure() {
  const [stats, setStats] = useState(null);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    Promise.all([api.stats(), api.tests()])
      .then(([s, t]) => {
        setTests(t);
        setStats({
          ...s,
          ghostWins: t.filter((x) => x.ghost_won).length,
        });
      })
      .catch(() => {});
  }, []);

  const xp = useMemo(() => {
    if (!stats) return 0;
    return (
      stats.total_tests * 100 +
      stats.ghostWins * 250 +
      Math.floor(stats.best_wpm || 0) * 2
    );
  }, [stats]);

  const level = Math.floor(xp / 1000) + 1;
  const levelProgress = xp % 1000;

  return (
    <div className="page adventure">
      <span className="eyebrow">ARCHIVE MAP // PROGRESSION</span>
      <h1>THE CHAPTERS</h1>

      <div className="progress-panel">
        <div>
          <span>TRACE LEVEL</span>
          <strong>{String(level).padStart(2, "0")}</strong>
        </div>
        <div className="xp-bar">
          <i style={{ width: `${levelProgress / 10}%` }} />
        </div>
        <div>
          <span>{levelProgress} / 1000 XP</span>
        </div>
      </div>

      <div className="map">
        {chapters.map((chapter, i) => {
          const unlocked = Boolean(stats && chapter[3](stats));

          return (
            <motion.article
              key={chapter[0]}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`chapter ${unlocked ? "unlocked" : "locked"}`}
            >
              <b>{unlocked ? <Check size={16} /> : <Lock size={14} />}</b>
              <div>
                <span>CHAPTER {chapter[0]}</span>
                <h2>{chapter[1]}</h2>
                <p>{chapter[2]}</p>
              </div>
              <strong>{unlocked ? "UNLOCKED" : "LOCKED"}</strong>
            </motion.article>
          );
        })}
      </div>

      <div className="adventure-stats">
        <div><Zap size={15} /><span>BEST SPEED</span><strong>{Math.round(stats?.best_wpm || 0)} WPM</strong></div>
        <div><GhostIcon size={15} /><span>GHOSTS DEFEATED</span><strong>{stats?.ghostWins || 0}</strong></div>
        <div><Check size={15} /><span>TRACES STORED</span><strong>{stats?.total_tests || 0}</strong></div>
      </div>

      {tests.length > 0 && (
        <p className="hint">
          Your archive grows with every trace. Every improvement changes the next chapter.
        </p>
      )}
    </div>
  );
}
