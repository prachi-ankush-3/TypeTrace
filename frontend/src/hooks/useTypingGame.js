import { useCallback, useEffect, useRef, useState } from "react";

export default function useTypingGame(text, duration = 30) {
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(null);

  const startRef = useRef(0);
  const typedRef = useRef("");
  const wrongRef = useRef(0);
  const keysRef = useRef(0);
  const timelineRef = useRef([]);
  const finishedRef = useRef(false);

  const start = useCallback(() => {
    startRef.current = performance.now();
    typedRef.current = "";
    wrongRef.current = 0;
    keysRef.current = 0;
    timelineRef.current = [];
    finishedRef.current = false;

    setTyped("");
    setElapsed(0);
    setResult(null);
    setStatus("running");
  }, []);

  const reset = useCallback(() => {
    finishedRef.current = false;
    typedRef.current = "";
    wrongRef.current = 0;
    keysRef.current = 0;
    timelineRef.current = [];
    startRef.current = 0;

    setStatus("idle");
    setTyped("");
    setElapsed(0);
    setResult(null);
  }, []);

  const finish = useCallback((seconds) => {
    if (finishedRef.current) return;

    finishedRef.current = true;

    const currentTyped = typedRef.current;
    const correct = [...currentTyped].filter(
      (char, index) => char === text[index]
    ).length;

    const total = keysRef.current;
    const accuracy = total ? (correct / total) * 100 : 100;
    const wpm = correct / 5 / (Math.max(seconds, 0.5) / 60);
    const score = Math.round(wpm * (accuracy / 100) * Math.max(1, duration) * 10);

    const finalResult = {
      wpm,
      accuracy,
      correct_chars: correct,
      incorrect_chars: wrongRef.current,
      errors: wrongRef.current,
      total_chars: total,
      time_taken: seconds,
      duration,
      score,
      timeline: timelineRef.current,
    };

    setResult(finalResult);
    setStatus("done");
  }, [text, duration]);

  useEffect(() => {
    if (status !== "running") return;

    const id = setInterval(() => {
      const seconds = (performance.now() - startRef.current) / 1000;
      setElapsed(seconds);

      if (seconds >= duration) {
        finish(duration);
      }
    }, 50);

    return () => clearInterval(id);
  }, [status, duration, finish]);

  useEffect(() => {
    const handleKey = (event) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key === "Tab" ||
        event.key === "Escape"
      ) {
        return;
      }

      if (event.key !== "Backspace" && event.key.length !== 1) return;

      event.preventDefault();

      if (status === "idle") {
        start();

        if (event.key.length === 1) {
          const ok = event.key === text[0];

          typedRef.current = event.key;
          keysRef.current = 1;

          if (!ok) wrongRef.current = 1;

          timelineRef.current.push({
            time: 0,
            progress: 1 / Math.max(text.length, 1),
          });

          setTyped(event.key);
        }

        return;
      }

      if (status !== "running") return;

      if (event.key === "Backspace") {
        typedRef.current = typedRef.current.slice(0, -1);
        setTyped(typedRef.current);
        return;
      }

      const index = typedRef.current.length;
      if (index >= text.length) return;

      const ok = event.key === text[index];

      keysRef.current += 1;
      if (!ok) wrongRef.current += 1;

      typedRef.current += event.key;

      timelineRef.current.push({
        time: (performance.now() - startRef.current) / 1000,
        progress: typedRef.current.length / Math.max(text.length, 1),
      });

      setTyped(typedRef.current);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, text, start]);

  const correct = [...typed].filter(
    (char, index) => char === text[index]
  ).length;

  const total = keysRef.current;
  const accuracy = total ? (correct / total) * 100 : 100;
  const wpm = correct / 5 / (Math.max(elapsed, 0.5) / 60);
  const score = Math.round(wpm * (accuracy / 100) * Math.max(1, duration) * 10);

  return {
    typed,
    status,
    elapsed,
    remaining: Math.max(0, duration - elapsed),
    progress: text.length ? (typed.length / text.length) * 100 : 0,
    wpm,
    accuracy,
    errors: wrongRef.current,
    score,
    result,
    start,
    reset,
    finish,
  };
}
