
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Play, Pause, RefreshCw, Thermometer, Activity, ArrowRightLeft, Wind, MoveRight } from 'lucide-react';

// --- 1. 1D Steady Conduction ---
const ConductionSim = () => {
  const [t1, setT1] = useState(100);
  const [t2, setT2] = useState(30);
  const [k, setK] = useState(50);
  const [L, setL] = useState(0.5);
  const q = (k * (t1 - t2)) / L;

  const data = useMemo(() => {
    const points = [];
    // Ensure we have exactly 11 points for a smooth line regardless of L
    for (let i = 0; i <= 10; i++) {
      const x = (L / 10) * i;
      points.push({ 
        x: parseFloat(x.toFixed(3)), 
        temp: parseFloat((t1 - ((t1 - t2) / L) * x).toFixed(1)) 
      });
    }
    return points;
  }, [t1, t2, L]);

  // Max L in the slider is 2.0, use this to normalize visual width
  const visualWidth = (L / 2.0) * 100;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800">1D Steady State Conduction</h3>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider">
          Fourier's Law
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-50 p-5 rounded-xl space-y-5 border border-slate-200">
          <div>
            <label className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>T_HOT (Boundary 1)</span>
              <span className="text-red-600">{t1}°C</span>
            </label>
            <input type="range" min="50" max="300" value={t1} onChange={e => setT1(+e.target.value)} className="w-full h-1.5 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>T_COLD (Boundary 2)</span>
              <span className="text-blue-600">{t2}°C</span>
            </label>
            <input type="range" min="0" max="100" value={t2} onChange={e => setT2(+e.target.value)} className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>K (Conductivity)</span>
              <span className="text-slate-700 font-mono">{k} W/mK</span>
            </label>
            <input type="range" min="1" max="400" value={k} onChange={e => setK(+e.target.value)} className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600" />
          </div>
          <div>
            <label className="flex justify-between text-xs font-bold text-slate-500 mb-2">
              <span>L (Thickness)</span>
              <span className="text-indigo-600 font-mono">{L.toFixed(1)} m</span>
            </label>
            <input type="range" min="0.1" max="2.0" step="0.1" value={L} onChange={e => setL(+e.target.value)} className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          
          <div className="pt-2">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Calculated Heat Flux</div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{q.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs font-normal text-slate-500">W/m²</span></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Chart Section */}
          <div className="h-64 bg-slate-50/50 p-2 rounded-xl border border-dashed border-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="x" 
                  tick={{fontSize: 12, fill: '#64748b'}}
                  label={{ value: 'Distance x (m)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                />
                <YAxis 
                  domain={[0, 320]} 
                  tick={{fontSize: 12, fill: '#64748b'}}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Material Gradient Visualization */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Material Temperature Gradient</span>
              <span className="text-[10px] font-bold text-slate-400">{L.toFixed(1)}m Width</span>
            </div>
            
            <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
              <div 
                className="absolute inset-y-0 left-0 transition-all duration-300 ease-out shadow-inner"
                style={{ 
                  width: `${visualWidth}%`,
                  background: `linear-gradient(to right, #ef4444, #3b82f6)`
                }}
              >
                {/* Visual labels within the bar if space allows */}
                <div className="h-full flex justify-between items-center px-4">
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">{t1}°C</span>
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">{t2}°C</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>x = 0</span>
              <div className="flex-1 border-b border-dashed border-slate-200 mx-4 self-center" />
              <span>x = {L.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Transient Conduction (FDM) ---
const TransientSim = () => {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [alpha, setAlpha] = useState(1.17e-5);
  const nodes = 25;
  const dx = 0.01;
  const dt = 0.05;
  const [temps, setTemps] = useState(Array(nodes).fill(25));
  const animationRef = useRef<number>(0);

  const reset = () => { setRunning(false); setTime(0); setTemps(Array(nodes).fill(25)); };

  useEffect(() => {
    if (running) {
      const loop = () => {
        setTemps(prev => {
          const next = [...prev];
          const Fo = (alpha * dt) / (dx * dx);
          next[0] = 150; // Boundary
          for (let i = 1; i < nodes - 1; i++) next[i] = Fo * (prev[i+1] + prev[i-1]) + (1 - 2 * Fo) * prev[i];
          next[nodes - 1] = next[nodes - 2]; // Adiabatic
          return next;
        });
        setTime(t => t + dt);
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    } else cancelAnimationFrame(animationRef.current);
    return () => cancelAnimationFrame(animationRef.current);
  }, [running, alpha]);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Transient 1D Cooling (Finite Difference)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setRunning(!running)} className={`flex-1 p-2 rounded font-bold ${running ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{running ? 'Pause' : 'Start'}</button>
            <button onClick={reset} className="p-2 bg-slate-100 rounded"><RefreshCw className="w-4 h-4" /></button>
          </div>
          <div className="p-4 bg-slate-50 border rounded text-center font-mono text-2xl">{time.toFixed(1)}s</div>
        </div>
        <div className="md:col-span-2 h-64"><ResponsiveContainer><AreaChart data={temps.map((t, i) => ({ x: i * dx, t }))}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="x"/><YAxis domain={[0, 160]}/><Tooltip/><Area type="monotone" dataKey="t" fill="#3b82f6" fillOpacity={0.2} stroke="#2563eb" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>
      </div>
    </div>
  );
};

// --- 3. Fin Analysis ---
const FinSim = () => {
  const [Tb, setTb] = useState(150);
  const [h, setH] = useState(25);
  const [k, setK] = useState(200);
  const L = 0.1, P = 0.04, Ac = 0.0001, Tinf = 25;
  const m = Math.sqrt((h * P) / (k * Ac));
  const data = useMemo(() => {
    const points = [];
    const cosh_mL = Math.cosh(m * L);
    for (let x = 0; x <= L; x += L / 20) {
      points.push({ x: +x.toFixed(3), temp: +(Tinf + (Tb - Tinf) * (Math.cosh(m * (L - x)) / cosh_mL)).toFixed(1) });
    }
    return points;
  }, [Tb, h, k, m]);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Extended Surface (Fin) Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 bg-slate-50 p-4 border rounded">
          <div><label className="text-xs font-bold text-slate-400">Tb: {Tb}°C</label><input type="range" min="50" max="300" value={Tb} onChange={e => setTb(+e.target.value)} className="w-full h-1 bg-red-200 rounded cursor-pointer" /></div>
          <div><label className="text-xs font-bold text-slate-400">h: {h} W/m²K</label><input type="range" min="5" max="150" value={h} onChange={e => setH(+e.target.value)} className="w-full h-1 bg-blue-200 rounded cursor-pointer" /></div>
          <div><label className="text-xs font-bold text-slate-400">k: {k} W/mK</label><input type="range" min="15" max="400" value={k} onChange={e => setK(+e.target.value)} className="w-full h-1 bg-amber-200 rounded cursor-pointer" /></div>
        </div>
        <div className="md:col-span-2 h-64"><ResponsiveContainer><AreaChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="x"/><YAxis domain={[0, 300]}/><Tooltip/><Area type="monotone" dataKey="temp" fill="#f59e0b" fillOpacity={0.1} stroke="#d97706" strokeWidth={3}/></AreaChart></ResponsiveContainer></div>
      </div>
    </div>
  );
};

// --- 4. Convection Boundary Layer ---
const ConvectionSim = () => {
  const [Uinf, setUinf] = useState(5);
  const [nu, setNu] = useState(1.5e-5); // Kinematic viscosity Air
  const [Pr, setPr] = useState(0.7);
  const L = 0.5;
  const data = useMemo(() => {
    const pts = [];
    for (let x = 0.01; x <= L; x += L / 20) {
      const Re_x = (Uinf * x) / nu;
      const delta_v = 5 * x / Math.sqrt(Re_x); // Blasius
      const delta_t = delta_v / Math.pow(Pr, 1/3);
      pts.push({ x: +x.toFixed(3), vel_bl: +delta_v.toFixed(4), thermal_bl: +delta_t.toFixed(4) });
    }
    return pts;
  }, [Uinf, nu, Pr]);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">Convection Boundary Layer Growth</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-4 border rounded space-y-4">
           <div><label className="text-xs font-bold text-slate-400">Velocity U∞ (m/s): {Uinf}</label><input type="range" min="1" max="20" value={Uinf} onChange={e => setUinf(+e.target.value)} className="w-full h-1 bg-indigo-200 rounded cursor-pointer" /></div>
           <div><label className="text-xs font-bold text-slate-400">Prandtl Number Pr: {Pr}</label><input type="range" min="0.1" max="5.0" step="0.1" value={Pr} onChange={e => setPr(+e.target.value)} className="w-full h-1 bg-green-200 rounded cursor-pointer" /></div>
           <div className="flex items-center gap-2 p-3 bg-white border rounded"><MoveRight className="text-blue-500"/><span className="text-xs font-bold text-slate-500">Flat Plate Flow (Laminar)</span></div>
        </div>
        <div className="md:col-span-2 h-64"><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="x" label={{value:'x (m)', position:'bottom'}}/><YAxis label={{value:'Thickness (m)', angle:-90, position:'insideLeft'}}/><Tooltip/><Legend/><Line type="monotone" dataKey="vel_bl" name="Velocity BL (δ)" stroke="#3b82f6" strokeWidth={3} dot={false}/><Line type="monotone" dataKey="thermal_bl" name="Thermal BL (δt)" stroke="#ef4444" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div>
      </div>
    </div>
  );
};

// --- 5. 2D Relaxation (Gauss-Seidel) ---
const TwoDConductionSim = () => {
  const [top, setTop] = useState(100);
  const [bottom, setBottom] = useState(25);
  const size = 15;
  const [grid, setGrid] = useState<number[][]>(Array(size).fill(0).map(() => Array(size).fill(25)));

  const solve = () => {
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (i === 0) next[i][j] = top;
          else if (i === size - 1) next[i][j] = bottom;
          else if (j === 0 || j === size - 1) next[i][j] = 25;
          else next[i][j] = 0.25 * (next[i-1][j] + next[i+1][j] + next[i][j-1] + next[i][j+1]);
        }
      }
      return next;
    });
  };

  useEffect(() => { const h = setInterval(solve, 50); return () => clearInterval(h); }, [top, bottom]);

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center">
      <h3 className="font-bold text-slate-800 mb-6 w-full">2D Steady State (Laplace Relaxation)</h3>
      <div className="flex gap-10 w-full items-center justify-center">
        <div className="space-y-4 w-48 shrink-0">
          <div><label className="text-xs font-bold">Top: {top}°C</label><input type="range" value={top} onChange={e => setTop(+e.target.value)} className="w-full h-1 bg-red-200 rounded"/></div>
          <div><label className="text-xs font-bold">Bottom: {bottom}°C</label><input type="range" value={bottom} onChange={e => setBottom(+e.target.value)} className="w-full h-1 bg-blue-200 rounded"/></div>
        </div>
        <div className="grid border-2 border-slate-800 gap-[1px] bg-slate-300" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: '250px', height: '250px' }}>
          {grid.map((r, i) => r.map((t, j) => (
            <div key={`${i}-${j}`} style={{ backgroundColor: `rgb(${Math.round(255 * (t/100))}, 0, ${Math.round(255 * (1-t/100))})` }} className="w-full h-full" />
          )))}
        </div>
      </div>
    </div>
  );
};

export const Simulations = () => {
  const [active, setActive] = useState('1d');
  const tabs = [
    { id: '1d', label: '1D Steady', icon: Thermometer },
    { id: 'transient', label: 'Transient', icon: Activity },
    { id: 'fin', label: 'Fin Analysis', icon: Wind },
    { id: 'convection', label: 'Convection BL', icon: Wind },
    { id: '2d', label: '2D Relaxation', icon: Thermometer },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="lg:w-64 bg-white p-2 rounded-xl border h-fit space-y-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${active === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 animate-in fade-in duration-300">
        {active === '1d' && <ConductionSim />}
        {active === 'transient' && <TransientSim />}
        {active === 'fin' && <FinSim />}
        {active === 'convection' && <ConvectionSim />}
        {active === '2d' && <TwoDConductionSim />}
      </div>
    </div>
  );
};
