
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';
import { 
  Thermometer, Activity, Wind, MoveRight, 
  RefreshCw, Play, Pause, Waves, Beaker
} from 'lucide-react';

// --- 1. 1D Steady Conduction ---
const ConductionSim = () => {
  const [t1, setT1] = useState(100);
  const [t2, setT2] = useState(30);
  const [k, setK] = useState(50);
  const [L, setL] = useState(0.5);
  const q = (k * (t1 - t2)) / L;

  const data = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 10; i++) {
      const x = (L / 10) * i;
      points.push({ 
        x: parseFloat(x.toFixed(3)), 
        temp: parseFloat((t1 - ((t1 - t2) / L) * x).toFixed(1)) 
      });
    }
    return points;
  }, [t1, t2, L]);

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">1D Steady State Conduction</h3>
          <p className="text-xs text-slate-500">Fourier's Law: $q = -k \nabla T$</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-widest">
          Conduction
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div>
            <label className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
              <span>T1 (HOT)</span>
              <span className="text-red-500">{t1}°C</span>
            </label>
            <input type="range" min="50" max="300" value={t1} onChange={e => setT1(+e.target.value)} className="w-full accent-red-500" />
          </div>
          <div>
            <label className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
              <span>T2 (COLD)</span>
              <span className="text-blue-500">{t2}°C</span>
            </label>
            <input type="range" min="0" max="100" value={t2} onChange={e => setT2(+e.target.value)} className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
              <span>k (Thermal Cond.)</span>
              <span className="text-slate-700">{k} W/m·K</span>
            </label>
            <input type="range" min="1" max="400" value={k} onChange={e => setK(+e.target.value)} className="w-full accent-slate-600" />
          </div>
          <div className="pt-4 border-t border-slate-200">
            <div className="p-3 bg-white rounded-lg border text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Heat Flux (q)</p>
              <p className="text-xl font-black text-slate-800">{q.toLocaleString()} <span className="text-xs font-normal">W/m²</span></p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="x" label={{ value: 'Distance (m)', position: 'bottom', offset: 0, fontSize: 10 }} />
              <YAxis domain={[0, 320]} label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- 2. Mass Diffusion (New) ---
const MassDiffusionSim = () => {
  const [Ca0, setCa0] = useState(1.0); // Concentration at boundary
  const [Dab, setDab] = useState(2.0e-5); // Diffusion coefficient
  const [L, setL] = useState(0.1); // Length of tube
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  
  const nodes = 20;
  const dx = L / nodes;
  const dt = 1.0;
  const [conc, setConc] = useState(Array(nodes).fill(0));

  const reset = () => { setTime(0); setConc(Array(nodes).fill(0)); setRunning(false); };

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => {
        setConc(prev => {
          const next = [...prev];
          const Fo = (Dab * dt) / (dx * dx);
          // Boundary at x=0 is constant Ca0
          next[0] = Ca0;
          for (let i = 1; i < nodes - 1; i++) {
            next[i] = prev[i] + Fo * (prev[i-1] - 2 * prev[i] + prev[i+1]);
          }
          // Impermeable boundary at x=L
          next[nodes-1] = next[nodes-2];
          return next;
        });
        setTime(t => t + dt);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [running, Dab, dx, Ca0]);

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">1D Mass Diffusion (Transient)</h3>
          <p className="text-xs text-slate-500">Fick's Second Law: $\frac{\partial C}{\partial t} = D \frac{\partial^2 C}{\partial x^2}$</p>
        </div>
        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest">
          Mass Transfer
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setRunning(!running)} 
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 ${running ? 'bg-amber-100 text-amber-700' : 'bg-emerald-600 text-white shadow-md'}`}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? 'Stop' : 'Simulate'}
            </button>
            <button onClick={reset} className="p-2 bg-white border rounded-lg hover:bg-slate-100">
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div>
            <label className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
              <span>Initial Conc. (C0)</span>
              <span>{Ca0} mol/m³</span>
            </label>
            <input type="range" min="0.1" max="5" step="0.1" value={Ca0} onChange={e => setCa0(+e.target.value)} className="w-full accent-emerald-500" />
          </div>
          <div>
            <label className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
              <span>Diffusivity (Dab)</span>
              <span>{Dab.toExponential(1)} m²/s</span>
            </label>
            <input type="range" min="1e-6" max="1e-4" step="1e-6" value={Dab} onChange={e => setDab(+e.target.value)} className="w-full accent-emerald-600" />
          </div>
          <div className="pt-4 border-t text-center">
            <p className="text-[10px] text-slate-400 font-bold">ELAPSED TIME</p>
            <p className="text-2xl font-mono text-slate-800">{time.toFixed(0)}s</p>
          </div>
        </div>

        <div className="lg:col-span-2 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={conc.map((c, i) => ({ x: +(i * dx).toFixed(3), c }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="x" label={{ value: 'Distance (m)', position: 'bottom', offset: 0, fontSize: 10 }} />
              <YAxis domain={[0, 5]} label={{ value: 'Conc. (mol/m³)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="c" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- Simulation Suite Wrapper ---
export const Simulations = () => {
  const [active, setActive] = useState('1d');
  
  const tabs = [
    { id: '1d', label: '1D Conduction', icon: Thermometer },
    { id: 'mass', label: 'Mass Diffusion', icon: Beaker },
    { id: 'convection', label: 'Convection BL', icon: Wind },
    { id: 'transient', label: 'Transient Heat', icon: Activity },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActive(t.id)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${active === t.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        {active === '1d' && <ConductionSim />}
        {active === 'mass' && <MassDiffusionSim />}
        {active === 'convection' && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
             <Wind className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium italic">Convection simulation is being recalibrated... Coming soon!</p>
          </div>
        )}
        {active === 'transient' && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
             <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500 font-medium italic">Transient Heat Transfer Lab is currently offline for maintenance.</p>
          </div>
        )}
      </div>
    </div>
  );
};
