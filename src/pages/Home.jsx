import {Link} from 'react-router-dom';import {ArrowRight,Ghost} from 'lucide-react';import {loadRaces} from '../utils/storage.js';import {Metric,Bar} from '../components/Bits.jsx';
export default function Home(){const last=loadRaces()[0];
return(<div className="grid gap-8 md:grid-cols-2 md:items-center"><div><div className="lbl mb-3">TYPE_TRACE.EXE</div>
<h1 className="mono text-4xl font-bold tracking-widest sm:text-5xl">TYPE TRACE</h1><p className="mt-2 text-2xl text-[#4ADE80]">Race Against Your Past.<span className="cur">_</span></p>
<p className="mt-4 text-[#94A3B8]">{last?'Your previous typing performance becomes your opponent. Improve your speed. Beat your rhythm. Rewrite your record.':'Your first race creates your first ghost.'}</p>
<div className="mt-6 flex flex-wrap gap-3"><Link to="/race" className="btn g">START RACE <ArrowRight size={16}/></Link><Link to="/history" className="btn">VIEW HISTORY</Link></div></div>
<div className="space-y-4"><div className="panel">{last?<><div className="lbl mb-3">LAST PERFORMANCE</div><div className="flex gap-8"><Metric label="WPM" value={last.wpm} color="#4ADE80"/><Metric label="ACCURACY" value={last.accuracy+'%'}/><Metric label="TIME" value={last.duration+'s'}/></div>
<div className="lbl mt-4 text-[#C4B5FD]"><Ghost size={12} className="mr-1 inline"/>PAST YOU · ● Ghost ready</div></>:<><div className="lbl mb-2">NO GHOST DATA</div><p className="text-sm text-[#94A3B8]">Complete your first race to create your first opponent.</p></>}</div>
<div className="panel"><Bar label="YOU" value={15} max={19}/><Bar label="PAST YOU" value={11} max={19} ghost/><p className="lbl">Your next opponent is yourself.</p></div></div></div>)}
