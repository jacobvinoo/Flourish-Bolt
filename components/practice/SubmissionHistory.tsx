/components/practice/SubmissionHistory.tsx

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BookOpen, ImageOff, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Submission {
    id: string;
    worksheet_id: string;
    score: number;
    steadiness: number;
    accuracy: number;
    feedback: string | null;
    image_path: string;
    created_at: string;
}

interface SubmissionHistoryProps {
    submissions: Submission[];
    onDelete: (submissionId: string, imagePath: string) => void;
    deletingId: string | null;
}

export function SubmissionHistory({ submissions, onDelete, deletingId }: SubmissionHistoryProps) {
  const supabase = createClientComponentClient();
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (submissionId: string) => {
    setImageLoadErrors(prev => ({ ...prev, [submissionId]: true }));
  };
  
  return (
    <div className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-7 w-7 text-gray-400" />
        <h2 className="text-3xl font-bold text-gray-800">Submission History</h2>
      </div>
      <div className="space-y-4">
        {submissions.length > 0 ? (
          submissions.map((submission) => {
            const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(submission.image_path);
            const isDeleting = deletingId === submission.id;

            return (
              <div key={submission.id} className="p-6 bg-white rounded-2xl border flex items-center gap-6">
                <div className="relative w-32 h-32 rounded-lg border overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
                  {imageLoadErrors[submission.id] ? (
                    <div className="flex flex-col items-center justify-center h-full w-full p-2">
                      <ImageOff className="h-8 w-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center">Image not available</span>
                    </div>
                  ) : (
                    <img 
                      src={publicUrl} 
                      alt={`Submission for ${submission.worksheet_id}`} 
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(submission.id)}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-lg">Score: {submission.score}%</p>
                    <p className="text-xs text-gray-400">{new Date(submission.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <p className="text-sm text-blue-600">Steadiness: {submission.steadiness}%</p>
                    <p className="text-sm text-green-600">Accuracy: {submission.accuracy}%</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 p-3 bg-gray-50 rounded-md"><strong>Feedback:</strong> <em>"{submission.feedback}"</em></p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(submission.id, submission.image_path)}
                  disabled={isDeleting}
                  className="self-start"
                  aria-label="Delete submission"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border">
            <p className="text-gray-500">You haven't made any submissions for this worksheet yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}