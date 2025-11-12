import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect and manage text selection
 * Returns selected text and position for floating UI
 */
export default function useTextSelection() {
  const [selection, setSelection] = useState({
    text: '',
    isActive: false,
    position: { x: 0, y: 0 },
  });

  const handleSelectionChange = useCallback(() => {
    const selectedText = window.getSelection()?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        setSelection({
          text: selectedText,
          isActive: true,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.top - 10, // Position above selection
          },
        });
      }
    } else {
      setSelection({
        text: '',
        isActive: false,
        position: { x: 0, y: 0 },
      });
    }
  }, []);

  useEffect(() => {
    // Listen for selection changes
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('touchend', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setSelection({
      text: '',
      isActive: false,
      position: { x: 0, y: 0 },
    });
  }, []);

  return {
    selectedText: selection.text,
    isActive: selection.isActive,
    position: selection.position,
    clearSelection,
  };
}

