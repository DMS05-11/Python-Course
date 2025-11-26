import React from 'react';
import { Terminal, Github } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-600 rounded-lg shadow-[0_0_15px_rgba(2,132,199,0.5)]">
              <Terminal className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              PyAdvance Nexus
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-brand-400 transition-colors">Resources</a>
            <a href="#" className="hover:text-brand-400 transition-colors">Experiments</a>
            <a href="#" className="hover:text-brand-400 transition-colors">Whitepapers</a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};