"use client";

import { useMemo, useCallback } from 'react';

/**
 * ContentRenderer - Parses content and makes vocabulary words clickable
 * @param {string} content - The lesson content text
 * @param {Array} vocabulary - Array of vocabulary objects with {word, ...}
 * @param {Function} onWordClick - Callback when a word is clicked
 */
export default function ContentRenderer({ content, vocabulary = [], onWordClick }) {
  // Sort vocabulary by word length (longest first) to avoid partial matches
  const sortedVocabulary = useMemo(() => {
    return [...vocabulary].sort((a, b) => b.word.length - a.word.length);
  }, [vocabulary]);

  // Parse content and identify vocabulary words
  const parsedContent = useMemo(() => {
    if (!content || vocabulary.length === 0) {
      return [{ type: 'text', content }];
    }

    let remainingText = content;
    const segments = [];
    const foundWords = new Set();

    // Create a map for quick word lookup
    const wordMap = new Map(vocabulary.map(v => [v.word.toLowerCase(), v]));

    // Split content into paragraphs
    const paragraphs = remainingText.split('\n\n');

    paragraphs.forEach((paragraph, pIndex) => {
      if (!paragraph.trim()) return;

      let currentText = paragraph;
      const paragraphSegments = [];

      // Find all vocabulary words in this paragraph
      sortedVocabulary.forEach(vocabItem => {
        const word = vocabItem.word;
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = [];
        let match;

        while ((match = regex.exec(currentText)) !== null) {
          matches.push({
            word: vocabItem,
            start: match.index,
            end: match.index + match[0].length,
            matchedText: match[0]
          });
        }

        matches.forEach(m => {
          if (!foundWords.has(`${m.start}-${m.end}`)) {
            foundWords.add(`${m.start}-${m.end}`);
          }
        });
      });

      // Convert found positions to segments
      const positions = Array.from(foundWords)
        .map(pos => {
          const [start, end] = pos.split('-').map(Number);
          const matchedText = currentText.substring(start, end);
          const vocabItem = wordMap.get(matchedText.toLowerCase());
          return { start, end, word: vocabItem };
        })
        .sort((a, b) => a.start - b.start);

      let lastIndex = 0;
      positions.forEach(pos => {
        // Add text before the word
        if (pos.start > lastIndex) {
          paragraphSegments.push({
            type: 'text',
            content: currentText.substring(lastIndex, pos.start)
          });
        }
        // Add the vocabulary word
        paragraphSegments.push({
          type: 'word',
          content: currentText.substring(pos.start, pos.end),
          word: pos.word
        });
        lastIndex = pos.end;
      });

      // Add remaining text
      if (lastIndex < currentText.length) {
        paragraphSegments.push({
          type: 'text',
          content: currentText.substring(lastIndex)
        });
      }

      // Add paragraph wrapper
      if (paragraphSegments.length > 0) {
        segments.push({
          type: 'paragraph',
          segments: paragraphSegments
        });
      }

      foundWords.clear();
    });

    return segments;
  }, [content, vocabulary, sortedVocabulary]);

  const handleWordClick = useCallback((word) => {
    if (onWordClick) {
      onWordClick(word);
    }
  }, [onWordClick]);

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-text-gray">محتوایی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="prose prose-sm sm:prose-base max-w-none">
      {parsedContent.map((item, index) => {
        if (item.type === 'paragraph') {
          return (
            <p key={index} className="mb-4 text-text-charcoal leading-8 text-justify">
              {item.segments.map((segment, segIndex) => {
                if (segment.type === 'word') {
                  return (
                    <button
                      key={segIndex}
                      onClick={() => handleWordClick(segment.word)}
                      className="font-bold text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-0.5"
                      type="button"
                      title={`کلیک کنید برای مشاهده تعریف "${segment.content}"`}
                    >
                      {segment.content}
                    </button>
                  );
                }
                return <span key={segIndex}>{segment.content}</span>;
              })}
            </p>
          );
        }

        if (item.type === 'text') {
          return (
            <p key={index} className="mb-4 text-text-charcoal leading-8 text-justify">
              {item.content}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

