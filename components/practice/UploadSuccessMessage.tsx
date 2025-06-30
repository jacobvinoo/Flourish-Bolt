//components/practice/UploadSuccessMessage.tsx

import { CheckCircle } from 'lucide-react';

interface UploadSuccessMessageProps {
    isKidsMode: boolean;
}

export function UploadSuccessMessage({ isKidsMode }: UploadSuccessMessageProps) {
    return (
        <div className={`mb-6 p-6 rounded-2xl flex items-center gap-4 animate-bounce shadow-lg ${isKidsMode ? 'bg-gradient-to-r from-green-100 to-emerald-100' : 'bg-green-50'}`}>
          <div className="flex-shrink-0">
              {isKidsMode ? <div className="text-4xl">🎉</div> : <CheckCircle className="h-8 w-8 text-green-500" />}
          </div>
          <div>
              <p className="font-bold text-lg text-green-800">🌟 Fantastic work! Your submission has been saved.</p>
              <p className="text-green-700">Moving to the next adventure... 🚀</p>
          </div>
        </div>
    );
}