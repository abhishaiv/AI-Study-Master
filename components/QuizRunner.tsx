import React, { useState, useEffect } from 'react';
import { Topic, QuizQuestion } from '../types';
import { generateQuizQuestions } from '../services/gemini';
import { saveQuizResult } from '../services/storage';
import { CheckCircle, XCircle, ChevronRight, RefreshCw } from 'lucide-react';

interface QuizRunnerProps {
  topic: Topic;
  onComplete: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ topic, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const data = await generateQuizQuestions(topic.title, topic.contextData);
        setQuestions(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [topic]);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === questions[currentQuestionIndex].correctOptionIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    // Only save if we actually answered questions (safety check)
    if (questions.length > 0) {
        // Calculate final score including the last question logic handled in render/state
        // Actually score is updated immediately on submit.
        
        saveQuizResult({
          topicId: topic.id,
          score: score + (selectedOption === questions[currentQuestionIndex].correctOptionIndex && !isAnswered ? 1 : 0), // handle edge case if finish called directly? No, flow is rigid.
          totalQuestions: questions.length,
          date: new Date().toISOString(),
          feedback: "Great job!"
        });
        setShowResults(true);
    }
  };

  if (loading) {
     return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Generative AI is crafting your quiz...</p>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto text-center space-y-8 pt-12 animate-fade-in">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-500 mb-8">You just tested your knowledge on {topic.title}</p>
            
            <div className="relative inline-flex items-center justify-center mb-8">
                <svg className="w-40 h-40">
                    <circle className="text-gray-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                    <circle 
                        className={percentage >= 80 ? "text-green-500" : percentage >= 50 ? "text-blue-500" : "text-red-500"}
                        strokeWidth="10" 
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * percentage) / 100}
                        strokeLinecap="round"
                        stroke="currentColor" 
                        fill="transparent" 
                        r="70" cx="80" cy="80" 
                        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                    />
                </svg>
                <span className="absolute text-4xl font-bold text-gray-800">{percentage}%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold">Correct</p>
                    <p className="text-xl font-bold text-green-600">{score}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                    <p className="text-xl font-bold text-gray-800">{questions.length}</p>
                </div>
            </div>

            <button 
                onClick={onComplete}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-20 animate-fade-in">
        <div className="mb-8 flex justify-between items-center text-sm font-medium text-gray-500">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 relative overflow-hidden">
             {/* Progress Bar Top */}
             <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>

            <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                {currentQ.question}
            </h3>

            <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                    let optionClass = "border-gray-200 hover:bg-gray-50 hover:border-gray-300";
                    
                    if (isAnswered) {
                         if (idx === currentQ.correctOptionIndex) {
                             optionClass = "bg-green-50 border-green-500 ring-1 ring-green-500";
                         } else if (idx === selectedOption) {
                             optionClass = "bg-red-50 border-red-500 ring-1 ring-red-500";
                         } else {
                            optionClass = "opacity-50 border-gray-100";
                         }
                    } else if (selectedOption === idx) {
                        optionClass = "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${optionClass}`}
                        >
                            <span>{option}</span>
                            {isAnswered && idx === currentQ.correctOptionIndex && <CheckCircle size={20} className="text-green-600" />}
                            {isAnswered && idx === selectedOption && idx !== currentQ.correctOptionIndex && <XCircle size={20} className="text-red-500" />}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm leading-relaxed">
                    <span className="font-bold block mb-1">Explanation:</span>
                    {currentQ.explanation}
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-end">
            {!isAnswered ? (
                <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
                >
                    Submit Answer
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ChevronRight size={18} />
                </button>
            )}
        </div>
    </div>
  );
};
