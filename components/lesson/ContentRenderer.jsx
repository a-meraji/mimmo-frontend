"use client";

import { useMemo, useCallback } from 'react';

/**
 * ContentRenderer - Parses content and makes all words clickable
 * @param {string} content - The lesson content text
 * @param {Array} vocabulary - Array of vocabulary objects with {word, ...}
 * @param {Function} onWordClick - Callback when a vocabulary word is clicked
 * @param {Function} onRegularWordClick - Callback when a regular (non-vocabulary) word is clicked
 */
export default function ContentRenderer({ content, vocabulary = [], onWordClick, onRegularWordClick }) {
  // Create a vocabulary lookup map for fast checking
  const vocabMap = useMemo(() => {
    const map = new Map();
    vocabulary.forEach(v => {
      map.set(v.word.toLowerCase(), v);
    });
    return map;
  }, [vocabulary]);

  // Parse content and make ALL words clickable
  const parsedContent = useMemo(() => {
    if (!content) {
      return [];
    }

    const segments = [];
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');

    paragraphs.forEach((paragraph, pIndex) => {
      if (!paragraph.trim()) return;

      // Split paragraph into tokens (words, spaces, and punctuation)
      // This regex captures: words (including Italian accents), spaces, and punctuation separately
      const tokens = paragraph.split(/(\s+|[.,!?;:()"""'''«»—–\-]+)/);
      
      const paragraphSegments = [];

      tokens.forEach((token, tokenIndex) => {
        if (!token) return;

        // Check if token is whitespace or punctuation only
        if (/^[\s.,!?;:()"""'''«»—–\-]+$/.test(token)) {
          paragraphSegments.push({
            type: 'punctuation',
            content: token
          });
          return;
        }

        // Token is a word - check if it's vocabulary or regular
        const cleanWord = token.toLowerCase().trim();
        const vocabItem = vocabMap.get(cleanWord);

        if (vocabItem) {
          // This is a vocabulary word
          paragraphSegments.push({
            type: 'vocab-word',
            content: token,
            word: vocabItem
          });
        } else if (/[a-zA-Zàèéìòù]/.test(token)) {
          // This is a regular word (contains at least one letter)
          paragraphSegments.push({
            type: 'regular-word',
            content: token
          });
        } else {
          // Something else (numbers, symbols, etc.)
          paragraphSegments.push({
            type: 'text',
            content: token
          });
        }
      });

      // Add paragraph wrapper
      if (paragraphSegments.length > 0) {
        segments.push({
          type: 'paragraph',
          segments: paragraphSegments
        });
      }
    });

    return segments;
  }, [content, vocabMap]);

  const handleVocabWordClick = useCallback((word) => {
    if (onWordClick) {
      onWordClick(word);
    }
  }, [onWordClick]);

  const handleRegularWordClickInternal = useCallback((word) => {
    if (onRegularWordClick) {
      onRegularWordClick(word);
    }
  }, [onRegularWordClick]);

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-text-gray">محتوایی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="prose max-w-none">
      {parsedContent.map((item, index) => {
        if (item.type === 'paragraph') {
          return (
            <p key={index} className="mb-5 lg:mb-6 text-base lg:text-base text-text-charcoal leading-8 lg:leading-9 text-justify">
              {item.segments.map((segment, segIndex) => {
                // Vocabulary word - bold, primary color, clickable with hover tooltip
                if (segment.type === 'vocab-word') {
                  return (
                    <span key={segIndex} className="relative inline-block group">
                      <button
                        onClick={() => handleVocabWordClick(segment.word)}
                        className="font-bold text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-0.5 text-base lg:text-base touch-manipulation"
                        type="button"
                        aria-label={`${segment.content}: ${segment.word.definition}`}
                      >
                        {segment.content}
                      </button>
                      {/* Hover Tooltip - Desktop only */}
                      <span className="invisible group-hover:visible min-w-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-text-charcoal text-white text-xs rounded-lg shadow-lg whitespace-normal z-50 pointer-events-none hidden lg:block">
                        {segment.word.definition}
                        {/* Tooltip arrow */}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-text-charcoal"></span>
                      </span>
                    </span>
                  );
                }

                // Regular word - subtle, underline on hover, clickable for translation
                if (segment.type === 'regular-word') {
                  return (
                    <button
                      key={segIndex}
                      onClick={() => handleRegularWordClickInternal(segment.content)}
                      className="text-text-charcoal hover:text-primary/70 hover:underline cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-0.5 text-base lg:text-base touch-manipulation"
                      type="button"
                      title={`کلیک کنید برای ترجمه "${segment.content}"`}
                    >
                      {segment.content}
                    </button>
                  );
                }

                // Punctuation and other text - not clickable
                return <span key={segIndex}>{segment.content}</span>;
              })}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

