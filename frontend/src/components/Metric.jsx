export default function Metric({label,value,accent=false}){return <div className="metric"><span>{label}</span><strong className={accent?"accent":""}>{value}</strong></div>}
