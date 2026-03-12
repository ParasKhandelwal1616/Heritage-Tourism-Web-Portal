'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { getHeritageInfo, HeritageAIResponse, QuizQuestion } from '@/app/actions/gemini';

interface MapOverlayProps {
  location: {
    name: string;
    image: string;
    description: string;
  } | null;
  onClose: () => void;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ location, onClose }) => {
  const [aiData, setAiData] = useState<HeritageAIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});

  useEffect(() => {
    if (location) {
      setLoading(true);
      setAiData(null);
      setUserAnswers({});
      setFeedback({});
      
      getHeritageInfo(location.name).then((data) => {
        setAiData(data);
        setLoading(false);
      });
    }
  }, [location]);

  const handleAnswerSelect = (qIdx: number, option: string) => {
    if (feedback[qIdx] !== undefined) return; // Prevent re-selection after answer
    setUserAnswers({ ...userAnswers, [qIdx]: option });
    const isCorrect = option === aiData?.quizzes[qIdx].correctAnswer;
    setFeedback({ ...feedback, [qIdx]: isCorrect });
  };

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white z-[110] shadow-2xl overflow-y-auto border-l border-black/5"
        >
          {/* Header Image */}
          <div className="relative h-64 w-full">
            <img 
              src={location.image} 
              alt={location.name} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all rounded-full text-white"
            >
              <X size={20} />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="p-8 -mt-12 relative bg-white rounded-t-[3rem] space-y-8">
            <div>
              <span className="text-saffron font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">
                Heritage Site
              </span>
              <h2 className="font-serif text-4xl font-black text-charcoal">{location.name}</h2>
            </div>

            {/* AI History Brief */}
            <div className="bg-ash rounded-3xl p-6 border border-black/5">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 bg-saffron rounded-lg text-white">
                  <Info size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-charcoal/80">AI Historical Guide</h3>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-8 space-x-3 text-charcoal/40">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm font-medium">Consulting history books...</span>
                </div>
              ) : (
                <p className="text-charcoal/70 leading-relaxed text-sm font-medium italic">
                  "{aiData?.history || 'Loading heritage insights...'}"
                </p>
              )}
            </div>

            {/* Interactive Quiz */}
            {!loading && aiData?.quizzes && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-emerald rounded-lg text-white">
                    <HelpCircle size={16} />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-charcoal/80 text-emerald">Quick Quiz</h3>
                </div>

                {aiData.quizzes.map((quiz, qIdx) => (
                  <div key={qIdx} className="space-y-4">
                    <p className="font-serif text-lg font-bold text-charcoal">{quiz.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {quiz.options.map((option) => (
                        <button
                          key={option}
                          disabled={feedback[qIdx] !== undefined}
                          onClick={() => handleAnswerSelect(qIdx, option)}
                          className={`text-left p-4 rounded-2xl text-sm font-medium transition-all border-2 ${
                            userAnswers[qIdx] === option 
                              ? feedback[qIdx] ? 'bg-emerald/10 border-emerald text-emerald' : 'bg-red-50 border-red-500 text-red-500'
                              : 'bg-white border-black/5 hover:border-saffron hover:bg-saffron/5 text-charcoal/70'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {userAnswers[qIdx] === option && (
                              feedback[qIdx] ? <CheckCircle size={16} /> : <AlertCircle size={16} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {feedback[qIdx] !== undefined && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-charcoal/50 leading-relaxed bg-ash/50 p-4 rounded-xl border border-black/5"
                      >
                        <span className="font-bold block mb-1 text-charcoal">Explanation:</span>
                        {quiz.explanation}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MapOverlay;
