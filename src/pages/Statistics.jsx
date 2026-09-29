import {Lock} from 'lucide-react';import {loadRaces} from '../utils/storage.js';import {Empty,Metric} from '../components/Bits.jsx';
export default function Statistics(){const all=loadRaces().slice().reverse();
if(!all.length)return<Empty icon={Lock} title="STATISTICS LOCKED" text="Complete your first race to start tracking performance." to="/race" cta="START RACE"/>;
const w=all.map(r=>r.wpm),max=Math.max(...w,1)*1.1,min=Math.min(...w)*0.9;const X=i=>20+(all.length<2?280:i*(560/(all.length-1))),Y=v=>170-(v-min)/(max-min||1)*150;
return(<div className="space-y-4"><h1 className="lbl">YOUR PERFORMANCE</h1><div className="panel grid grid-cols-2 gap-4 sm:grid-cols-4"><Metric label="BEST WPM" value={Math.max(...w)} color="#4ADE80"/><Metric label="AVERAGE WPM" value={Math.round(w.reduce((a,b)=>a+b,0)/w.length)}/><Metric label="BEST ACCURACY" value={Math.max(...all.map(r=>r.accuracy))+'%'}/><Metric label="TOTAL RACES" value={all.length} color="#C4B5FD"/></div>
<div className="panel"><div className="lbl mb-2">WPM PROGRESSION</div><svg viewBox="0 0 600 190" className="w-full" role="img" aria-label="WPM per race"><polyline fill="none" stroke="#4ADE80" strokeWidth="2" points={all.map((r,i)=>`${X(i)},${Y(r.wpm)}`).join(' ')}/>
{all.map((r,i)=><circle key={r.id} cx={X(i)} cy={Y(r.wpm)} r="4" fill="#4ADE80"/>)}</svg></div></div>)}
