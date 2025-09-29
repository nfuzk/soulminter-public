import React from 'react';
import { AppBar } from '../AppBar';
import Notification from '../Notification';
import { AffiliateTracker } from '../AffiliateTracker';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <AffiliateTracker />
      <AppBar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Notification />
    </div>
  );
}; 