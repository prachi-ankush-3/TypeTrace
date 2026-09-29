import {Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';import Home from './pages/Home.jsx';import Race from './pages/Race.jsx';
import Result from './pages/Result.jsx';import History from './pages/History.jsx';import Statistics from './pages/Statistics.jsx';import Settings from './pages/Settings.jsx';
export default function App(){return(<><Navbar/><main className="fade mx-auto max-w-5xl px-4 py-8"><Routes>
<Route path="/" element={<Home/>}/><Route path="/race" element={<Race/>}/><Route path="/result" element={<Result/>}/>
<Route path="/history" element={<History/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="/settings" element={<Settings/>}/></Routes></main></>)}
