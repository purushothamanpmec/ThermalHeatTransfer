
import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from './constants';
import { UnitId, Unit } from './types';
import { generateLessonContent, generateDiagramSvg } from './services/geminiService';
import { Simulations } from './components/Simulations';
import { Quiz } from './components/Quiz';
import { Chatbot } from './components/Chatbot';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  Menu, 
  FlaskConical, 
  GraduationCap, 
  MessageSquareText, 
  ChevronRight,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Waves,
  ArrowRight,
  Home,
  LayoutDashboard,
  Zap,
  Star,
  Clock
} from 'lucide-react';

const IconMap: Record<string, any> = {
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Waves
};

enum View {
  HOME = 'HOME',
  LESSON = 'LESSON',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  CHAT = 'CHAT'
}

const App = () => {
  const [activeUnit, setActiveUnit] = useState<Unit>(COURSE_CONTENT[0]);
  const [activeTopic, setActiveTopic] = useState<string>(COURSE_CONTENT[0].topics[0]);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Content State
  const [lessonContent, setLessonContent] = useState<string>("");
  const [diagramSvg, setDiagramSvg] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Fetch content when topic changes
  useEffect(() => {
    if (currentView === View.LESSON) {
      const fetchContent = async () => {
        setLoadingContent(true);
        setDiagramSvg(null);
        try {
          const [text, svg] = await Promise.all([
            generateLessonContent(activeTopic, activeUnit.title),
            generateDiagramSvg(activeTopic)
          ]);
          setLessonContent(text || "Content unavailable.");
          setDiagramSvg(svg);
        } catch (e) {
          setLessonContent("Error loading content. Please check API Key configuration.");
        } finally {
          setLoadingContent(false);
        }
      };
      fetchContent();
    }
  }, [activeTopic, activeUnit, currentView]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'
        } fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col md:relative md:translate-x-0 overflow-hidden shadow-sm`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
            <Thermometer className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ThermoMaster</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <button
            onClick={() => setCurrentView(View.HOME)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              currentView === View.HOME ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Course Material</p>
            <div className="space-y-1">
              {COURSE_CONTENT.map((unit) => {
                const Icon = IconMap[unit.icon] || BookOpen;
                return (
                  <button
                    key={unit.id}
                    onClick={() => {
                      setActiveUnit(unit);
                      setActiveTopic(unit.topics[0]);
                      setCurrentView(View.LESSON);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeUnit.id === unit.id && currentView === View.LESSON
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{unit.title.split(': ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Interactive</p>
            <div className="space-y-1">
              <button
                onClick={() => setCurrentView(View.SIMULATION)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === View.SIMULATION ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>Simulations</span>
              </button>
              <button
                onClick={() => setCurrentView(View.QUIZ)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === View.QUIZ ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Quiz Zone</span>
              </button>
              <button
                onClick={() => setCurrentView(View.CHAT)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === View.CHAT ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquareText className="w-4 h-4" />
                <span>AI Tutor</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-6 justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              {currentView === View.HOME ? 'Course Dashboard' : currentView}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-500">GEMINI PRO CONNECTED</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          
          {/* View: HOME */}
          {currentView === View.HOME && (
            <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, Engineer!</h1>
                  <p className="text-slate-500 max-w-2xl">ThermoMaster is your interactive suite for mastering Heat and Mass Transfer. Explore modules, run simulations, and consult with your AI Tutor.</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Learning Streak</p>
                      <div className="flex items-center gap-2 text-xl font-black text-amber-500">
                         <Zap className="w-5 h-5 fill-current" />
                         <span>12 Days</span>
                      </div>
                   </div>
                   <div className="px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quiz Average</p>
                      <div className="flex items-center gap-2 text-xl font-black text-blue-600">
                         <Star className="w-5 h-5 fill-current" />
                         <span>88%</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSE_CONTENT.slice(0, 3).map(unit => (
                  <button 
                    key={unit.id}
                    onClick={() => { setActiveUnit(unit); setCurrentView(View.LESSON); }}
                    className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group"
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {IconMap[unit.icon] ? React.createElement(IconMap[unit.icon], { className: 'w-5 h-5' }) : <BookOpen className="w-5 h-5" />}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{unit.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{unit.topics.length} Key Topics to explore</p>
                    <div className="flex items-center text-blue-600 text-xs font-bold gap-2">
                      Start Lesson <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentView(View.SIMULATION)}
                  className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl hover:translate-y-[-4px] transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold mb-1">Interactive Labs</h3>
                  <p className="text-xs text-slate-400 mb-4">Run real-time numerical solvers for HMT problems.</p>
                  <div className="flex items-center text-white text-xs font-bold gap-2">
                    Open Simulations <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-indigo-600 p-8 rounded-3xl text-white flex flex-col justify-between items-start gap-6 relative overflow-hidden">
                  <div className="relative z-10 space-y-2">
                    <h2 className="text-2xl font-bold">Stuck on a problem?</h2>
                    <p className="text-indigo-100 text-sm max-w-xs">Your AI Tutor is powered by Gemini 3 Pro and can help you solve complex analytical problems using your textbook or notes as a reference.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView(View.CHAT)}
                    className="relative z-10 px-8 py-3 bg-white text-indigo-600 rounded-2xl font-bold shadow-lg hover:bg-indigo-50 transition-colors shrink-0"
                  >
                    Start Consultation
                  </button>
                  <MessageSquareText className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/10 rotate-12" />
                </div>

                <div className="bg-white border border-slate-100 p-8 rounded-3xl flex flex-col justify-between">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                         </div>
                         <h3 className="font-bold text-slate-800">Recent Activity</h3>
                      </div>
                      <div className="space-y-3">
                         {[
                           { activity: "Completed Quiz: Conduction", time: "2 hours ago" },
                           { activity: "Viewed Lesson: Boundary Layers", time: "Yesterday" },
                           { activity: "Ran Mass Diffusion Simulation", time: "2 days ago" }
                         ].map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
                              <span className="text-slate-600 font-medium">{item.activity}</span>
                              <span className="text-slate-400 text-xs font-mono">{item.time}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <button onClick={() => setCurrentView(View.LESSON)} className="mt-6 text-blue-600 text-xs font-bold hover:underline">View All Study History</button>
                </div>
              </div>
            </div>
          )}

          {/* View: LESSON */}
          {currentView === View.LESSON && (
            <div className="p-6 md:p-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
              <div className="lg:w-72 shrink-0 space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Unit Content</h3>
                  <div className="space-y-1">
                    {activeUnit.topics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                          activeTopic === topic
                            ? 'bg-white border-blue-200 text-blue-700 shadow-sm font-bold'
                            : 'border-transparent text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {loadingContent ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded-lg w-3/4"></div>
                    <div className="h-64 bg-slate-200 rounded-3xl"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                        <span>{activeUnit.id}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span>Core Theory</span>
                      </div>
                      <h1 className="text-4xl font-black text-slate-900 leading-tight">{activeTopic}</h1>
                    </div>

                    {diagramSvg && (
                       <div className="p-10 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                         <div className="w-full max-w-lg transition-all hover:scale-[1.02]" dangerouslySetInnerHTML={{ __html: diagramSvg }} />
                         <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scientific Schematic</p>
                       </div>
                    )}

                    <div className="prose prose-slate max-w-none prose-lg prose-headings:font-black prose-p:leading-relaxed prose-strong:text-blue-700">
                      <ReactMarkdown>{lessonContent}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Views */}
          <div className="p-6 md:p-10">
            {currentView === View.SIMULATION && <Simulations />}
            {currentView === View.QUIZ && <Quiz unitId={activeUnit.id} unitTitle={activeUnit.title} />}
            {currentView === View.CHAT && <div className="max-w-4xl mx-auto h-[calc(100vh-180px)]"><Chatbot /></div>}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
