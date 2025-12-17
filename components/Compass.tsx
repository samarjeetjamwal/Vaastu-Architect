import React, { useState } from 'react';
import { ZONES } from '../utils/vastuCalculations';
import { ZoneData } from '../types';

interface CompassProps {
  entrance: string;
}

const Compass: React.FC<CompassProps> = ({ entrance }) => {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);

  const size = 320;
  const center = size / 2;
  const radius = 150;

  // Calculate coordinates for the entrance marker
  const entranceZone = ZONES.find(z => z.name === entrance);
  const markerAngle = entranceZone ? entranceZone.deg - 90 : -90;
  const markerX = center + (radius + 15) * Math.cos((markerAngle * Math.PI) / 180);
  const markerY = center + (radius + 15) * Math.sin((markerAngle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative shadow-2xl rounded-full bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform transition-all duration-500">
          {/* Background Circle */}
          <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth="1" />
          
          {ZONES.map((zone) => {
            const startAngle = zone.deg - 11.25 - 90;
            const endAngle = zone.deg + 11.25 - 90;
            
            const x1 = center + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = center + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = center + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = center + radius * Math.sin((endAngle * Math.PI) / 180);

            const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

            const isEntrance = zone.name === entrance;

            return (
              <g key={zone.name} onClick={() => setSelectedZone(zone)} className="cursor-pointer group hover:scale-[1.02] transition-transform origin-center">
                <path
                  d={pathData}
                  fill={zone.color}
                  stroke={isEntrance ? "#10b981" : "#fff"}
                  strokeWidth={isEntrance ? "3" : "1"}
                  className={`transition-opacity duration-200 ${selectedZone?.name === zone.name ? 'opacity-100 stroke-slate-900 stroke-2' : 'opacity-80 hover:opacity-100'}`}
                />
                <text
                  x={center + (radius * 0.75) * Math.cos(((zone.deg - 90) * Math.PI) / 180)}
                  y={center + (radius * 0.75) * Math.sin(((zone.deg - 90) * Math.PI) / 180)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-bold pointer-events-none fill-slate-800 uppercase tracking-tighter"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}
          
          {/* Inner Circle */}
          <circle cx={center} cy={center} r={40} className="fill-white dark:fill-slate-800 shadow-inner" />
          <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-slate-400">
            Brahma
          </text>
          <text x={center} y={center + 15} textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-slate-300">
            Center
          </text>

          {/* Entrance Marker */}
          {entranceZone && (
             <g transform={`translate(${markerX}, ${markerY}) rotate(${entranceZone.deg})`}>
                <polygon points="0,-10 8,5 -8,5" fill="#10b981" />
                <text y="15" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600 dark:fill-emerald-400">ENTRY</text>
             </g>
          )}
        </svg>
      </div>

      <p className="mt-4 text-sm text-slate-500 italic">Tap any zone for detailed Vastu principles</p>

      {/* Detailed Zone Modal */}
      {selectedZone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedZone(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 text-white relative" style={{ backgroundColor: selectedZone.color }}>
               <button 
                  onClick={() => setSelectedZone(null)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center transition-colors"
               >
                 ✕
               </button>
               <h2 className="text-2xl font-bold text-slate-800 drop-shadow-sm">{selectedZone.name} <span className="text-base font-normal opacity-90">({selectedZone.deg}°)</span></h2>
               <p className="text-slate-900 font-medium mt-1 opacity-90">{selectedZone.ideal}</p>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Element</h4>
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold">
                      {selectedZone.element}
                   </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {selectedZone.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                    <h4 className="text-emerald-700 dark:text-emerald-400 font-bold mb-3 flex items-center gap-2">
                       <span>✅</span> Do's
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                       {selectedZone.dos.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                             <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>

                 <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
                    <h4 className="text-red-700 dark:text-red-400 font-bold mb-3 flex items-center gap-2">
                       <span>❌</span> Don'ts
                    </h4>
                    <ul className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
                       {selectedZone.donts.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                             <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0"></span>
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-center">
               <button 
                onClick={() => setSelectedZone(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
               >
                 Close Details
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compass;