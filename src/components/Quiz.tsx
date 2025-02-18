import React, { useState, useEffect } from 'react';
import { questions } from '../data/questions';
import { QuizState, QuizAttempt } from '../types';
import { QuizDB } from '../utils/db';
import { Timer, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const SECONDS_PER_QUESTION = 30;

const Quiz: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: SECONDS_PER_QUESTION,
    isComplete: false
  });

  const [currentInput, setCurrentInput] = useState('');
  const [db] = useState(new QuizDB());

  useEffect(() => {
    db.init();
  }, []);

  useEffect(() => {
    if (quizState.isComplete) return;

    const timer = setInterval(() => {
      setQuizState(prev => {
        if (prev.timeRemaining <= 1) {
          handleNextQuestion();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState.isComplete]);

  const handleAnswer = (answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questions[prev.currentQuestionIndex].id]: answerIndex }
    }));
  };

  const handleIntegerAnswer = (value: string) => {
    setCurrentInput(value);
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questions[prev.currentQuestionIndex].id]: parseInt(value) }
    }));
  };

  const handleNextQuestion = async () => {
    if (quizState.currentQuestionIndex === questions.length - 1) {
      const score = calculateScore();
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score,
        timeSpent: SECONDS_PER_QUESTION * questions.length - quizState.timeRemaining,
        answers: quizState.answers,
        totalQuestions: questions.length
      };
      await db.saveAttempt(attempt);
      setQuizState(prev => ({ ...prev, isComplete: true }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: SECONDS_PER_QUESTION
      }));
      setCurrentInput('');
    }
  };

  const calculateScore = () => {
    return Object.entries(quizState.answers).reduce((score, [questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!question) return score;
      
      if (question.type === 'multiple-choice') {
        return score + (question.correctAnswer === answer ? 1 : 0);
      } else {
        return score + (question.correctAnswer === parseInt(answer as string) ? 1 : 0);
      }
    }, 0);
  };

  if (quizState.isComplete) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover opacity-5" />
        <div className="relative">
          <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <div className="mb-8">
                  {percentage >= 70 ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                  )}
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-xl text-gray-600">
                    {percentage.toFixed(1)}% Correct
                  </p>
                </div>
                
                <div className="space-y-4 mb-8 text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Performance Summary:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Multiple Choice</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {questions.filter(q => q.type === 'multiple-choice').length} Questions
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Numerical</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {questions.filter(q => q.type === 'integer').length} Questions
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const progressPercentage = ((quizState.currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover opacity-5" />
      <div className="relative">
        <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-200 to-purple-200">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-medium text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
                Question {quizState.currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center text-sm font-medium text-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
                <Timer className="w-4 h-4 mr-2" />
                {quizState.timeRemaining}s
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentQuestion.text}</h2>
            
            {currentQuestion.type === 'multiple-choice' ? (
              <div className="space-y-4">
                {currentQuestion.options!.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-200 border-2 ${
                      quizState.answers[currentQuestion.id] === index
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="number"
                  value={currentInput}
                  onChange={(e) => handleIntegerAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
                />
              </div>
            )}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              >
                {quizState.currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;