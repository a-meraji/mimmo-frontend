// Mock lesson data with full content, vocabulary, and questions

const LESSONS_DATA = {
  "lesson-1": {
    id: "lesson-1",
    courseId: "espresso-1",
    title: "سلام و آشنایی",
    duration: "۱۲ دقیقه",
    status: "completed",
    image: "/es1.webp",
    content: `در این درس با مفهوم سلام و احوالپرسی در زبان ایتالیایی آشنا می‌شویم. کلمه Ciao یکی از رایج‌ترین کلمات برای سلام کردن است که در موقعیت‌های غیررسمی استفاده می‌شود.

همچنین کلمه Buongiorno برای گفتن صبح بخیر و Buonasera برای عصر بخیر به کار می‌رود. این کلمات در موقعیت‌های رسمی‌تر کاربرد دارند.

برای پرسیدن احوال می‌توانیم از عبارت "Come stai?" استفاده کنیم که معنی "حالت چطور است؟" را می‌دهد. در پاسخ می‌توانیم بگوییم "Bene, grazie" که یعنی "خوبم، متشکرم".

وقتی می‌خواهیم خودمان را معرفی کنیم، از عبارت "Mi chiamo" استفاده می‌کنیم که به معنای "اسم من است" می‌باشد. مثلاً: "Mi chiamo Marco" یعنی "اسم من مارکو است".`,
    vocabulary: [
      {
        id: "word-1",
        word: "Ciao",
        image: "/es1.webp",
        title: "چائو - سلام",
        definition: "کلمه غیررسمی برای سلام و خداحافظی در ایتالیایی. این کلمه در بین دوستان و آشنایان استفاده می‌شود و بسیار رایج است."
      },
      {
        id: "word-2",
        word: "Buongiorno",
        image: "/es1.webp",
        title: "بوون‌جورنو - صبح بخیر",
        definition: "عبارت رسمی برای گفتن صبح بخیر یا روز بخیر. از این عبارت تا ساعت ۱۲ ظهر استفاده می‌شود."
      },
      {
        id: "word-3",
        word: "Buonasera",
        image: "/es1.webp",
        title: "بوونا‌سرا - عصر بخیر",
        definition: "عبارت رسمی برای گفتن عصر بخیر یا شب بخیر. از این عبارت بعد از ساعت ۱۲ ظهر استفاده می‌شود."
      },
      {
        id: "word-4",
        word: "Come stai?",
        image: "/es1.webp",
        title: "کومه استای - حالت چطور است؟",
        definition: "سوال غیررسمی برای پرسیدن احوال. در موقعیت‌های رسمی از 'Come sta?' استفاده می‌شود."
      },
      {
        id: "word-5",
        word: "Bene, grazie",
        image: "/es1.webp",
        title: "بنه، گراتسیه - خوبم، متشکرم",
        definition: "پاسخ متداول به سوال احوالپرسی. 'Bene' به معنای خوب و 'grazie' به معنای متشکرم است."
      },
      {
        id: "word-6",
        word: "Mi chiamo",
        image: "/es1.webp",
        title: "می کیامو - اسم من است",
        definition: "عبارتی برای معرفی خود. بعد از این عبارت، نام خود را می‌گوییم."
      }
    ],
    questions: [
      {
        id: "q-1",
        text: "کدام کلمه برای سلام غیررسمی در ایتالیایی استفاده می‌شود؟",
        image: "/es1.webp",
        options: ["Ciao", "Buongiorno", "Buonasera", "Arrivederci"],
        correctIndex: 0,
        explanation: "Ciao کلمه غیررسمی برای سلام و خداحافظی است که در بین دوستان و آشنایان استفاده می‌شود."
      },
      {
        id: "q-2",
        text: "معنی 'Buongiorno' چیست؟",
        image: "/es1.webp",
        options: ["شب بخیر", "صبح بخیر", "عصر بخیر", "خداحافظ"],
        correctIndex: 1,
        explanation: "Buongiorno به معنای صبح بخیر یا روز بخیر است و تا ساعت ۱۲ ظهر استفاده می‌شود."
      },
      {
        id: "q-3",
        text: "برای پرسیدن احوال به صورت غیررسمی از کدام عبارت استفاده می‌کنیم؟",
        image: "/es1.webp",
        options: ["Come sta?", "Come stai?", "Che cosa?", "Dove sei?"],
        correctIndex: 1,
        explanation: "'Come stai?' سوال غیررسمی برای پرسیدن احوال است. 'Come sta?' حالت رسمی آن است."
      },
      {
        id: "q-4",
        text: "معنی 'Mi chiamo Marco' چیست؟",
        image: "/es1.webp",
        options: ["من مارکو را می‌شناسم", "اسم من مارکو است", "مارکو کجاست؟", "من مارکو را دوست دارم"],
        correctIndex: 1,
        explanation: "'Mi chiamo' به معنای 'اسم من است' می‌باشد و برای معرفی خود استفاده می‌شود."
      },
      {
        id: "q-5",
        text: "کدام پاسخ برای سوال 'Come stai?' مناسب است؟",
        image: "/es1.webp",
        options: ["Ciao", "Bene, grazie", "Mi chiamo", "Buongiorno"],
        correctIndex: 1,
        explanation: "'Bene, grazie' به معنای 'خوبم، متشکرم' است و پاسخ متداول به سوال احوالپرسی می‌باشد."
      }
    ]
  },
  "lesson-2": {
    id: "lesson-2",
    courseId: "espresso-1",
    title: "معرفی خود",
    duration: "۱۰ دقیقه",
    status: "completed",
    image: "/es1.webp",
    content: `در این درس یاد می‌گیریم چگونه خودمان را به طور کامل معرفی کنیم. علاوه بر گفتن نام، می‌توانیم درباره محل زندگی و شغل خود نیز صحبت کنیم.

برای گفتن محل سکونت از عبارت "Abito a" استفاده می‌کنیم که به معنای "من در ... زندگی می‌کنم" است. مثلاً: "Abito a Roma" یعنی "من در رم زندگی می‌کنم".

برای معرفی شغل خود می‌توانیم از "Sono" استفاده کنیم که به معنای "من هستم" است. مثلاً: "Sono studente" یعنی "من دانشجو هستم".`,
    vocabulary: [
      {
        id: "word-7",
        word: "Abito a",
        image: "/es1.webp",
        title: "آبیتو آ - من در ... زندگی می‌کنم",
        definition: "عبارتی برای گفتن محل سکونت. بعد از این عبارت، نام شهر یا کشور را می‌گوییم."
      },
      {
        id: "word-8",
        word: "Sono",
        image: "/es1.webp",
        title: "سونو - من هستم",
        definition: "فعل بودن در زبان ایتالیایی برای اول شخص مفرد. برای معرفی شغل یا وضعیت استفاده می‌شود."
      },
      {
        id: "word-9",
        word: "Studente",
        image: "/es1.webp",
        title: "استودنته - دانشجو",
        definition: "کلمه‌ای برای دانشجو. برای دانشجوی خانم از 'Studentessa' استفاده می‌شود."
      }
    ],
    questions: [
      {
        id: "q-6",
        text: "برای گفتن محل سکونت از کدام عبارت استفاده می‌کنیم؟",
        image: "/es1.webp",
        options: ["Mi chiamo", "Abito a", "Sono", "Come stai"],
        correctIndex: 1,
        explanation: "'Abito a' به معنای 'من در ... زندگی می‌کنم' است و برای معرفی محل سکونت استفاده می‌شود."
      },
      {
        id: "q-7",
        text: "معنی 'Sono studente' چیست؟",
        image: "/es1.webp",
        options: ["من معلم هستم", "من دانشجو هستم", "من دکتر هستم", "من مهندس هستم"],
        correctIndex: 1,
        explanation: "'Sono' به معنای 'من هستم' و 'studente' به معنای 'دانشجو' است."
      }
    ]
  },
  "lesson-3": {
    id: "lesson-3",
    courseId: "espresso-1",
    title: "پرسیدن احوال",
    duration: "۱۳ دقیقه",
    status: "completed",
    image: "/es1.webp",
    content: `در این درس با روش‌های مختلف پرسیدن احوال و پاسخ دادن به آن آشنا می‌شویم. علاوه بر "Come stai?" می‌توانیم از عبارات دیگری نیز استفاده کنیم.

عبارت "Come va?" نیز برای پرسیدن احوال به کار می‌رود و به معنای "چطور پیش می‌رود؟" است. پاسخ‌های مختلفی مانند "Bene" (خوب)، "Male" (بد)، یا "Così così" (نه خوب نه بد) وجود دارد.`,
    vocabulary: [
      {
        id: "word-10",
        word: "Come va?",
        image: "/es1.webp",
        title: "کومه وا - چطور پیش می‌رود؟",
        definition: "سوال دیگری برای پرسیدن احوال که کمی غیررسمی‌تر است."
      },
      {
        id: "word-11",
        word: "Male",
        image: "/es1.webp",
        title: "ماله - بد",
        definition: "کلمه‌ای برای بیان حال بد. در پاسخ به سوال احوالپرسی استفاده می‌شود."
      },
      {
        id: "word-12",
        word: "Così così",
        image: "/es1.webp",
        title: "کوزی کوزی - نه خوب نه بد",
        definition: "عبارتی برای بیان حال متوسط. به معنای 'همین‌طور' یا 'نه خوب نه بد' است."
      }
    ],
    questions: [
      {
        id: "q-8",
        text: "کدام عبارت برای پرسیدن احوال به صورت غیررسمی‌تر استفاده می‌شود؟",
        image: "/es1.webp",
        options: ["Come sta?", "Come stai?", "Come va?", "Che cosa?"],
        correctIndex: 2,
        explanation: "'Come va?' عبارت غیررسمی‌تری برای پرسیدن احوال است و به معنای 'چطور پیش می‌رود؟' می‌باشد."
      }
    ]
  }
};

/**
 * Get lesson data by lesson ID
 * @param {string} lessonId - The lesson ID
 * @returns {Object|null} Lesson data or null if not found
 */
export function getLessonById(lessonId) {
  return LESSONS_DATA[lessonId] || null;
}

/**
 * Get all questions for a specific lesson
 * @param {string} lessonId - The lesson ID
 * @returns {Array} Array of questions
 */
export function getQuestionsForLesson(lessonId) {
  const lesson = getLessonById(lessonId);
  return lesson?.questions || [];
}

/**
 * Get all lessons for a specific course
 * @param {string} courseId - The course ID
 * @returns {Array} Array of lessons
 */
export function getAllLessonsForCourse(courseId) {
  return Object.values(LESSONS_DATA).filter(lesson => lesson.courseId === courseId);
}

/**
 * Get vocabulary words for a specific lesson
 * @param {string} lessonId - The lesson ID
 * @returns {Array} Array of vocabulary words
 */
export function getVocabularyForLesson(lessonId) {
  const lesson = getLessonById(lessonId);
  return lesson?.vocabulary || [];
}

/**
 * Filter questions based on test configuration
 * @param {Array} questions - Array of questions
 * @param {Object} stats - Question statistics object
 * @param {string} mixture - Question mixture type ('all', 'wrong', 'non-answered', 'doubtful', 'combined')
 * @returns {Array} Filtered questions
 */
export function filterQuestionsByMixture(questions, stats, mixture) {
  if (mixture === 'all') {
    return questions;
  }

  return questions.filter(question => {
    const questionStats = stats[question.id];
    
    // If no stats exist, treat as non-answered
    if (!questionStats || questionStats.totalAttempts === 0) {
      return mixture === 'non-answered' || mixture === 'combined';
    }

    const hasWrong = questionStats.wrong > 0;
    const hasDoubt = questionStats.doubt > 0;

    switch (mixture) {
      case 'wrong':
        return hasWrong;
      case 'non-answered':
        return false; // Already has attempts
      case 'doubtful':
        return hasDoubt;
      case 'combined':
        return hasWrong || hasDoubt;
      default:
        return true;
    }
  });
}

/**
 * Get questions for test based on configuration
 * @param {Object} config - Test configuration
 * @param {Object} stats - Question statistics
 * @returns {Array} Array of questions for the test
 */
export function getQuestionsForTest(config, stats) {
  let allQuestions = [];

  // Get questions based on scope
  if (config.includeScope === 'this-lesson') {
    allQuestions = getQuestionsForLesson(config.lessonId);
  } else {
    // Include current lesson and selected previous lessons
    const lessonIds = [config.lessonId, ...(config.previousLessons || [])];
    lessonIds.forEach(lessonId => {
      allQuestions = [...allQuestions, ...getQuestionsForLesson(lessonId)];
    });
  }

  // Filter by mixture logic
  const filteredQuestions = filterQuestionsByMixture(
    allQuestions,
    stats,
    config.questionMixture
  );

  // Limit to requested count and shuffle
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, config.questionCount);
}

export default {
  getLessonById,
  getQuestionsForLesson,
  getAllLessonsForCourse,
  getVocabularyForLesson,
  filterQuestionsByMixture,
  getQuestionsForTest
};

