import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

export class ThemeLoader {
  private static instance: ThemeLoader;
  private supabase = createClientComponentClient<Database>();

  private constructor() {}

  static getInstance(): ThemeLoader {
    if (!ThemeLoader.instance) {
      ThemeLoader.instance = new ThemeLoader();
    }
    return ThemeLoader.instance;
  }

  async getUserDisplayMode(userId: string): Promise<'adult' | 'kid'> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('display_mode')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user display mode:', error);
        return 'adult'; // Default fallback
      }

      return data.display_mode as 'adult' | 'kid' || 'adult';
    } catch (error) {
      console.error('Error fetching user display mode:', error);
      return 'adult'; // Default fallback
    }
  }

  loadThemeCSS(displayMode: 'adult' | 'kid'): void {
    // Remove existing theme stylesheets
    const existingAdultCSS = document.getElementById('adult-theme-css');
    const existingKidsCSS = document.getElementById('kids-theme-css');
    
    if (existingAdultCSS) {
      existingAdultCSS.remove();
    }
    if (existingKidsCSS) {
      existingKidsCSS.remove();
    }

    // Create and append the appropriate stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.id = displayMode === 'adult' ? 'adult-theme-css' : 'kids-theme-css';
    link.href = displayMode === 'adult' ? '/globals-adult.css' : '/globals-kids.css';
    
    document.head.appendChild(link);

    // Add theme class to body
    document.body.className = document.body.className.replace(/\b(adult-mode|kids-mode)\b/g, '');
    document.body.classList.add(`${displayMode === 'adult' ? 'adult' : 'kids'}-mode`);
  }

  async initializeTheme(userId?: string): Promise<void> {
    if (!userId) {
      // Default to adult mode if no user
      this.loadThemeCSS('adult');
      return;
    }

    try {
      const displayMode = await this.getUserDisplayMode(userId);
      this.loadThemeCSS(displayMode);
    } catch (error) {
      console.error('Error initializing theme:', error);
      this.loadThemeCSS('adult'); // Fallback to adult mode
    }
  }
}

export const themeLoader = ThemeLoader.getInstance();