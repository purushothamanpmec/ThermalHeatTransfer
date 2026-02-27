import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from './constants';
import { UnitId, Unit } from './types';
import { getLessonFromPPT } from './services/geminiService';
import { COURSE_PPT_DATA } from './data/courseData';
import { Simulations } from './components/Simulations';
import { Quiz } from './components/Quiz';
import { Chatbot } from './components/Chatbot';
import { VisualReference } from './components/VisualReference';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import { 
  BookOpen, 
  Menu, 
  FlaskConical, 
  GraduationCap, 
  MessageSquareText, 
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Waves,
  ArrowRight,
  Home,
  LayoutDashboard,
  Presentation,
  Sigma
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

/**
 * Robust Math Renderer
 * Uses the auto-render extension of KaTeX.
 * Retries if the library is still loading.
 */


const App = () => {
  const [activeUnit, setActiveUnit] = useState<Unit>(COURSE_CONTENT[0]);
  const [activeTopic, setActiveTopic] = useState<string>(COURSE_CONTENT[0].topics[0]);
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonContent, setLessonContent] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (currentView === View.LESSON) {
      setLoadingContent(true);
      const text = getLessonFromPPT(activeTopic);
      setLessonContent(text);
      setLoadingContent(false);
    }
  }, [activeTopic, activeUnit, currentView]);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const activeTopicData = COURSE_PPT_DATA[activeTopic];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <aside
  className={`
    fixed inset-y-0 left-0 z-50
    w-72 bg-white border-r border-slate-200
    transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:w-72
    flex flex-col shadow-sm
  `}
>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
      <Thermometer className="text-white w-5 h-5" />
    </div>
    <h1 className="text-xl font-bold tracking-tight text-slate-800">
      ThermoMaster
    </h1>
  </div>

  {/* Close button (mobile only) */}
  <button
    onClick={() => setSidebarOpen(false)}
    className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
  >
    ✕
  </button>
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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Lecture Series</p>
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

      {sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-40 md:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

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
        </header>

        <div className="flex-1 overflow-y-auto">
          {currentView === View.HOME && (
            <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COURSE_CONTENT.map(unit => (
                  <button 
                    key={unit.id}
                    onClick={() => { setActiveUnit(unit); setCurrentView(View.LESSON); }}
                    className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left group"
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {IconMap[unit.icon] ? React.createElement(IconMap[unit.icon], { className: 'w-5 h-5' }) : <BookOpen className="w-5 h-5" />}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{unit.title}</h3>
                    <p className="text-xs text-slate-500 mb-4">{unit.topics.length} Lecture Topics</p>
                    <div className="flex items-center text-blue-600 text-xs font-bold gap-2">
                      Open Module <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentView === View.LESSON && (
            <div className="p-6 md:p-8 max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-10">
              <div className="lg:w-72 shrink-0 space-y-6">
                <div className="sticky top-6 space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Module Topics</h3>
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
                  
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 mb-2">
                      <Presentation className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">PPT Source</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Current: Slides {activeTopicData?.slides?.join(', ') || 'N/A'} of Unit {activeUnit.id.toUpperCase()}. 
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                {loadingContent ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded-lg w-3/4"></div>
                    <div className="h-64 bg-slate-200 rounded-3xl"></div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="mb-8">
                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                        <span>{activeUnit.title}</span>
                      </div>
                      <h1 className="text-4xl font-black text-slate-900 leading-tight">{activeTopic}</h1>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                      <div className="xl:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div id="lesson-markdown-container" className="p-8 md:p-10 prose prose-slate max-w-none prose-lg">
                         <ReactMarkdown
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {lessonContent}
</ReactMarkdown>
                        </div>
                      </div>

                      <div className="xl:col-span-5 space-y-8">
                        <div className="sticky top-6 flex flex-col gap-8">
                          {activeTopicData?.visualId && (
                            <div className="w-full">
                                <VisualReference visualId={activeTopicData.visualId} />
                            </div>
                          )}
                          
                          {activeTopicData?.equations && (
                              <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-800 text-white relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700"></div>
                                  <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <Sigma className="w-4 h-4 text-blue-400" />
                                      </div>
                                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Governing Equation</p>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">Math Core</span>
                                  </div>
                                  <div className="overflow-x-auto relative z-10">
                                      <div className="text-2xl font-light text-center py-6 min-h-[100px] flex items-center justify-center">
  <ReactMarkdown
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
  >
    {activeTopicData.equations}
  </ReactMarkdown>
</div>

                                  </div>
                                  <div className="mt-6 pt-6 border-t border-slate-800 text-[10px] text-slate-500 italic text-center">
                                    Refer to slide notes for full boundary condition derivations.
                                  </div>
                              </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            {currentView === View.SIMULATION && <Simulations />}
            {currentView === View.QUIZ && <Quiz unitId={activeUnit.id} unitTitle={activeUnit.title} />}
            {currentView === View.CHAT && (
              <div className="max-w-4xl mx-auto h-[calc(100vh-180px)]">
                <Chatbot activeTopic={activeTopic} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;