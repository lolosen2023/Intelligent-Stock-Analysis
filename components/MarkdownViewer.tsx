
import React, { useState } from 'react';
import { TechnicalPatternsModal } from './TechnicalPatternsModal';

interface MarkdownViewerProps {
  content: string;
}

const PATTERNS_REGEX = /(双底|W底|双顶|M头|头肩顶|头肩底|金叉|死叉|顶背离|底背离|圆弧底|圆弧顶|早晨之星|黄昏之星|红三兵|三只乌鸦|上升三角形|下降三角形|对称三角形|上升楔形|下降楔形|旗形|矩形整理|高位揉搓线|断头铡刀|仙人指路|老鸭头|多方炮|空方炮)/;

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  const [showPatternsModal, setShowPatternsModal] = useState(false);

  if (!content) return null;

  // Pattern Highlighter (Inline)
  const PatternText = ({ text }: { text: string }) => {
    const parts = text.split(PATTERNS_REGEX);
    return (
      <>
        {parts.map((part, i) => {
          if (PATTERNS_REGEX.test(part)) {
            return (
              <span key={`pat-${i}`} className="inline-flex items-center mx-0.5 align-baseline group cursor-help" onClick={(e) => { e.preventDefault(); setShowPatternsModal(true); }}>
                <span className="text-emerald-300 font-bold border-b-2 border-emerald-500/50 group-hover:text-emerald-200 group-hover:border-emerald-400 transition-colors">{part}</span>
              </span>
            );
          }
          return part;
        })}
      </>
    );
  };

  const formatInline = (text: string) => {
    // Handle bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold"><PatternText text={part.slice(2, -2)} /></strong>;
      }
      return <span key={i}><PatternText text={part} /></span>;
    });
  };

  const renderTable = (rows: string[]) => {
    if (rows.length < 2) return null;
    const headers = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
    const dataRows = rows.slice(2).map(row => row.split('|').filter(c => c.trim()).map(c => c.trim()));

    return (
      <div className="overflow-x-auto my-3 rounded-lg border border-slate-700 bg-slate-900/80">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-4 py-2 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-800/30">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 text-slate-300 whitespace-nowrap">{formatInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- New Card-Based Renderer Logic ---
  
  // Splitting content into "Sections" based on Headers
  const sections = content.split(/(?=### )/g);

  const renderSection = (section: string, index: number) => {
    const lines = section.trim().split('\n');
    const headerLine = lines[0];
    const bodyLines = lines.slice(1);
    
    // Determine Section Type for Styling
    let cardStyle = "border-slate-800 bg-slate-900/50"; // Default
    let headerColor = "text-white";
    
    if (headerLine.includes("风险") || headerLine.includes("Risk")) {
      cardStyle = "border-rose-900/50 bg-rose-950/10";
      headerColor = "text-rose-400";
    } else if (headerLine.includes("策略") || headerLine.includes("Strategy")) {
      cardStyle = "border-emerald-900/50 bg-emerald-950/10";
      headerColor = "text-emerald-400";
    } else if (headerLine.includes("形态") || headerLine.includes("Pattern")) {
      cardStyle = "border-blue-900/50 bg-blue-950/10";
      headerColor = "text-blue-400";
    }

    const isPatternSection = headerLine.includes("形态") || headerLine.includes("Pattern");

    // Process Body Content (Tables vs Text)
    const renderBody = () => {
      const elements = [];
      let tableBuffer: string[] = [];
      let inTable = false;

      for (let i = 0; i < bodyLines.length; i++) {
        const line = bodyLines[i].trim();
        if (line.startsWith('|')) {
          inTable = true;
          tableBuffer.push(line);
        } else {
          if (inTable) {
            elements.push(<div key={`table-${i}`}>{renderTable(tableBuffer)}</div>);
            tableBuffer = [];
            inTable = false;
          }
          if (line) {
             if (line.startsWith('- ') || line.startsWith('* ')) {
                elements.push(
                  <div key={i} className="flex items-start ml-2 mb-1">
                    <span className={`mr-2 mt-1.5 w-1 h-1 rounded-full ${headerColor.replace('text-', 'bg-')}`}></span>
                    <span className="text-slate-300 text-sm leading-relaxed">{formatInline(line.substring(2))}</span>
                  </div>
                );
             } else {
                elements.push(<p key={i} className="mb-2 text-slate-300 text-sm leading-relaxed">{formatInline(line)}</p>);
             }
          }
        }
      }
      if (inTable) elements.push(<div key="table-end">{renderTable(tableBuffer)}</div>);
      return elements;
    };

    // If it's a Header Section (starts with ###)
    if (headerLine.startsWith('### ')) {
      const title = headerLine.replace('### ', '').trim();
      return (
        <div key={index} className={`rounded-xl border p-4 mb-4 transition-all hover:shadow-lg hover:shadow-slate-900/50 ${cardStyle}`}>
          <div className="flex justify-between items-center mb-3">
             <h3 className={`text-base md:text-lg font-bold flex items-center gap-2 ${headerColor}`}>
               {formatInline(title)}
             </h3>
             {isPatternSection && (
                <button
                  onClick={(e) => { e.preventDefault(); setShowPatternsModal(true); }}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>形态图解</span>
                </button>
             )}
          </div>
          <div className="space-y-1">
            {renderBody()}
          </div>
        </div>
      );
    } else {
      // Intro text or content without a header
      return (
        <div key={index} className="mb-4 text-slate-300 text-sm leading-relaxed px-2">
          {section.split('\n').map((line, i) => line ? <p key={i} className="mb-2">{formatInline(line)}</p> : <br key={i}/>)}
        </div>
      );
    }
  };

  return (
    <>
      <TechnicalPatternsModal isOpen={showPatternsModal} onClose={() => setShowPatternsModal(false)} />
      <div className="animate-fade-in">
        {sections.map((section, idx) => renderSection(section, idx))}
      </div>
    </>
  );
};
