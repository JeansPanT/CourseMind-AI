import { useState } from 'react';
import { Calendar, Loader2, X, Clock, CheckCircle2 } from 'lucide-react';
import { apiService, DPPResponse, ScheduleDPPRequest } from '../services/api';

export default function DPP() {
  const [topic, setTopic] = useState('');
  const [dpp, setDpp] = useState<DPPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setDpp(null);

    const result = await apiService.generateDPP(topic);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setDpp(result.data);
    }

    setLoading(false);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTopic.trim() || !scheduleTime.trim()) return;

    setScheduling(true);
    setError('');
    setScheduleSuccess('');

    const scheduleData: ScheduleDPPRequest = {
      topic: scheduleTopic,
      time: scheduleTime,
    };

    const result = await apiService.scheduleDPP(scheduleData);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setScheduleSuccess(`DPP scheduled successfully for ${scheduleTopic}`);
      setScheduleTopic('');
      setScheduleTime('');
    }

    setScheduling(false);
  };

  const handleCancel = async () => {
    setCancelling(true);
    setError('');
    setScheduleSuccess('');

    const result = await apiService.cancelScheduledDPP();

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setScheduleSuccess(result.data.message);
    }

    setCancelling(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slideInUp">
      <div className="card-base p-8 md:p-12">
        <div className="section-header mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <Calendar className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Daily Practice Paper</h2>
            <p className="text-slate-500 text-sm mt-1">Generate practice questions for consistent learning</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic for DPP"
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

        {dpp && (
          <div className="animate-fadeIn">
            <div className="mb-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <h3 className="text-2xl font-semibold text-slate-900">{dpp.topic}</h3>
            </div>
            <div className="space-y-3">
              {dpp.questions.map((q, idx) => (
                <div key={idx} className="card-base p-5 hover:-translate-y-1 group cursor-pointer">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-sky-50 group-hover:shadow-lg group-hover:shadow-sky-200 transition-all duration-300">
                        <span className="text-sm font-semibold text-sky-600">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 mb-2">
                        {q.question}
                      </p>
                      {q.options && q.options.length > 0 && (
                        <div className="space-y-1 ml-2">
                          {q.options.map((option, optIdx) => (
                            <div key={optIdx} className="text-slate-600 text-sm pl-3 border-l-2 border-slate-200">
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.answer && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-sky-50 to-sky-100/50 rounded-lg border border-sky-200">
                          <p className="text-sm text-sky-700 font-semibold">
                            Correct Answer: {q.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-base p-8 md:p-12">
        <div className="section-header mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <Clock className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Schedule DPP</h2>
            <p className="text-slate-500 text-sm mt-1">Automate daily practice papers with email reminders</p>
          </div>
        </div>

        <form onSubmit={handleSchedule} className="mb-8">
          <div className="space-y-4">
            <input
              type="text"
              value={scheduleTopic}
              onChange={(e) => setScheduleTopic(e.target.value)}
              placeholder="Topic for scheduled DPP"
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
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={scheduling || !scheduleTopic.trim() || !scheduleTime.trim()}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {scheduling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Schedule DPP
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
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5" />
                    <span className="hidden sm:inline">Cancel</span>
                  </>
                )}
              </button>
            </div>
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
