import { useState } from 'react';
import { ClipboardCheck, Loader2, X, CalendarClock, CheckCircle2, Send } from 'lucide-react';

// Types matching your backend structure
interface Question {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}

interface TestResponse {
  topic: string;
  questions: Question[];
}

interface ScheduleTestRequest {
  topic: string;
  date: string;
  time: string;
}

// API Service
const apiService = {
  generateTest: async (topic: string) => {
    try {
      const response = await fetch('http://localhost:8080/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        return { error: 'Failed to generate test', data: null };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { error: 'Network error', data: null };
    }
  },

  scheduleTest: async (scheduleData: ScheduleTestRequest) => {
    try {
      const response = await fetch('http://localhost:8080/tests/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scheduleData),
      });
      
      if (!response.ok) {
        return { error: 'Failed to schedule test', data: null };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { error: 'Network error', data: null };
    }
  },

  cancelScheduledTest: async () => {
    try {
      const response = await fetch('http://localhost:8080/tests/schedule', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        return { error: 'Failed to cancel test', data: null };
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      return { error: 'Network error', data: null };
    }
  },
};

export default function Tests() {
  const [topic, setTopic] = useState('');
  const [test, setTest] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Test taking state
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Generate Test
  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setTest(null);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);

    try {
      const result = await apiService.generateTest(topic);
      console.log('API Result:', result);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        console.log('Test Data:', result.data);
        if (Array.isArray(result.data)) {
          console.log('Array format detected, first question:', result.data[0]);
          setTest({ topic: topic, questions: result.data });
        } else {
          console.log('Object format detected, questions:', result.data.questions);
          if (result.data.questions && result.data.questions.length > 0) {
            console.log('First question:', result.data.questions[0]);
          }
          setTest(result.data);
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate test.');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  // Submit test
  const handleSubmitTest = () => {
    if (!test) return;
    
    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setSubmitted(true);
  };

  // Reset test
  const handleResetTest = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // Schedule Test
  const handleSchedule = async () => {
    if (!scheduleTopic.trim() || !scheduleDate.trim() || !scheduleTime.trim()) return;

    setScheduling(true);
    setError('');
    setScheduleSuccess('');

    const scheduleData: ScheduleTestRequest = {
      topic: scheduleTopic,
      date: scheduleDate,
      time: scheduleTime,
    };

    try {
      const result = await apiService.scheduleTest(scheduleData);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setScheduleSuccess(
          `Test scheduled successfully for ${scheduleTopic} on ${scheduleDate} at ${scheduleTime}`
        );
        setScheduleTopic('');
        setScheduleDate('');
        setScheduleTime('');
      }
    } catch {
      setError('Failed to schedule test.');
    } finally {
      setScheduling(false);
    }
  };

  // Cancel Scheduled Test
  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    setScheduleSuccess('');

    try {
      const result = await apiService.cancelScheduledTest();
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setScheduleSuccess(result.data.message);
      }
    } catch {
      setError('Failed to cancel scheduled test.');
    } finally {
      setCancelling(false);
    }
  };

  const getOptionClass = (questionIndex: number, optionValue: string) => {
    const isSelected = userAnswers[questionIndex] === optionValue;
    
    if (!submitted) {
      return `p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-sky-500 bg-sky-50' 
          : 'border-slate-300 hover:border-sky-300 hover:bg-slate-50'
      }`;
    }
    
    const correctAnswer = test?.questions[questionIndex]?.answer;
    const isCorrect = optionValue === correctAnswer;
    const isUserAnswer = isSelected;
    
    if (isCorrect) {
      return 'p-4 border-2 rounded-lg border-green-500 bg-green-50';
    }
    if (isUserAnswer && !isCorrect) {
      return 'p-4 border-2 rounded-lg border-red-500 bg-red-50';
    }
    return 'p-4 border-2 rounded-lg border-slate-300 bg-slate-50 opacity-50';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Generate Test Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="mb-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <ClipboardCheck className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Generate Test</h2>
            <p className="text-slate-500 text-sm mt-1">
              Create comprehensive tests for any topic
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Enter a topic (e.g., Java, Python, React)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                'Generate Test'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
            {error}
          </div>
        )}

        {test && test.questions && test.questions.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Check if options are null */}
            {test.questions[0]?.optionA === null && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 mb-4">
                <p className="font-semibold">⚠️ Questions have missing options</p>
                <p className="text-sm mt-1">The questions in the database don't have options saved. Please regenerate the test or check your backend.</p>
              </div>
            )}
            
            <div className="flex items-center justify-between pb-4 border-b-2 border-sky-200">
              <h3 className="text-2xl font-semibold text-slate-900">
                {test.topic}
              </h3>
              {submitted && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-600">
                    {score}/{test.questions.length}
                  </div>
                  <div className="text-sm text-slate-600">
                    {Math.round((score / test.questions.length) * 100)}% Score
                  </div>
                </div>
              )}
            </div>

            {test.questions.map((q, idx) => {
              const isCorrect = submitted && userAnswers[idx] === q.answer;
              const isWrong = submitted && userAnswers[idx] && userAnswers[idx] !== q.answer;
              
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-lg font-bold text-slate-900 min-w-[2rem]">
                      {idx + 1}.
                    </span>
                    <p className="font-semibold text-slate-900 text-lg flex-1">
                      {q.question}
                    </p>
                    {submitted && (
                      <div className="flex-shrink-0">
                        {isCorrect && (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        )}
                        {isWrong && (
                          <span className="text-red-600 font-bold text-xl">✗</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 ml-8">
                    {q.optionA && (
                      <div
                        onClick={() => handleAnswerSelect(idx, 'A')}
                        className={getOptionClass(idx, 'A')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            userAnswers[idx] === 'A' ? 'border-sky-500 bg-sky-500' : 'border-slate-400'
                          }`}>
                            {userAnswers[idx] === 'A' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-slate-700">A)</span>
                          <span className="text-slate-900">{q.optionA}</span>
                        </div>
                      </div>
                    )}
                    
                    {q.optionB && (
                      <div
                        onClick={() => handleAnswerSelect(idx, 'B')}
                        className={getOptionClass(idx, 'B')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            userAnswers[idx] === 'B' ? 'border-sky-500 bg-sky-500' : 'border-slate-400'
                          }`}>
                            {userAnswers[idx] === 'B' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-slate-700">B)</span>
                          <span className="text-slate-900">{q.optionB}</span>
                        </div>
                      </div>
                    )}
                    
                    {q.optionC && (
                      <div
                        onClick={() => handleAnswerSelect(idx, 'C')}
                        className={getOptionClass(idx, 'C')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            userAnswers[idx] === 'C' ? 'border-sky-500 bg-sky-500' : 'border-slate-400'
                          }`}>
                            {userAnswers[idx] === 'C' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-slate-700">C)</span>
                          <span className="text-slate-900">{q.optionC}</span>
                        </div>
                      </div>
                    )}
                    
                    {q.optionD && (
                      <div
                        onClick={() => handleAnswerSelect(idx, 'D')}
                        className={getOptionClass(idx, 'D')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            userAnswers[idx] === 'D' ? 'border-sky-500 bg-sky-500' : 'border-slate-400'
                          }`}>
                            {userAnswers[idx] === 'D' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-slate-700">D)</span>
                          <span className="text-slate-900">{q.optionD}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Submit Button */}
            {!submitted ? (
              <button
                onClick={handleSubmitTest}
                disabled={Object.keys(userAnswers).length !== test.questions.length}
                className="w-full px-6 py-4 bg-sky-600 text-white rounded-xl font-semibold text-lg hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Submit Test ({Object.keys(userAnswers).length}/{test.questions.length} answered)
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border-2 border-sky-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Test Results</h4>
                  <p className="text-slate-700 text-lg">
                    You scored <span className="font-bold text-sky-600">{score}</span> out of{' '}
                    <span className="font-bold">{test.questions.length}</span> questions correct!
                  </p>
                  <p className="text-slate-600 mt-1">
                    Percentage: <span className="font-bold">{Math.round((score / test.questions.length) * 100)}%</span>
                  </p>
                </div>
                <button
                  onClick={handleResetTest}
                  className="w-full px-6 py-4 bg-slate-600 text-white rounded-xl font-semibold text-lg hover:bg-slate-700 transition-colors"
                >
                  Retake Test
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Test Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="mb-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <CalendarClock className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Schedule Test</h2>
            <p className="text-slate-500 text-sm mt-1">
              Plan tests with automated email notifications
            </p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <input
            type="text"
            value={scheduleTopic}
            onChange={(e) => setScheduleTopic(e.target.value)}
            placeholder="Topic for scheduled test"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
            disabled={scheduling}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              disabled={scheduling}
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
              disabled={scheduling}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSchedule}
              disabled={scheduling || !scheduleTopic || !scheduleDate || !scheduleTime}
              className="flex-1 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {scheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Schedule Test'}
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {cancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {scheduleSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{scheduleSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
}