import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategorySelector } from './components/CategorySelector';
import { ResultCard } from './components/ResultCard';
import { getCuratedContent } from './services/geminiService';
import { ResourceType, SearchResult } from './types';
import { Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // Default to Video Lectures as requested for the home page
  const [activeCategory, setActiveCategory] = useState<ResourceType>(ResourceType.VIDEO_LECTURE);
  
  // Cache content so we don't re-fetch when switching tabs
  const [contentCache, setContentCache] = useState<Partial<Record<ResourceType, SearchResult>>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      // If we already have data for this category, don't fetch again
      if (contentCache[activeCategory]) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getCuratedContent(activeCategory);
        const result: SearchResult = {
          text: data.text,
          groundingMetadata: data.groundingMetadata,
          category: activeCategory,
          query: activeCategory // Using category as query descriptor
        };
        
        setContentCache(prev => ({
          ...prev,
          [activeCategory]: result
        }));
      } catch (err) {
        setError("Unable to load trusted resources. Please try refreshing.");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [activeCategory, contentCache]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-brand-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between border-b border-slate-800 pb-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/30 border border-brand-800/50 text-brand-300 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Trusted Curriculum
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Python Mastery
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400 mt-1">
                From Basic to Advanced
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-400">
              Curated trusted resources, verified by AI. Access top-tier lectures, white papers, and notes instantly.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <CategorySelector 
            selected={activeCategory} 
            onSelect={setActiveCategory} 
            disabled={isLoading}
          />
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-in fade-in duration-500">
              <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
              <p className="text-slate-500 animate-pulse">Curating best {activeCategory.toLowerCase()} for you...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-900/10 border border-red-900/50 rounded-2xl text-center text-red-400">
              <p>{error}</p>
              <button 
                onClick={() => setContentCache(prev => {
                  const newCache = {...prev};
                  delete newCache[activeCategory];
                  return newCache;
                })} // Clear cache to force retry
                className="mt-4 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          ) : contentCache[activeCategory] ? (
            <ResultCard result={contentCache[activeCategory]!} />
          ) : null}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} PyAdvance Nexus. Trusted Resources powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;