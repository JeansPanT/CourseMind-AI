import { Heart, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-t border-slate-200/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Author Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-sm">Created</span>
              <span className="text-slate-600 text-sm">by</span>
              <span className="font-semibold text-slate-900">Siddharth Kar & Divyanshu Dwivedi</span>
            </div>
            <p className="text-xs text-slate-500 text-center md:text-left">
              IMCA 7th Sem - Minor Project
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/JeansPanT"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/siddharth-kar-460b471a4"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:siddhukar39@gmail.com"
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Trademark & Copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-sm font-medium text-slate-900">
              CourseMind AI™
            </p>
            <p className="text-xs text-slate-500">
              © {currentYear} All rights reserved
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 pt-6 border-t border-slate-200/50">
          <p className="text-center text-xs text-slate-500">
            Built with React, TypeScript, SpringBoot and OlamaAI • Designed for all types of learners</p>
        </div>
      </div>
    </footer>
  );
}