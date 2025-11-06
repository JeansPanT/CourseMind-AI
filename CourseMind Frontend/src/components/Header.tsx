import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export default function Header({ currentSection, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'notes', label: 'Notes' },
    { id: 'dpp', label: 'DPP' },
    { id: 'tests', label: 'Tests' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-3 cursor-pointer group transition-all duration-300"
            onClick={() => handleNavClick('home')}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 group-hover:shadow-lg group-hover:shadow-sky-200 transition-all duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CourseMind AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  currentSection === item.id
                    ? 'bg-white text-sky-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50 animate-slideInDown">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-xl font-medium text-left transition-all duration-300 ${
                    currentSection === item.id
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
