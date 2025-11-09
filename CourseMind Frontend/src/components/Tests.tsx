import { useState } from 'react';
import { ClipboardCheck, Loader2, X, CalendarClock, CheckCircle2 } from 'lucide-react';
import { apiService, TestResponse, ScheduleTestRequest } from '../services/api';

export default function Tests() {
  const [topic, setTopic] = useState('');
  const [test, setTest] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const normalize = (s?: string) => (s ?? '').trim().toLowerCase();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setTest(null);
    setSelectedAnswers({});
    setSubmitted(false);

    const result = await apiService.generateTest(topic);
    if (result.error) setError(result.error);
    else if (result.data) {
      // Normalize backend field names
      const formattedQuestions = result.data.questions.map((q: any, i: number) => ({
        id: i + 1,
        question: q.question,
        optionA: q.optionA ?? q.optiona ?? '',
        optionB: q.optionB ?? q.optionb ?? '',
        optionC: q.optionC ?? q.optionc ?? '',
        optionD: q.optionD ?? q.optiond ?? '',
        answer: q.answer,
      }));
      setTest({ topic: result.data.topic ?? topic, questions: formattedQuestions });
    }

    setLoading(false);
  };

  const handleOptionSelect = (qId: number, option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmitAnswers = () => {
    setSubmitted(true);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTopic.trim() || !scheduleDate.trim() || !scheduleTime.trim()) return;

    setScheduling(true);
    setError('');
    setScheduleSuccess('');

    const scheduleData: ScheduleTestRequest = { topic: scheduleTopic, date: scheduleDate, time: scheduleTime };
    const result = await apiService.scheduleTest(scheduleData);

    if (result.error) setError(result.error);
    else if (result.data) {
      setScheduleSuccess(`Test scheduled successfully for ${scheduleTopic} on ${scheduleDate} at ${scheduleTime}`);
      setScheduleTopic('');
      setScheduleDate('');
      setScheduleTime('');
    }

    setScheduling(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    setScheduleSuccess('');

    const result = await apiService.cancelScheduledTest();
    if (result.error) setError(result.error);
    else if (result.data) setScheduleSuccess(result.data.message);

    setCancelling(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideInUp">
      {/* Test Generator */}
      <div className="card-base p-8 md:p-12">
        <div className="section-header mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <ClipboardCheck className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Generate Test</h2>
            <p className="text-slate-500 text-sm mt-1">Create multiple-choice tests instantly</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for test"
              className="input-base flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6 animate-slideInDown">
            {error}
          </div>
        )}

        {/* Questions Section */}
        {test && (
          <div className="animate-fadeIn">
            <div className="mb-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-slate-900">{test.topic}</h3>
            </div>

            <div className="space-y-5">
              {test.questions.map((q, idx) => {
                const options = [
                  { key: 'A', value: q.optionA },
                  { key: 'B', value: q.optionB },
                  { key: 'C', value: q.optionC },
                  { key: 'D', value: q.optionD },
                ].filter((opt) => opt.value && opt.value.trim() !== '');

                const selected = selectedAnswers[q.id];
                const answer = q.answer;

                return (
                  <div
                    key={q.id}
                    className="card-base p-5 hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-sky-50">
                          <span className="text-sm font-semibold text-sky-600">{idx + 1}</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-slate-900 mb-3">{q.question}</p>

                        <div className="space-y-2 ml-2">
                          {options.map((opt) => {
                            const isSelected = selected === opt.key;
                            const isCorrect =
                              submitted &&
                              (normalize(answer) === normalize(opt.key) ||
                                normalize(answer) === normalize(opt.value));
                            const isWrongSelected = submitted && isSelected && !isCorrect;

                            let border = 'border-slate-200';
                            let bg = '';
                            let text = '';

                            if (submitted) {
                              if (isCorrect) {
                                border = 'border-green-400';
                                bg = 'bg-green-50';
                                text = 'text-green-700';
                              } else if (isWrongSelected) {
                                border = 'border-red-400';
                                bg = 'bg-red-50';
                                text = 'text-red-700';
                              }
                            } else if (isSelected) {
                              border = 'border-sky-400';
                              bg = 'bg-sky-50';
                            }

                            return (
                              <label
                                key={opt.key}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${border} ${bg} ${text} transition-all`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={isSelected}
                                  onChange={() => handleOptionSelect(q.id, opt.key)}
                                  disabled={submitted}
                                />
                                <span>
                                  <strong>{opt.key})</strong> {opt.value}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!submitted && test.questions.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmitAnswers}
                  className="btn-primary flex items-center gap-2 px-6 py-3"
                >
                  Submit Answers
                </button>
              </div>
            )}

            {submitted && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Submitted! Correct answers are highlighted in green ✅</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Section */}
      <div className="card-base p-8 md:p-12">
        <div className="section-header mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <CalendarClock className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Schedule Test</h2>
            <p className="text-slate-500 text-sm mt-1">Automate test generation on schedule</p>
          </div>
        </div>

        <form onSubmit={handleSchedule} className="mb-8 space-y-4">
          <input
            type="text"
            value={scheduleTopic}
            onChange={(e) => setScheduleTopic(e.target.value)}
            placeholder="Topic for scheduled test"
            className="input-base w-full"
            disabled={scheduling}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="input-base w-full"
              disabled={scheduling}
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="input-base w-full"
              disabled={scheduling}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={scheduling || !scheduleTopic.trim() || !scheduleDate.trim() || !scheduleTime.trim()}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {scheduling ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarClock className="w-5 h-5" />
                  Schedule Test
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="px-6 py-3 btn-secondary flex items-center gap-2"
            >
              {cancelling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <X className="w-5 h-5" />
                  Cancel
                </>
              )}
            </button>
          </div>
        </form>

        {scheduleSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3 animate-slideInDown">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{scheduleSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
}
