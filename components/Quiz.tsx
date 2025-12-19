
import React, { useState } from 'react';
import { UnitId, QuizQuestion } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { Loader2, CheckCircle2, XCircle, Trophy, AlertCircle, PlayCircle } from 'lucide-react';

interface QuizProps {
  unitId: UnitId;
  unitTitle: string;
}

export const Quiz: React.FC<QuizProps> = ({ unitId, unitTitle }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const generated = await generateQuizQuestions(unitTitle, difficulty);
      if (generated && generated.length > 0) {
        setQuestions(generated);
        setQuizStarted(true);
        setQuizFinished(false);
        setCurrentQIndex(0);
        setScore(0);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        throw new Error("No questions generated.");
      }
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null || !questions[currentQIndex]) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    if (optionIndex === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center min-h-[450px]">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <PlayCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz: {unitTitle}</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Test your grasp of the material with AI-generated questions adapted to your level.</p>
        
        <div className="inline-flex p-1 bg-slate-100 rounded-lg mb-8">
          {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                difficulty === d ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <button
          onClick={startQuiz}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Start Assessment'}
        </button>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-200 text-center animate-in zoom-in-95">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Finished!</h2>
        <p className="text-slate-500 mb-8">Your Performance Summary</p>
        <div className="text-5xl font-black text-blue-600 mb-2">{Math.round((score / questions.length) * 100)}%</div>
        <p className="text-slate-600 mb-10">You got {score} out of {questions.length} questions correct.</p>
        <button
          onClick={() => setQuizStarted(false)}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Take Another Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  if (!currentQ) return <Loader2 className="animate-spin" />;

  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-slate-200 max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          <span className="text-xs font-bold text-slate-400">Q{currentQIndex + 1} / {questions.length}</span>
        </div>
        <span className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded bg-blue-50 text-blue-600">{currentQ.difficulty}</span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">{currentQ.question}</h3>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.correctAnswerIndex;
          const showResults = selectedOption !== null;

          let styles = "w-full text-left p-5 rounded-xl border-2 transition-all font-medium flex justify-between items-center ";
          if (!showResults) styles += "border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-slate-700";
          else if (isCorrect) styles += "border-green-500 bg-green-50 text-green-800";
          else if (isSelected) styles += "border-red-500 bg-red-50 text-red-800";
          else styles += "border-slate-50 bg-slate-50 text-slate-400";

          return (
            <button key={idx} onClick={() => handleAnswer(idx)} disabled={showResults} className={styles}>
              <span>{option}</span>
              {showResults && isCorrect && <CheckCircle2 className="w-5 h-5" />}
              {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-10 animate-in slide-in-from-left-4">
          <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Scientific Explanation</h4>
          <p className="text-slate-700 text-sm leading-relaxed">{currentQ.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={selectedOption === null}
          className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg disabled:opacity-30 hover:bg-blue-700 transition-all active:scale-95"
        >
          {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
