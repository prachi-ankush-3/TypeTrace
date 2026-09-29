import {useState} from 'react';import {Trash2} from 'lucide-react';import {clearRaces} from '../utils/storage.js';
export default function Settings(){const [done,setDone]=useState(false);
return(<div className="panel mx-auto max-w-md"><h1 className="lbl mb-3">SETTINGS</h1><p className="mb-4 text-sm text-[#94A3B8]">All data lives in your browser's LocalStorage.</p>
<button className="btn" onClick={()=>{if(confirm('Delete all races and your ghost?')){clearRaces();setDone(true)}}}><Trash2 size={14}/>CLEAR ALL DATA</button>{done&&<p className="lbl mt-3 text-[#4ADE80]">DATA CLEARED</p>}</div>)}
