import {useState,useEffect} from 'react';import {useNavigate} from 'react-router-dom';import {Play,Pause,RotateCcw,LogOut} from 'lucide-react';
import useTypingGame from '../hooks/useTypingGame.js';import {loadRaces,saveRace} from '../utils/storage.js';import {randomPassage} from '../utils/passages.js';
import {ghostAt,wrap,fmt} from '../utils/typing.js';import RaceTrack from '../components/RaceTrack.jsx';import {Metric} from '../components/Bits.jsx';
export default function Race(){const nav=useNavigate();
const [ghost]=useState(()=>loadRaces()[0]||null);const [text]=useState(()=>ghost?.text||randomPassage());
const g=useTypingGame(text);const [count,setCount]=useState(null);
useEffect(()=>{if(count===null)return;const t=setTimeout(()=>{if(count===0){setCount(null);g.start()}else setCount(count-1)},count===0?600:800);return()=>clearTimeout(t)},[count]);
useEffect(()=>{if(g.status==='done'&&g.result){saveRace({id:crypto.randomUUID(),createdAt:new Date().toISOString(),text,...g.result});nav('/result')}},[g.status]);
const gp=ghost?ghostAt(ghost.timeline,g.ms/1000):0;const d=g.progress-gp;
const msg=!ghost?'FIRST RUN':d>1?"YOU'RE AHEAD":d<-1?'GHOST IS AHEAD':'NECK AND NECK';const mc=d>=0||!ghost?'#4ADE80':'#C4B5FD';
let off=0;const lines=wrap(text).map(l=>{const s=off;off+=l.length;return[l,s]});
if(g.status==='idle'&&count===null)return(<div className="panel mx-auto max-w-md text-center"><div className="lbl mb-2">{ghost?'GHOST DETECTED':'FIRST RUN'}</div>
<p className="mb-5 text-[#94A3B8]">{ghost?'Your previous performance is ready.':'There is no ghost yet. Complete this race to create your first opponent.'}</p><button className="btn g" onClick={()=>setCount(3)}><Play size={16}/>START</button></div>);
return(<div className="space-y-4"><div className="panel flex flex-wrap justify-between gap-4"><Metric label="WPM" value={g.wpm} color="#4ADE80"/><Metric label="ACCURACY" value={g.accuracy+'%'}/><Metric label="TIME" value={fmt(g.ms/1000)}/><Metric label="PROGRESS" value={Math.round(g.progress)+'%'}/></div>
<RaceTrack you={g.progress} ghost={gp}/><div className="flex items-center justify-between"><span className="lbl" style={{color:mc}}>{msg}</span>
<button className="btn" onClick={g.pause} disabled={g.status!=='running'}><Pause size={14}/>PAUSE</button></div>
<div className="panel mono text-base leading-8 sm:text-lg" aria-label="Typing area">{lines.map(([l,s],n)=><div key={s} className="flex"><span className="mr-4 w-6 select-none text-[#64748B]">{String(n+1).padStart(2,'0')}</span><span className="whitespace-pre">{[...l].map((ch,i)=>{const k=s+i,t=g.typed[k];
const c=k===g.typed.length?'bg-[#4ADE80]/30 text-[#F8FAFC] border-b-2 border-[#4ADE80]':t===undefined?'text-[#64748B]':t===ch?'text-[#4ADE80]':'bg-red-500/30 text-red-300 underline';return<span key={k} className={c}>{ch}</span>})}</span></div>)}</div>
{count!==null&&<div className="fixed inset-0 z-10 grid place-items-center bg-[#080B0F]/90"><div key={count} className="fade mono text-6xl font-bold" style={{color:count===0?'#4ADE80':'#C4B5FD'}}>{count===0?'TYPE':count}</div></div>}
{g.status==='paused'&&<div className="fixed inset-0 z-10 grid place-items-center bg-[#080B0F]/90"><div className="panel text-center"><div className="lbl mb-4">RACE PAUSED</div><div className="flex flex-wrap gap-2"><button className="btn g" onClick={g.resume}><Play size={14}/>Resume</button>
<button className="btn" onClick={()=>{g.reset();setCount(3)}}><RotateCcw size={14}/>Restart</button><button className="btn" onClick={()=>nav('/')}><LogOut size={14}/>Exit</button></div></div></div>}</div>)}
