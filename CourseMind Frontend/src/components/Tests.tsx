import { useState } from 'react';
import { ClipboardCheck, Loader2, X, CalendarClock, CheckCircle2 } from 'lucide-react';
import { apiService, TestResponse, ScheduleTestRequest } from '../services/api';

export default function Tests() {
  const [topic, setTopic] = useState('');
  const [test, setTest] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Generate Test
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setTest(null);

    try {
      const result = await apiService.generateTest(topic);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setTest(result.data);
      }
    } catch (err) {
      setError('Failed to generate test.');
    } finally {
      setLoading(false);
    }
  };

  // Schedule Test
  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideInUp">
      {/* Generate Test Section */}
      <div className="card-base p-8 md:p-12">
        <div className="section-header mb-10 flex items-center gap-4">
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

        <form onSubmit={handleGenerate} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic"
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
            {error}
          </div>
        )}

        {test && (
          <div className="animate-fadeIn space-y-3">
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">{test.topic}</h3>
            {test.questions.map((q, idx) => (
              <div
                key={idx}
                className="card-base p-5 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <p className="font-medium text-slate-900 mb-2">{idx + 1}. {q.question}</p>
                {q.options && q.options.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mb-2">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}
                {q.answer && (
                  <p className="text-sky-700 font-semibold">
                    Correct Answer: {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Test Section */}
      <div className="card-base p-8 md:p-12">
        <div className="section-header mb-10 flex items-center gap-4">
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
              className="input-base"
              disabled={scheduling}
            />
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="input-base"
              disabled={scheduling}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={scheduling || !scheduleTopic || !scheduleDate || !scheduleTime}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {scheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Schedule Test'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="btn-secondary px-6 py-3 flex items-center gap-2"
            >
              {cancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {scheduleSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>{scheduleSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
}
