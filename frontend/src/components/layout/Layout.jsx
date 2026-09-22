import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

const Layout = ({ children, showRightSidebar = true }) => {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <Navbar />
      {/*
        Mobile: Navbar = top bar (h-14) + expandable search (0 or ~h-12) + bottom nav (~h-[52px])
        Keep pt-28 on mobile to safely clear the top bar + bottom nav.
        Desktop (md+): only top bar (h-14), so pt-16 is fine.
        Bottom padding:
        - Mobile: pb-16 clears the fixed bottom nav bar
        - Desktop: pb-4
      */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-28 md:pt-16 pb-16 md:pb-6">
        <div className="flex gap-4 lg:gap-5 mt-2 md:mt-4">
          <Sidebar />
          <main className="flex-1 min-w-0 space-y-3 sm:space-y-4">
            {children}
          </main>
          {showRightSidebar && <RightSidebar />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
