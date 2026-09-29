import {useState,useRef,useEffect,useCallback} from 'react';
export default function useTypingGame(text){
const [typed,setTyped]=useState('');const [status,setStatus]=useState('idle');const [ms,setMs]=useState(0);const [result,setResult]=useState(null);
const r=useRef({t0:0,acc:0,keys:0,wrong:0,tl:[],typed:''});
const now=()=>r.current.acc+(r.current.t0?performance.now()-r.current.t0:0);
const stats=(t,elapsed)=>{const c=r.current;let ok=0;for(let i=0;i<t.length;i++)if(t[i]===text[i])ok++;
return{correctChars:ok,wpm:Math.round(ok/5/(Math.max(elapsed,.5)/60)),accuracy:c.keys?Math.round((c.keys-c.wrong)/c.keys*100):100,errors:c.wrong,totalChars:c.keys}};
const start=useCallback(()=>{r.current={t0:performance.now(),acc:0,keys:0,wrong:0,tl:[{time:0,progress:0}],typed:''};setTyped('');setMs(0);setResult(null);setStatus('running')},[]);
const reset=useCallback(()=>{r.current.t0=0;setTyped('');setMs(0);setStatus('idle')},[]);
const pause=()=>{r.current.acc=now();r.current.t0=0;setStatus('paused')};
const resume=()=>{r.current.t0=performance.now();setStatus('running')};
useEffect(()=>{if(status!=='running')return;const id=setInterval(()=>setMs(now()),100);return()=>clearInterval(id)},[status]);
useEffect(()=>{if(status!=='running')return;
const onKey=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const c=r.current;let t=c.typed;
if(e.key==='Backspace')t=t.slice(0,-1);
else if(e.key.length===1&&t.length<text.length){c.keys++;if(e.key!==text[t.length])c.wrong++;t+=e.key}else return;
e.preventDefault();c.typed=t;setTyped(t);const sec=now()/1000;
c.tl.push({time:+sec.toFixed(2),progress:+(t.length/text.length*100).toFixed(1)});
if(t.length===text.length){c.acc=now();c.t0=0;setMs(c.acc);
setResult({...stats(t,sec),duration:+sec.toFixed(1),timeline:c.tl});setStatus('done')}};
window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[status,text]);
const sec=ms/1000;const live=stats(typed,sec);
return{typed,status,ms,result,start,reset,pause,resume,progress:typed.length/text.length*100,...live,wpm:sec>1?live.wpm:0}}
