export const ghostAt=(tl,sec)=>{if(!tl?.length)return 0;if(sec<=tl[0].time)return tl[0].progress;
for(let i=1;i<tl.length;i++){const a=tl[i-1],b=tl[i];if(sec<=b.time){const s=b.time-a.time||1;return a.progress+(b.progress-a.progress)*(sec-a.time)/s}}return tl[tl.length-1].progress};
export const wrap=(t,n=42)=>{const out=[];let cur='';t.split(/(?<= )/).forEach(w=>{if((cur+w).length>n&&cur){out.push(cur);cur=''}cur+=w});out.push(cur);return out};
export const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
