/**
 * Translation Service - Italian to Persian translation using MyMemory API
 * Free API with no authentication required
 */

const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';
const TIMEOUT_MS = 5000; // 5 seconds timeout

/**
 * Translate text from Italian to Persian
 * @param {string} text - The Italian text to translate
 * @returns {Promise<{success: boolean, translation: string|null, error: string|null}>}
 */
export async function translateItToPe(text) {
  // Validate input
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return {
      success: false,
      translation: null,
      error: 'متن نامعتبر است'
    };
  }

  // Clean the text (remove punctuation for better translation)
  const cleanText = text.trim().replace(/[.,!?;:()"""''']+$/, '');

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Build API URL
    const url = `${MYMEMORY_API_URL}?q=${encodeURIComponent(cleanText)}&langpair=it|fa`;

    // Make API request
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });

    clearTimeout(timeoutId);

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    // Parse response
    const data = await response.json();

    // Check if translation was successful
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      return {
        success: true,
        translation: data.responseData.translatedText,
        error: null
      };
    } else {
      return {
        success: false,
        translation: null,
        error: 'ترجمه یافت نشد'
      };
    }
  } catch (error) {
    // Handle different error types
    if (error.name === 'AbortError') {
      return {
        success: false,
        translation: null,
        error: 'زمان درخواست تمام شد'
      };
    }

    console.error('Translation error:', error);
    return {
      success: false,
      translation: null,
      error: 'خطا در ترجمه'
    };
  }
}

/**
 * Check if a word is valid for translation
 * @param {string} word - The word to check
 * @returns {boolean}
 */
export function isValidWord(word) {
  if (!word || typeof word !== 'string') return false;
  
  // Remove punctuation and check if there's actual text
  const cleanWord = word.trim().replace(/[.,!?;:()"""''']+/g, '');
  
  // Must be at least 1 character and contain letters
  return cleanWord.length > 0 && /[a-zA-Zàèéìòù]/i.test(cleanWord);
}

