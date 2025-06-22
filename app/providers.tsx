// app/providers.tsx
'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { useProfileSync } from '@/hooks/use-profile-sync';

export function Providers({ children }: { children: React.ReactNode }) {
  // This hook will run on every page and ensure profiles are synced
  useProfileSync();
  
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}