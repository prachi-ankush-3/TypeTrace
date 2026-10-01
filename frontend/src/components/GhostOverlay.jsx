import Ghost from"./Ghost";export default function GhostOverlay({show=true,label}){return <div className="ghost-wrap"><Ghost visible={show} large/><span>{label}</span></div>}
