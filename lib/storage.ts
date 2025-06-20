import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

export class StorageService {
  private supabase = createClientComponentClient<Database>();

  async uploadSubmissionImage(
    file: File,
    userId: string,
    submissionId: string
  ): Promise<{ url: string; path: string } | null> {
    try {
      // Get file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
        throw new Error('Invalid file type. Please upload a JPEG or PNG image.');
      }

      // Create file path: user_id/submission_id.ext
      const filePath = `${userId}/${submissionId}.${fileExt}`;

      // Upload file to submissions bucket
      const { data, error } = await this.supabase.storage
        .from('submissions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting if file exists
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }

  async deleteSubmissionImage(filePath: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from('submissions')
        .remove([filePath]);

      if (error) {
        console.error('Storage delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  getPublicUrl(filePath: string): string {
    const { data } = this.supabase.storage
      .from('submissions')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
}

export const storageService = new StorageService();