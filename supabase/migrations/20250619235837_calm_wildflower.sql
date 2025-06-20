/*
  # Create Sample Exercise Data

  1. Sample Data
    - Add 8 sample exercises with varying difficulty levels
    - Include different font styles and descriptions
    - Cover beginner to expert levels
    - Provide realistic worksheet URLs (placeholder paths)

  2. Exercise Categories
    - Basic strokes and shapes (Level 1-2)
    - Letter formation (Level 3-4)
    - Word practice (Level 5-6)
    - Sentence writing (Level 7-8)
    - Paragraph composition (Level 9-10)

  3. Font Styles
    - Zaner-Bloser
    - D'Nealian
    - Handwriting Without Tears (HWT)
*/

-- Insert sample exercises
INSERT INTO public.exercises (title, description, level, font_style, worksheet_pdf_url) VALUES
(
  'Basic Strokes and Lines',
  'Practice fundamental handwriting strokes including vertical lines, horizontal lines, and curved strokes. This foundational exercise helps develop proper pencil control and muscle memory.',
  1,
  'zaner_bloser',
  'https://example.com/worksheets/basic-strokes.pdf'
),
(
  'Circle and Oval Practice',
  'Master the art of drawing perfect circles and ovals. These shapes form the foundation for many letters and are essential for developing smooth, flowing handwriting.',
  2,
  'zaner_bloser',
  'https://example.com/worksheets/circles-ovals.pdf'
),
(
  'Lowercase Letter Formation',
  'Learn proper formation of lowercase letters a-z. Focus on correct starting points, stroke direction, and letter proportions using the Zaner-Bloser method.',
  3,
  'zaner_bloser',
  'https://example.com/worksheets/lowercase-letters.pdf'
),
(
  'Uppercase Letter Practice',
  'Practice writing uppercase letters A-Z with proper formation and consistent sizing. Emphasis on maintaining appropriate height relationships.',
  4,
  'dnealian',
  'https://example.com/worksheets/uppercase-letters.pdf'
),
(
  'Simple Word Writing',
  'Combine letters to form simple 3-5 letter words. Focus on consistent letter spacing and maintaining baseline alignment throughout each word.',
  5,
  'dnealian',
  'https://example.com/worksheets/simple-words.pdf'
),
(
  'Sentence Construction',
  'Write complete sentences with proper capitalization and punctuation. Practice maintaining consistent slant and spacing between words.',
  6,
  'hwt',
  'https://example.com/worksheets/sentences.pdf'
),
(
  'Cursive Letter Connections',
  'Advanced practice connecting cursive letters smoothly. Focus on proper entry and exit strokes for seamless letter-to-letter transitions.',
  7,
  'dnealian',
  'https://example.com/worksheets/cursive-connections.pdf'
),
(
  'Paragraph Composition',
  'Write complete paragraphs maintaining consistent handwriting throughout. Advanced exercise focusing on endurance and consistency over longer texts.',
  8,
  'zaner_bloser',
  'https://example.com/worksheets/paragraphs.pdf'
),
(
  'Speed Writing Challenge',
  'Timed writing exercises to improve both speed and legibility. Practice writing common phrases and sentences under time constraints.',
  9,
  'hwt',
  'https://example.com/worksheets/speed-writing.pdf'
),
(
  'Master Calligraphy',
  'Expert-level handwriting with focus on artistic flourishes and perfect letter formation. Suitable for advanced students seeking calligraphy skills.',
  10,
  'zaner_bloser',
  'https://example.com/worksheets/calligraphy.pdf'
);