export const Lane=({label,pct,ghost})=>{const c=ghost?'#A78BFA':'#4ADE80';
return(<div className={ghost?'opacity-80':''}><div className="lbl mb-1" style={{color:c}}>{label}</div>
<div className="relative h-2 bg-white/5"><div className="h-full transition-[width] duration-100" style={{width:`${Math.min(pct,100)}%`,background:c,boxShadow:`0 0 12px ${c}66`}}/>
<div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full" style={{left:`${Math.min(pct,100)}%`,background:c,boxShadow:`0 0 10px ${c}`}}/></div></div>)};
export default function RaceTrack({you,ghost}){return(<div className="panel space-y-5"><Lane label="YOU" pct={you}/><Lane label="PAST YOU" pct={ghost} ghost/></div>)}
