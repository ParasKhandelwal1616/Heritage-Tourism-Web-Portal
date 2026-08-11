'use client';

import React, { useState } from 'react';
import { Sparkles, Compass, HelpCircle, Loader2, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { getHeritageInfo, HeritageAIResponse, QuizQuestion } from '@/app/actions/gemini';

export default function AIGuidePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HeritageAIResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const popularLocations = [
    'Taj Mahal, Agra',
    'Qutub Minar, Delhi',
    'Hampi, Karnataka',
    'Ajanta Caves, Maharashtra',
    'Sun Temple, Konark',
    'Khajuraho Temples, MP'
  ];

  const handleSearch = async (locationName: string) => {
    if (!locationName.trim()) return;
    setLoading(true);
    setResult(null);
    setSelectedAnswers({});

    try {
      const data = await getHeritageInfo(locationName);
      setResult(data);
    } catch (err) {
      setResult({
        history: "Failed to load heritage information. Please try again.",
        quizzes: [],
        error: "Search Error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx: number, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  return (
    <div className="bg-ash/20 min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center space-x-2 bg-saffron/10 text-saffron font-black uppercase tracking-[0.2em] text-xs px-4 py-1.5 rounded-full border border-saffron/20">
            <Sparkles className="w-4 h-4" />
            <span>AI Virtual Heritage Assistant</span>
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black text-charcoal">
            AI Heritage <span className="text-emerald italic">Guide & Quiz</span>
          </h1>
          <p className="max-w-xl mx-auto text-charcoal/60 text-base md:text-lg font-medium">
            Type any monument or heritage site in India to generate an instant history breakdown and test your knowledge!
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl border border-black/5 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-grow">
              <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter monument name (e.g. Taj Mahal, Red Fort...)"
                className="w-full pl-12 pr-4 py-4 bg-ash/50 rounded-2xl border border-black/10 focus:outline-none focus:border-saffron text-charcoal font-semibold text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-saffron hover:bg-emerald disabled:opacity-50 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-saffron/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Explore Site</span>
                </>
              )}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="pt-2">
            <p className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-2">Popular Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {popularLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setQuery(loc);
                    handleSearch(loc);
                  }}
                  className="px-3 py-1.5 bg-ash hover:bg-saffron/10 hover:text-saffron text-charcoal/70 text-xs font-bold rounded-xl transition-all border border-black/5"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-black/5 shadow-xl">
            <Loader2 className="w-12 h-12 text-saffron animate-spin mx-auto" />
            <p className="font-serif text-xl font-bold text-charcoal">Gemini AI is analyzing heritage records...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-8">
            
            {/* Error / Quota Notice */}
            {result.error && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center space-x-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{result.history}</span>
              </div>
            )}

            {/* Heritage Info Card */}
            {!result.error && (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-black/5 space-y-4">
                <div className="flex items-center space-x-3 text-saffron">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="font-serif text-2xl font-black text-charcoal">Heritage Story</h2>
                </div>
                <p className="text-charcoal/80 text-lg leading-relaxed font-medium">
                  {result.history}
                </p>
              </div>
            )}

            {/* Interactive Quizzes */}
            {result.quizzes && result.quizzes.length > 0 && (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-black/5 space-y-6">
                <div className="flex items-center space-x-3 text-emerald">
                  <HelpCircle className="w-6 h-6" />
                  <h2 className="font-serif text-2xl font-black text-charcoal">Interactive Heritage Quiz</h2>
                </div>

                <div className="space-y-6">
                  {result.quizzes.map((quiz: QuizQuestion, idx: number) => {
                    const selected = selectedAnswers[idx];
                    const isAnswered = selected !== undefined;
                    const isCorrect = selected === quiz.correctAnswer;

                    return (
                      <div key={idx} className="p-6 bg-ash/40 rounded-2xl border border-black/5 space-y-4">
                        <p className="font-bold text-charcoal text-base md:text-lg">
                          <span className="text-saffron font-black mr-2">Q{idx + 1}.</span> {quiz.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {quiz.options.map((option, optIdx) => {
                            let btnStyle = "bg-white text-charcoal hover:bg-ash border-black/10";
                            if (isAnswered) {
                              if (option === quiz.correctAnswer) {
                                btnStyle = "bg-emerald text-white border-emerald font-bold";
                              } else if (option === selected) {
                                btnStyle = "bg-red-500 text-white border-red-500 font-bold";
                              } else {
                                btnStyle = "bg-white text-charcoal/40 border-black/5";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isAnswered}
                                onClick={() => handleOptionSelect(idx, option)}
                                className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${btnStyle}`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className={`p-4 rounded-xl text-xs font-bold flex items-start space-x-2 ${isCorrect ? 'bg-emerald/10 text-emerald' : 'bg-amber-50 text-amber-800'}`}>
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-black">{isCorrect ? 'Correct Answer!' : `Incorrect. Right answer: ${quiz.correctAnswer}`}</p>
                              <p className="font-medium mt-1">{quiz.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
