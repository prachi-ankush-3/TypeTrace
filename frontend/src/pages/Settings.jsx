import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Settings() {
  const [fx, setFx] = useState(true);
  const [sound, setSound] = useState(false);
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem("tt_token");
    sessionStorage.removeItem("tt_last");
    nav("/login");
  }

  return (
    <div className="page">
      <span className="eyebrow">SYSTEM // CONFIGURATION</span>
      <h1>SETTINGS</h1>

      <div className="settings">
        <label>
          <span>ATMOSPHERIC EFFECTS</span>
          <input
            type="checkbox"
            checked={fx}
            onChange={(e) => setFx(e.target.checked)}
          />
        </label>

        <label>
          <span>SOUND EFFECTS</span>
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />
        </label>

        <label>
          <span>REDUCED MOTION</span>
          <input
            type="checkbox"
            onChange={(e) =>
              document.documentElement.classList.toggle(
                "reduced",
                e.target.checked
              )
            }
          />
        </label>
      </div>

      <p className="hint">
        Typing input always keeps the highest performance priority.
      </p>

      <button className="btn" onClick={logout}>
        <LogOut size={14} /> DISCONNECT FROM ARCHIVE
      </button>
    </div>
  );
}
