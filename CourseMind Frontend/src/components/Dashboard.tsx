import { FileText, Calendar, ClipboardCheck, Sparkles, ArrowRight, Zap, Bell, Infinity } from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const features = [
    {
      title: 'AI-Generated Notes',
      description: 'Create comprehensive study notes on any topic using AI',
      icon: FileText,
      action: 'notes',
      delay: '0',
    },
    {
      title: 'Daily Practice Papers',
      description: 'Generate and schedule daily practice papers to stay consistent',
      icon: Calendar,
      action: 'dpp',
      delay: '100',
    },
    {
      title: 'Test Generation',
      description: 'Create and schedule tests with automated email reminders',
      icon: ClipboardCheck,
      action: 'tests',
      delay: '200',
    },
  ];

  const benefits = [
    { icon: Zap, title: 'AI-Powered Content', description: 'Advanced OpenAI models' },
    { icon: Infinity, title: 'Automatic Scheduling', description: 'Set it and forget it' },
    { icon: Bell, title: 'Email Reminders', description: 'Never miss a session' },
    { icon: FileText, title: 'Topic Flexibility', description: 'Any subject you choose' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-slideInUp">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50">
              <Sparkles className="w-10 h-10 text-sky-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              CourseMind AI
            </h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your learning with AI-powered study materials, practice papers, and tests.
            Stay consistent with intelligent scheduling and never miss a session with automatic reminders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.action}
                className="card-base p-8 group cursor-pointer hover:-translate-y-2"
                style={{ animationDelay: `${feature.delay}ms` }}
                onClick={() => onNavigate(feature.action)}
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-sky-400 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-sky-200 transition-all duration-500">
                    <Icon className="w-8 h-8 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-sky-600 font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-sky-600/20 rounded-3xl blur-2xl"></div>
          <div className="relative card-base bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl -mr-36 -mt-36"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-12">Why Choose CourseMind AI?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {benefits.map((benefit, idx) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500/20 group-hover:bg-sky-500/30 transition-all duration-300">
                          <BenefitIcon className="w-6 h-6 text-sky-300" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-1 group-hover:text-sky-300 transition-colors duration-300">
                          {benefit.title}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
