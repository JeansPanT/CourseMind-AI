import { useState } from 'react';
import { FileText, Loader2, Sparkles } from 'lucide-react';
import { apiService, NoteResponse } from '../services/api';

export default function Notes() {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState<NoteResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setNotes(null);

    const result = await apiService.generateNotes(topic);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      // Ensure result.data is always an array
      setNotes(Array.isArray(result.data) ? result.data : [result.data]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-slideInUp">
      <div className="card-base p-8 md:p-12">
        {/* Header */}
        <div className="section-header mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <FileText className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Generate Notes</h2>
            <p className="text-slate-500 text-sm mt-1">
              Create AI-powered study notes on any topic
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., Physics, Calculus, etc.)"
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
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Generate</span>
                  <span className="sm:hidden">Go</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6 animate-slideInDown">
            {error}
          </div>
        )}

        {/* Notes Display */}
        {notes && Array.isArray(notes) && notes.length > 0 && (
          <div className="animate-fadeIn space-y-6">
            {notes.map((note, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-8 border border-sky-200"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {note.topic}
                  </h3>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-xl p-6 border border-sky-200/50">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-light text-base">
                    {note.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {notes && notes.length === 0 && !loading && (
          <p className="text-center text-slate-500 mt-6">No notes found for this topic.</p>
        )}
      </div>
    </div>
  );
}
