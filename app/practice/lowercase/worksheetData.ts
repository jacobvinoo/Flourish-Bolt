// app/practice/lowercase/worksheetData.ts

import { WorksheetStep } from '@/hooks/usePracticeLogic';

export const lowercaseWorkbookSteps: WorksheetStep[] = [
    { id: 'letter-a', title: 'Worksheet 2.1: Letter a', friendlyTitle: 'The letter a!', description: 'Practice the round body and short tail of the letter "a".', kidsDescription: "Let's draw a circle and give it a little tail to make an \"a\"!", level: 2, worksheetUrl: '/worksheets/letter-a.html', skills: ['Round shapes', 'Closing shapes', 'Short strokes'], estimatedTime: '10-15 minutes', color: 'from-red-400 to-red-600', emoji: 'a' },
    { id: 'letter-b', title: 'Worksheet 2.2: Letter b', friendlyTitle: 'The letter b!', description: 'Master the tall back and round belly of the letter "b".', kidsDescription: 'Draw a long line down, then give it a round tummy to make a "b"!', level: 2, worksheetUrl: '/worksheets/letter-b.html', skills: ['Tall strokes', 'Reversing curves'], estimatedTime: '10-15 minutes', color: 'from-orange-400 to-orange-600', emoji: 'b' },
    // ... (include all 26 letter objects here) ...
    { id: 'letter-z', title: 'Worksheet 2.26: Letter z', friendlyTitle: 'The letter z!', description: 'Master the shape with a top line, diagonal line, and bottom line.', kidsDescription: 'Draw a line across the top, a slanted line down, and a line across the bottom!', level: 2, worksheetUrl: '/worksheets/letter-z.html', skills: ['Horizontal strokes', 'Diagonal lines'], estimatedTime: '10-15 minutes', color: 'from-green-400 to-green-600', emoji: 'z' }
];