import {useState} from 'react';import {NavLink,Link} from 'react-router-dom';import {Menu,X} from 'lucide-react';
const L=[['/','Home'],['/race','Race'],['/history','History'],['/statistics','Statistics'],['/settings','Settings']];
export default function Navbar(){const [open,setOpen]=useState(false);
const cls=({isActive})=>`px-3 py-1 text-sm ${isActive?'text-[#4ADE80]':'text-[#94A3B8] hover:text-[#F8FAFC]'}`;
return(<header className="border-b border-white/10 bg-[#080B0F]/80 backdrop-blur"><div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
<Link to="/"><div className="mono font-bold text-[#4ADE80]">&gt; TypeTrace</div><div className="lbl">RACE AGAINST YOUR PAST</div></Link>
<nav className="hidden gap-1 md:flex" aria-label="Main">{L.map(([to,n])=><NavLink key={to} to={to} className={cls}>{n}</NavLink>)}</nav>
<div className="flex items-center gap-3"><span className="lbl hidden sm:block"><span className="text-[#4ADE80]">●</span> SYSTEM READY</span>
<button className="md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></div>
{open&&<nav className="flex flex-col border-t border-white/10 md:hidden" onClick={()=>setOpen(false)}>{L.map(([to,n])=><NavLink key={to} to={to} className={cls}>{n}</NavLink>)}</nav>}</header>)}
