import React from 'react';
import { SearchResult } from '../types';
import { ExternalLink, Quote, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';

interface ResultCardProps {
  result: SearchResult;
}

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  // Format the text to handle basic markdown-like headers and lists visually
  const formattedText = result.text.split('\n').map((line, idx) => {
    if (line.startsWith('## ')) {
      return (
        <div key={idx} className="flex items-center gap-2 mt-8 mb-4 pb-2 border-b border-slate-700/50">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h3 className="text-xl font-bold text-white">{line.replace('## ', '')}</h3>
        </div>
      );
    }
    if (line.startsWith('### ')) {
      return <h4 key={idx} className="text-lg font-semibold text-brand-300 mt-6 mb-3">{line.replace('### ', '')}</h4>;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={idx} className="ml-4 mb-2 text-slate-300 list-disc pl-2 marker:text-brand-500">{line.replace(/^[-*] /, '')}</li>;
    }
    if (line.trim() === '') {
      return <div key={idx} className="h-2" />;
    }
    // Bold text handling
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} className="mb-2 text-slate-300 leading-relaxed">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-brand-100 font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });

  const sources = result.groundingMetadata?.groundingChunks?.filter(c => c.web);
  const videoSources = sources?.filter(c => c.web?.uri && getYouTubeId(c.web.uri));
  const textSources = sources?.filter(c => c.web?.uri && !getYouTubeId(c.web.uri));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Featured Video Grid (Only if videos are found) */}
      {videoSources && videoSources.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-brand-400" />
            Featured Trusted Lectures
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoSources.map((chunk, idx) => {
               const videoId = getYouTubeId(chunk.web!.uri);
               return (
                 <a
                  key={`video-${idx}`}
                  href={chunk.web?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500 transition-all shadow-lg hover:shadow-brand-500/20"
                 >
                   {videoId && (
                     <div className="aspect-video w-full overflow-hidden bg-slate-950 relative">
                       <img 
                         src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                         alt={chunk.web?.title}
                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                       />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-colors">
                         <div className="w-12 h-12 rounded-full bg-brand-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <PlayCircle className="h-6 w-6 text-white fill-white" />
                         </div>
                       </div>
                     </div>
                   )}
                   <div className="p-4">
                     <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-brand-300 transition-colors">
                       {chunk.web?.title}
                     </h4>
                   </div>
                 </a>
               );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Text Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="prose prose-invert max-w-none">
              {formattedText}
            </div>
          </div>
        </div>

        {/* Sidebar - References */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            {textSources && textSources.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Recommended Readings
                </h3>
                <div className="space-y-3">
                  {textSources.map((chunk, idx) => (
                    <a
                      key={idx}
                      href={chunk.web?.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500/50 transition-all duration-200 shadow-sm hover:shadow-md">
                        <h4 className="text-emerald-300 font-medium text-sm mb-2 line-clamp-2 group-hover:text-emerald-200">
                          {chunk.web?.title || "Unknown Source"}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="truncate max-w-[200px]">{chunk.web?.uri ? new URL(chunk.web.uri).hostname : 'web'}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Quote className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <p>
                  Resources are curated using Google Search Grounding to ensure relevance and trust. 
                  View counts and popularity are verified at the time of generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};