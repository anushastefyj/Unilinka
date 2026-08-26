import React from 'react';
import Icon from './AppIcon';

// Mock Frequently Asked Topics Generator
const getMockFrequentlyAsked = (subject) => [
  { topic: `Core Architecture of ${subject}`, count: 4 },
  { topic: `Optimization Techniques`, count: 3 },
  { topic: `Real-world Use Cases`, count: 2 },
  { topic: `Differences between legacy & modern methods`, count: 1 }
];

const FrequentlyAskedPanel = ({ subject }) => {
  const topics = getMockFrequentlyAsked(subject);

  const getTagStyle = (count) => {
    if (count >= 3) return { label: 'High', color: 'bg-[#1F4D3A] text-white border-[#1F4D3A]' };
    if (count === 2) return { label: 'Medium', color: 'bg-[#EFE7D8] text-[#1F4D3A] border-[#EFE7D8]' };
    return { label: 'Low', color: 'bg-white text-[#5C5C5C] border-[#E7E2D6]' };
  };

  return (
    <div className="bg-[#FAF7F0] border border-[#E7E2D6] rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Target" size={20} className="text-[#1F4D3A]" />
        <h4 className="text-base font-bold text-[#1C1C1C] font-serif">Frequently Asked Topics</h4>
      </div>
      
      <p className="text-sm text-[#5C5C5C] mb-4">
        These topics have appeared repeatedly in past question papers for {subject}.
      </p>

      <div className="space-y-3">
        {topics.map((item, idx) => {
          const tag = getTagStyle(item.count);
          return (
            <div key={idx} className="flex items-center justify-between bg-white border border-[#E7E2D6] p-3 rounded-xl hover:border-[#1F4D3A]/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#1F4D3A] bg-[#EFE7D8] w-6 h-6 flex items-center justify-center rounded-md">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-[#1C1C1C]">{item.topic}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-[#5C5C5C]">
                  {item.count} {item.count === 1 ? 'year' : 'years'}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${tag.color}`}>
                  {tag.label} Weight
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FrequentlyAskedPanel;
