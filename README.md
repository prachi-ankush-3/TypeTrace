# TypeTrace
Race Against Your Past.

A typing game where your previous race replays as a ghost opponent, following your real per-keystroke timeline (speed, pauses, rhythm). React + Vite + Tailwind v4 + React Router + Lucide. No backend; everything is stored in LocalStorage.

## Run
```
npm install
npm run dev
```
## Ghost system
Each race records `{time, progress}` on every keystroke. The next race replays the latest race's text and interpolates that timeline against elapsed time (pausing stops both).
