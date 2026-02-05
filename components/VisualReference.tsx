import React from 'react';

export const VisualReference: React.FC<{ visualId: string }> = ({ visualId }) => {
  const renderSVG = () => {
    switch (visualId) {
      case 'conduction_mechanism':
        return (
          <svg viewBox="0 0 300 150" className="w-full h-auto">
            <rect x="50" y="30" width="200" height="90" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <linearGradient id="heatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <rect x="50" y="30" width="200" height="90" fill="url(#heatGrad)" opacity="0.3" />
            <path d="M70 75 H 230" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow-red)" />
            <text x="55" y="25" className="text-[10px] font-bold fill-red-600">T1 (Hot)</text>
            <text x="210" y="25" className="text-[10px] font-bold fill-blue-600">T2 (Cold)</text>
            <text x="130" y="140" className="text-[10px] font-bold fill-slate-500">q = -k(dT/dx)</text>
            <defs>
              <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="0" refY="3" orientation="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
        );
      case 'conduction_cube':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <svg viewBox="0 0 400 300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect width="400" height="300" fill="#f8f9fa"></rect>
              
              {/* Definitions for Arrows */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#e74c3c"></polygon>
                </marker>
              </defs>

              {/* Title */}
              <text x="200" y="25" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#2c3e50">HEAT CONDUCTION DIMENSIONS</text>

              {/* 1D SECTION */}
              <g transform="translate(40, 50)">
                <text x="0" y="0" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#34495e">1D: Rod</text>
                <rect x="10" y="15" width="80" height="4" fill="#95a5a6"></rect>
                <line x1="0" y1="17" x2="100" y2="17" stroke="#e74c3c" strokeWidth="1.5" markerEnd="url(#arrowhead)"></line>
                <text x="105" y="21" fontFamily="monospace" fontSize="10" fill="#e74c3c">qx</text>
                <text x="10" y="50" fontFamily="serif" fontStyle="italic" fontSize="11">∂²T/∂x² = (1/α)∂T/∂t</text>
              </g>

              {/* 2D SECTION */}
              <g transform="translate(230, 50)">
                <text x="0" y="0" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#34495e">2D: Plate</text>
                <rect x="10" y="15" width="60" height="40" fill="#bdc3c7" stroke="#7f8c8d"></rect>
                <line x1="0" y1="35" x2="80" y2="35" stroke="#e74c3c" strokeWidth="1.5" markerEnd="url(#arrowhead)"></line>
                <line x1="40" y1="65" x2="40" y2="5" stroke="#e74c3c" strokeWidth="1.5" markerEnd="url(#arrowhead)"></line>
                <text x="85" y="38" fontFamily="monospace" fontSize="10" fill="#e74c3c">qx</text>
                <text x="35" y="0" fontFamily="monospace" fontSize="10" fill="#e74c3c">qy</text>
                <text x="-10" y="75" fontFamily="serif" fontStyle="italic" fontSize="11">∂²T/∂x² + ∂²T/∂y² = (1/α)∂T/∂t</text>
              </g>

              {/* 3D SECTION */}
              <g transform="translate(140, 160)">
                <text x="0" y="-10" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#34495e">3D: Control Volume</text>
                <path d="M20 40 L80 40 L100 20 L40 20 Z" fill="#ecf0f1" stroke="#34495e"></path> 
                <path d="M20 40 L20 80 L80 80 L80 40 Z" fill="#bdc3c7" stroke="#34495e"></path> 
                <path d="M80 40 L80 80 L100 60 L100 20 Z" fill="#95a5a6" stroke="#34495e"></path> 
                
                <line x1="0" y1="60" x2="110" y2="60" stroke="#e74c3c" strokeWidth="1.5" markerEnd="url(#arrowhead)"></line> 
                <line x1="50" y1="95" x2="50" y2="5" stroke="#e74c3c" strokeWidth="1.5" markerEnd="url(#arrowhead)"></line>  
                <line x1="10" y1="85" x2="115" y2="15" stroke="#e74c3c" strokeWidth="1.5" markerEnd="url(#arrowhead)"></line> 
                
                <text x="115" y="65" fontFamily="monospace" fontSize="10" fill="#e74c3c">qx</text>
                <text x="45" y="0" fontFamily="monospace" fontSize="10" fill="#e74c3c">qy</text>
                <text x="115" y="10" fontFamily="monospace" fontSize="10" fill="#e74c3c">qz</text>
                
                <rect x="-30" y="105" width="180" height="25" rx="5" fill="#34495e"></rect>
                <text x="60" y="122" fontFamily="serif" fontStyle="italic" fontSize="14" textAnchor="middle" fill="white">∇²T = (1/α) ∂T/∂t</text>
              </g>

              {/* Legend / Key */}
              <line x1="280" y1="260" x2="310" y2="260" stroke="#e74c3c" strokeWidth="2" markerEnd="url(#arrowhead)"></line>
              <text x="315" y="264" fontFamily="monospace" fontSize="9" fill="#2c3e50">Heat Flux (q)</text>
              <text x="280" y="280" fontFamily="monospace" fontSize="9" fill="#7f8c8d">α = Diffusivity</text>
            </svg>
          </div>
        );
      case 'boiling_curve':
        return (
          <svg viewBox="0 0 400 250" className="w-full h-auto">
            <line x1="40" y1="210" x2="380" y2="210" stroke="#94a3b8" strokeWidth="2" />
            <line x1="40" y1="210" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <path d="M40 200 Q 80 190 120 160 T 180 100 T 250 160 T 360 40" fill="none" stroke="#f43f5e" strokeWidth="3" />
            <circle cx="120" cy="160" r="3" fill="#f43f5e" />
            <circle cx="180" cy="100" r="3" fill="#f43f5e" />
            <circle cx="250" cy="160" r="3" fill="#f43f5e" />
            <text x="125" y="165" className="text-[8px] fill-slate-600">ONB</text>
            <text x="185" y="95" className="text-[8px] fill-slate-600 font-bold">CHF</text>
            <text x="45" y="225" className="text-[7px] fill-slate-400">Natural</text>
            <text x="130" y="225" className="text-[7px] fill-slate-400">Nucleate</text>
            <text x="195" y="225" className="text-[7px] fill-slate-400">Transition</text>
            <text x="280" y="225" className="text-[7px] fill-slate-400">Film</text>
            <text x="10" y="120" transform="rotate(-90, 10, 120)" className="text-[8px] font-bold fill-slate-500">Heat Flux (q")</text>
            <text x="180" y="240" className="text-[8px] font-bold fill-slate-500">ΔT excess</text>
          </svg>
        );
      case 'boundary_layer':
        return (
          <svg viewBox="0 0 400 180" className="w-full h-auto">
            <rect x="20" y="150" width="360" height="5" fill="#94a3b8" />
            <path d="M20 150 C 100 140, 200 80, 380 40" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
            {[50, 150, 250, 350].map((x, i) => (
              <g key={x} transform={`translate(${x}, 0)`}>
                <path d={`M0 150 Q ${10+i*10} 150, 0 ${150 - (20+i*30)}`} fill="none" stroke="#3b82f6" strokeWidth="1" />
                <line x1="0" y1="150" x2="0" y2={150 - (20+i*30)} stroke="#cbd5e1" strokeWidth="0.5" />
              </g>
            ))}
            <text x="20" y="20" className="text-[10px] font-bold fill-slate-500">Free stream U∞</text>
            <text x="320" y="30" className="text-[10px] font-bold fill-blue-500">Boundary Layer δ(x)</text>
          </svg>
        );
      case 'resistance_network':
        return (
          <svg viewBox="0 0 300 100" className="w-full h-auto">
            <circle cx="30" cy="50" r="4" fill="#64748b" />
            <path d="M30 50 L 50 50 L 60 35 L 75 65 L 90 35 L 105 65 L 115 50 L 135 50" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <circle cx="135" cy="50" r="4" fill="#64748b" />
            <path d="M135 50 L 155 50 L 165 35 L 180 65 L 195 35 L 210 65 L 220 50 L 240 50" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="240" cy="50" r="4" fill="#64748b" />
            <text x="70" y="25" className="text-[10px] font-bold fill-blue-600">R1 (Cond)</text>
            <text x="175" y="25" className="text-[10px] font-bold fill-amber-600">R2 (Conv)</text>
          </svg>
        );
      case 'he_profiles':
        return (
          <div className="grid grid-cols-2 gap-2">
            <svg viewBox="0 0 150 120">
              <rect width="150" height="120" fill="#f8fafc" />
              <path d="M10 20 C 50 40, 100 55, 140 60" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M10 100 C 50 85, 100 75, 140 70" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <text x="5" y="15" className="text-[8px] fill-slate-400">Parallel Flow</text>
            </svg>
            <svg viewBox="0 0 150 120">
              <rect width="150" height="120" fill="#f8fafc" />
              <path d="M10 20 C 50 40, 100 55, 140 65" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M140 100 C 100 85, 50 70, 10 50" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <text x="5" y="15" className="text-[8px] fill-slate-400">Counter Flow</text>
            </svg>
          </div>
        );
      case 'diffusion_tank':
        return (
          <svg viewBox="0 0 300 120" className="w-full h-auto">
            <rect x="20" y="20" width="130" height="80" fill="#eff6ff" stroke="#3b82f6" />
            <rect x="150" y="20" width="130" height="80" fill="#fff7ed" stroke="#f59e0b" />
            <circle cx="150" cy="60" r="2" fill="red" />
            {[...Array(8)].map((_, i) => (
              <circle key={i} cx={30 + Math.random() * 110} cy={30 + Math.random() * 60} r="2" fill="#3b82f6" />
            ))}
            {[...Array(8)].map((_, i) => (
              <circle key={i+8} cx={160 + Math.random() * 110} cy={30 + Math.random() * 60} r="2" fill="#f59e0b" />
            ))}
            <text x="25" y="115" className="text-[8px] fill-blue-600">Species A</text>
            <text x="230" y="115" className="text-[8px] fill-amber-600">Species B</text>
          </svg>
        );
      default:
        return (
          <div className="h-40 flex items-center justify-center bg-slate-50 border border-dashed rounded-xl">
            <p className="text-xs text-slate-400 italic">Visual diagram for this topic is in review.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PPT Interactive Reference</p>
        <div className="px-2 py-1 bg-slate-100 rounded text-[9px] font-bold text-slate-500">Interactive Graphic</div>
      </div>
      <div className="w-full">
        {renderSVG()}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50">
        <p className="text-[10px] text-slate-400 italic leading-relaxed">
          Diagram represents physical phenomena discussed in current slide context.
        </p>
      </div>
    </div>
  );
};