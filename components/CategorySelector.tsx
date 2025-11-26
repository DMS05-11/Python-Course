import React from 'react';
import { ResourceType } from '../types';
import { BookOpen, FileText, FlaskConical, Video, Rocket } from 'lucide-react';

interface CategorySelectorProps {
  selected: ResourceType;
  onSelect: (type: ResourceType) => void;
  disabled: boolean;
}

const icons = {
  [ResourceType.VIDEO_LECTURE]: Video,
  [ResourceType.WHITE_PAPER]: FileText,
  [ResourceType.NOTES]: BookOpen,
  [ResourceType.REAL_TIME_PROJECT]: Rocket,
  [ResourceType.HANDS_ON]: FlaskConical,
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="border-b border-slate-800/50 overflow-x-auto">
      <div className="flex space-x-1 min-w-max pb-1">
        {Object.values(ResourceType).map((type) => {
          const Icon = icons[type];
          const isSelected = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              disabled={disabled}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 outline-none
                ${isSelected 
                  ? 'border-brand-500 text-brand-400 bg-slate-900/30' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Icon className={`h-4 w-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};