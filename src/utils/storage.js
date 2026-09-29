const K='typetrace:races';
const valid=r=>r&&typeof r.wpm==='number'&&typeof r.text==='string'&&Array.isArray(r.timeline)&&r.timeline.length>0;
export const loadRaces=()=>{try{const r=JSON.parse(localStorage.getItem(K));return Array.isArray(r)?r.filter(valid):[]}catch{return[]}};
export const saveRace=race=>{try{localStorage.setItem(K,JSON.stringify([race,...loadRaces()].slice(0,200)))}catch{}};
export const clearRaces=()=>{try{localStorage.removeItem(K)}catch{}};
