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
  ArrowLeft
} from 'lucide-react';

const IconMap: Record<string, any> = {
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Waves
};

enum View {
  LESSON = 'LESSON',
  SIMULATION = 'SIMULATION',
  QUIZ = 'QUIZ',
  CHAT = 'CHAT'
}

const App = () => {
  const [activeUnit, setActiveUnit] = useState<Unit>(COURSE_CONTENT[0]);
  const [activeTopic, setActiveTopic] = useState<string>(COURSE_CONTENT[0].topics[0]);
  const [currentView, setCurrentView] = useState<View>(View.LESSON);
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
        setDiagramSvg(null); // Reset diagram
        try {
          // Parallel fetch for speed
          const [text, svg] = await Promise.all([
            generateLessonContent(activeTopic, activeUnit.title),
            generateDiagramSvg(activeTopic)
          ]);
          setLessonContent(text || "Content unavailable.");
          setDiagramSvg(svg);
        } catch (e) {
          console.error(e);
          setLessonContent("Error loading content. Please check API Key.");
        } finally {
          setLoadingContent(false);
        }
      };
      fetchContent();
    }
  }, [activeTopic, activeUnit, currentView]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'
        } fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out flex flex-col md:relative md:translate-x-0 overflow-hidden border-r border-slate-800`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">ThermoMaster</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Modules */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Course Units</p>
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
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeUnit.id === unit.id && currentView === View.LESSON
                        ? 'bg-blue-600/10 text-blue-400'
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{unit.title.split(': ')[1]}</span> {/* Shorten title */}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Interactive Tools</p>
            <div className="space-y-1">
              <button
                onClick={() => { setCurrentView(View.SIMULATION); if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === View.SIMULATION ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>Simulations</span>
              </button>
              <button
                onClick={() => { setCurrentView(View.QUIZ); if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === View.QUIZ ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Quiz Zone</span>
              </button>
              <button
                onClick={() => { setCurrentView(View.CHAT); if(window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentView === View.CHAT ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <MessageSquareText className="w-4 h-4" />
                <span>AI Tutor</span>
              </button>
            </div>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Engineered for Students
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">
              {currentView === View.LESSON ? activeUnit.title : currentView}
            </h2>
          </div>
          {/* Simple API Key status indicator (mock) */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${process.env.API_KEY ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-medium text-slate-500">Gemini {process.env.API_KEY ? 'Connected' : 'Missing Key'}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* View: LESSON */}
          {currentView === View.LESSON && (
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
              {/* Topic List (Sub-sidebar) */}
              <div className="lg:w-64 flex-shrink-0">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Module Topics</h3>
                <div className="space-y-1">
                  {activeUnit.topics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setActiveTopic(topic)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors border-l-2 ${
                        activeTopic === topic
                          ? 'bg-white border-blue-500 text-blue-700 shadow-sm'
                          : 'border-transparent text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson Text */}
              <div className="flex-1">
                {loadingContent ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-64 bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-1">
                      <span className="uppercase tracking-wide">{activeUnit.id}</span>
                      <ChevronRight className="w-4 h-4" />
                      <span>Lesson</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{activeTopic}</h1>
                    
                    {/* SVG Diagram Container */}
                    {diagramSvg && (
                       <div className="my-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                         <div 
                           className="w-full max-w-md"
                           dangerouslySetInnerHTML={{ __html: diagramSvg }} 
                         />
                         <p className="mt-3 text-xs text-slate-400 font-medium uppercase tracking-wide">AI Generated Schematic</p>
                       </div>
                    )}

                    <div className="prose prose-slate max-w-none prose-lg prose-headings:text-slate-800 prose-a:text-blue-600">
                      <ReactMarkdown>{lessonContent}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View: SIMULATION */}
          {currentView === View.SIMULATION && <Simulations />}

          {/* View: QUIZ */}
          {currentView === View.QUIZ && <Quiz unitId={activeUnit.id} unitTitle={activeUnit.title} />}

          {/* View: CHAT */}
          {currentView === View.CHAT && (
            <div className="max-w-4xl mx-auto h-full">
               <Chatbot />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
