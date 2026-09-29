import {Link,useNavigate} from 'react-router-dom';import {Trophy,Keyboard} from 'lucide-react';import {loadRaces} from '../utils/storage.js';import {Empty,Metric,Bar} from '../components/Bits.jsx';
export default function Result(){const nav=useNavigate();const all=loadRaces();const cur=all[0],prev=all[1];
if(!cur)return<Empty icon={Keyboard} title="NO RESULT" text="Finish a race to see results." to="/race" cta="START RACE"/>;
const dw=prev?cur.wpm-prev.wpm:0;const pb=prev&&cur.wpm>Math.max(...all.slice(1).map(r=>r.wpm));const max=Math.max(cur.wpm,prev?.wpm||0);
return(<div className="mx-auto max-w-2xl space-y-4"><div className="panel"><div className="lbl mb-3">RACE COMPLETE</div><div className="flex flex-wrap justify-between gap-4"><Metric label="WPM" value={cur.wpm} color="#4ADE80"/><Metric label="ACCURACY" value={cur.accuracy+'%'}/><Metric label="TIME" value={cur.duration+'s'}/><Metric label="ERRORS" value={cur.errors}/></div></div>
{pb&&<div className="panel border-[#4ADE80]/40 text-[#4ADE80]"><Trophy size={16} className="mr-2 inline"/>NEW PERSONAL BEST</div>}
{prev?<div className="panel"><div className="lbl mb-3">PERFORMANCE COMPARISON</div><Bar label="YOU" value={cur.wpm} max={max} unit="WPM"/><Bar label="PAST YOU" value={prev.wpm} max={max} unit="WPM" ghost/>
<div className="mono mt-3 text-2xl" style={{color:dw>=0?'#4ADE80':'#C4B5FD'}}>{dw>0?'+':''}{dw} WPM</div><p className="text-sm text-[#94A3B8]">{dw>0?'Your past self is getting nervous.':dw===0?'A perfect tie.':'Your ghost still has the lead. Try again.'}</p>
<div className="mono mt-3 grid grid-cols-3 gap-2 text-xs text-[#CBD5E1]"><span>Speed {dw>=0?'+':''}{dw}</span><span>Accuracy {cur.accuracy-prev.accuracy>=0?'+':''}{cur.accuracy-prev.accuracy}%</span><span>Time {(cur.duration-prev.duration).toFixed(1)}s</span></div></div>
:<div className="panel"><div className="lbl mb-1 text-[#C4B5FD]">GHOST CREATED</div><p className="text-sm text-[#94A3B8]">Your past self is ready.</p></div>}
<div className="flex flex-wrap gap-3"><button className="btn g" onClick={()=>nav('/race')}>RACE AGAIN →</button><Link className="btn" to="/history">VIEW HISTORY</Link><Link className="btn" to="/">HOME</Link></div></div>)}
