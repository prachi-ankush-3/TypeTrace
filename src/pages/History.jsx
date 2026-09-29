import {History as H} from 'lucide-react';import {loadRaces} from '../utils/storage.js';import {Empty} from '../components/Bits.jsx';
export default function History(){const all=loadRaces();
if(!all.length)return<Empty icon={H} title="NO RACES YET" text="Your first race will appear here." to="/race" cta="START FIRST RACE"/>;
return(<div><h1 className="lbl mb-4">RACE HISTORY</h1><ol className="border-l border-white/10 pl-5">{all.map((r,i)=>{const p=all[i+1],d=p?r.wpm-p.wpm:null;
return(<li key={r.id} className="panel relative mb-3"><span className="absolute -left-[26px] top-5 h-2 w-2 rounded-full" style={{background:d!==null&&d<0?'#A78BFA':'#4ADE80'}}/>
<div className="mono flex flex-wrap items-baseline gap-x-5 gap-y-1"><span className="text-[#64748B]">#{String(all.length-i).padStart(2,'0')}</span><b className="text-[#4ADE80]">{r.wpm} WPM</b><span>{r.accuracy}% Accuracy</span><span>{r.duration}s</span>
{d!==null&&<span style={{color:d>=0?'#4ADE80':'#C4B5FD'}}>{d>=0?'+':''}{d} WPM</span>}</div><div className="lbl mt-1">{new Date(r.createdAt).toLocaleString()}</div></li>)})}</ol></div>)}
