'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const [displayMode, setDisplayMode] = useState<'adult' | 'kid'>('adult');
  const supabase = createClientComponentClient<Database>();

  /*
  useEffect(() => {
    setMounted(true);
    
    const initializeTheme = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('display_mode')
            .eq('id', user.id)
            .single();

          if (!error && data && data.display_mode) {
            const mode = (data.display_mode as 'adult' | 'kid') || 'adult';
            console.log('Setting display mode to:', mode);
            setDisplayMode(mode);
            applyTheme(mode);
          } else {
            console.log('No profile found or no display_mode set, using adult mode');
            applyTheme('adult');
          }
        } else {
          console.log('No user found, using adult mode');
          applyTheme('adult');
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
        applyTheme('adult');
      }
    };

    const applyTheme = (mode: 'adult' | 'kid') => {
      console.log('Applying theme:', mode);
      
      // Remove existing theme classes
      document.body.classList.remove('adult-mode', 'kids-mode');
      
      // Add new theme class
      document.body.classList.add(`${mode === 'adult' ? 'adult' : 'kids'}-mode`);
      
      // Remove existing theme stylesheets
      const existingAdultCSS = document.getElementById('adult-theme-css');
      const existingKidsCSS = document.getElementById('kids-theme-css');
      
      if (existingAdultCSS) existingAdultCSS.remove();
      if (existingKidsCSS) existingKidsCSS.remove();

      // Create and append the appropriate stylesheet
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.id = mode === 'adult' ? 'adult-theme-css' : 'kids-theme-css';
      link.href = mode === 'adult' ? '/globals-adult.css' : '/globals-kids.css';
      
      link.onload = () => {
        console.log(`${mode} theme CSS loaded successfully`);
      };
      
      link.onerror = () => {
        console.error(`Failed to load ${mode} theme CSS`);
        // Fallback to default styles if CSS fails to load
        console.log('Falling back to default styles');
      };
      
      document.head.appendChild(link);
    };

    initializeTheme();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        await initializeTheme();
      } else if (event === 'SIGNED_OUT') {
        setDisplayMode('adult');
        applyTheme('adult');
      }
    });

    // Listen for storage events (when user updates profile in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'display_mode_changed') {
        console.log('Display mode changed in another tab, refreshing...');
        initializeTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [supabase]);
*/
  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="adult-mode">{children}</div>;
  }

  return (
    <div className={`${displayMode}-mode`}>
      {children}
    </div>
  );
}