import { useEffect, useRef, useState } from "react";
import { RotateCcw, Settings2, Trophy, Ghost as GhostIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import useTypingGame from "../hooks/useTypingGame";
import TypingText from "../components/TypingText";
import Metric from "../components/Metric";
import GhostOverlay from "../components/GhostOverlay";
import RaceTrack from "../components/RaceTrack";
import { randomPassage } from "../utils/passages";
import { api } from "../utils/api";

const durations = [15, 30, 60];

function buildTrace() {
  const chunks = [];
  for (let i = 0; i < 4; i += 1) {
    chunks.push(randomPassage(chunks[chunks.length - 1] || ""));
  }
  return chunks.join(" ");
}

export default function Test() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const ghostId = searchParams.get("ghost");
  const [duration, setDuration] = useState(30);
  const [text, setText] = useState(() => buildTrace());
  const [ghost, setGhost] = useState(null);
  const [loadingGhost, setLoadingGhost] = useState(true);
  const savedRef = useRef(false);
  const game = useTypingGame(text, duration);

  useEffect(() => {
    savedRef.current = false;
    setLoadingGhost(true);

    const load = ghostId
      ? api.ghost(Number(ghostId))
      : api.ghost();

    load.then((data) => {
      if (data?.id) setGhost(data);
      else setGhost(null);
    }).catch(() => setGhost(null))
      .finally(() => setLoadingGhost(false));
  }, [ghostId]);

  // Keep a deep queue of text so the test never reaches a hard end.
  useEffect(() => {
    if (game.status !== "running") return;

    const remaining = text.length - game.typed.length;
    if (remaining < 500) {
      setText((current) => {
        const additions = [
          randomPassage(current.slice(-180)),
          randomPassage(current.slice(-180)),
        ];
        return `${current} ${additions.join(" ")}`;
      });
    }
  }, [game.status, game.typed.length, text.length]);

  useEffect(() => {
    if (game.status !== "done" || !game.result || savedRef.current) return;

    savedRef.current = true;

    const payload = {
      ...game.result,
      duration,
      paragraph: text,
      ghost_test_id: ghost?.id || null,
    };

    api.saveTest(payload)
      .then((saved) => {
        sessionStorage.setItem(
          "tt_last",
          JSON.stringify({
            ...game.result,
            duration,
            text,
            created_at: new Date().toISOString(),
            ghost: saved.ghost || null,
          })
        );
      })
      .catch(() => {
        sessionStorage.setItem(
          "tt_last",
          JSON.stringify({
            ...game.result,
            duration,
            text,
            created_at: new Date().toISOString(),
            ghost: null,
          })
        );
      })
      .finally(() => nav("/result"));
  }, [game.status, game.result, duration, text, ghost, nav]);

  function reset() {
    setText(buildTrace());
    game.reset();
  }

  function changeDuration(value) {
    setDuration(value);
    setText(buildTrace());
    game.reset();
  }

  const ghostProgress = ghost
    ? Math.min(100, (game.elapsed / Math.max(ghost.time_taken || duration, 1)) * 100)
    : 0;

  const ghostScore = ghost?.score || 0;
  const scoreDelta = ghostScore ? game.score - ghostScore : 0;

  return (
    <div className="test-page">
      <div className="test-top">
        <div>
          <span className="eyebrow">
            {ghost
              ? `GHOST TRACE ${String(ghost.id).padStart(3, "0")} // ACTIVE`
              : "TRACE 07 // ACTIVE"}
          </span>
          <h1>THE TERMINAL</h1>
        </div>

        <div className="duration-tabs">
          {durations.map((d) => (
            <button
              className={d === duration ? "active" : ""}
              onClick={() => changeDuration(d)}
              key={d}
            >
              {d} SEC
            </button>
          ))}
        </div>
      </div>

      <div className="test-stage">
        <GhostOverlay
          show={game.errors >= 4}
          label={game.errors >= 4 ? "THE GHOST NOTICED." : ""}
        />

        <div className="timer">
          {game.remaining.toFixed(1).padStart(4, "0")}
        </div>

        <div className="metrics">
          <Metric label="WPM" value={Math.round(game.wpm)} accent />
          <Metric label="ACC" value={`${game.accuracy.toFixed(1)}%`} />
          <Metric label="ERRORS" value={game.errors} />
          <Metric label="SCORE" value={game.score} />
        </div>

        {ghost && (
          <div className="ghost-challenge-readout">
            <span>
              <GhostIcon size={13} /> CHALLENGING {ghost.ghost_name}
            </span>
            <strong>
              {scoreDelta >= 0 ? "+" : ""}
              {Math.round(scoreDelta)} SCORE
            </strong>
          </div>
        )}

        {!loadingGhost && ghost && (
          <RaceTrack you={game.progress} ghost={ghostProgress} />
        )}

        <motion.div
          className="text-shell"
          animate={{ x: game.errors > 0 ? [-1, 1, 0] : 0 }}
        >
          <TypingText text={text} typed={game.typed} />
        </motion.div>

        <div className="test-controls">
          <button className="btn" onClick={reset}>
            <RotateCcw size={14} /> NEW TRACE
          </button>
          <button className="btn" onClick={() => nav("/settings")}>
            <Settings2 size={14} /> SETTINGS
          </button>
        </div>

        {game.status === "idle" && (
          <div className="start-hint">
            {ghost
              ? "START TYPING TO CHALLENGE YOUR PAST SELF"
              : `START TYPING TO BEGIN // ${duration} SECOND TRACE`}
          </div>
        )}

        {game.status === "running" && ghost && (
          <div className="ghost-target">
            <span>
              PAST SELF // {Math.round(ghost.wpm)} WPM // {Math.round(ghost.score)} SCORE
            </span>
            <span>
              {game.score >= ghost.score ? "YOU ARE AHEAD" : "CATCH THE GHOST"}
            </span>
          </div>
        )}

        {game.status === "done" && ghost && (
          <motion.div
            className={`ghost-finish ${game.score > ghost.score ? "won" : "lost"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Trophy size={15} />
            {game.score > ghost.score ? "GHOST DEFEATED" : "THE GHOST ESCAPED"}
          </motion.div>
        )}
      </div>
    </div>
  );
}
