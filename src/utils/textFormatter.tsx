import React from 'react';

/**
 * Utility functions for formatting text with markdown-like syntax
 */

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Formats text with basic markdown-like syntax:
 * - **bold** → <strong>bold</strong>
 * - *italic* → <em>italic</em>
 * - Bulleted lists (lines starting with - or *)
 * - Numbered lists (lines starting with numbers)
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  const formatText = (input: string): React.ReactNode[] => {
    const lines = input.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
    let listCounter = 0;

    const processInlineFormatting = (line: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;

      while (remaining.length > 0) {
        // Bold text **text**
        const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
        if (boldMatch) {
          const beforeBold = remaining.substring(0, boldMatch.index);
          if (beforeBold) {
            parts.push(<span key={key++}>{beforeBold}</span>);
          }
          parts.push(<strong key={key++} className="font-bold">{boldMatch[1]}</strong>);
          remaining = remaining.substring((boldMatch.index || 0) + boldMatch[0].length);
          continue;
        }

        // Italic text *text*
        const italicMatch = remaining.match(/\*(.*?)\*/);
        if (italicMatch) {
          const beforeItalic = remaining.substring(0, italicMatch.index);
          if (beforeItalic) {
            parts.push(<span key={key++}>{beforeItalic}</span>);
          }
          parts.push(<em key={key++} className="italic">{italicMatch[1]}</em>);
          remaining = remaining.substring((italicMatch.index || 0) + italicMatch[0].length);
          continue;
        }

        // No more formatting found
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      }

      return parts;
    };

    const finishCurrentList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`list-${listCounter++}`} className="list-disc list-inside ml-4 space-y-1 my-2">
              {currentList.items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {processInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`list-${listCounter++}`} className="list-decimal list-inside ml-4 space-y-1 my-2">
              {currentList.items.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {processInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Empty line
      if (!trimmedLine) {
        finishCurrentList();
        elements.push(<br key={`br-${index}`} />);
        return;
      }

      // Bulleted list item
      if (trimmedLine.match(/^[-*]\s+/)) {
        const content = trimmedLine.replace(/^[-*]\s+/, '');
        if (currentList?.type !== 'ul') {
          finishCurrentList();
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(content);
        return;
      }

      // Numbered list item
      if (trimmedLine.match(/^\d+\.\s+/)) {
        const content = trimmedLine.replace(/^\d+\.\s+/, '');
        if (currentList?.type !== 'ol') {
          finishCurrentList();
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(content);
        return;
      }

      // Regular paragraph
      finishCurrentList();
      elements.push(
        <p key={`p-${index}`} className="mb-2 last:mb-0">
          {processInlineFormatting(trimmedLine)}
        </p>
      );
    });

    // Finish any remaining list
    finishCurrentList();

    return elements;
  };

  return (
    <div className={`formatted-text ${className}`}>
      {formatText(text)}
    </div>
  );
};

/**
 * Preview function to show how text will be formatted
 */
export const getFormattedPreview = (text: string): string => {
  if (!text) return '';
  
  // Simple preview - just show first few lines
  const lines = text.split('\n').slice(0, 3);
  return lines.join('\n') + (text.split('\n').length > 3 ? '...' : '');
};